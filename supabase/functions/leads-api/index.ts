
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
      }
    }
  )

  try {
    if (req.method === 'POST') {
      // Create new lead
      const { business_name, city, state, service_category, source, ...otherFields } = await req.json()
      
      // Validate required fields
      if (!business_name || !city || !state || !service_category || !source) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabaseClient
        .from('contractor_leads')
        .insert([
          {
            business_name,
            city,
            state,
            service_category,
            source,
            ...otherFields,
            status: 'new'
          }
        ])
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'PUT') {
      const requestBody = await req.json()
      const { id } = requestBody
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create an object with fields to update
      const updateData: Record<string, any> = {}
      
      // Handle status update
      if (requestBody.status) {
        updateData.status = requestBody.status
        // Update last_contacted timestamp if the status is being changed to 'contacted'
        if (requestBody.status === 'contacted') {
          updateData.last_contacted = new Date().toISOString()
        }
      }
      
      // Handle lead score update
      if (typeof requestBody.lead_score === 'number') {
        updateData.lead_score = requestBody.lead_score
      }

      // If no fields to update, return error
      if (Object.keys(updateData).length === 0) {
        return new Response(
          JSON.stringify({ error: 'No fields to update provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabaseClient
        .from('contractor_leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
