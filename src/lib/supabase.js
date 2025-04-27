
import { supabase } from "@/integrations/supabase/client";

export async function getLeads() {
  const { data, error } = await supabase
    .from('contractor_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data;
}

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
  const { data, error } = await supabase
    .from('contractor_leads')
    .update({ 
      status: newStatus,
      last_contacted: newStatus === 'contacted' ? new Date().toISOString() : undefined 
    })
    .eq('id', leadId)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead:', error);
    throw error;
  }

  return data;
}
