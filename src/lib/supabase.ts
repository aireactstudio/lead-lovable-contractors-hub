
import { supabase } from "@/integrations/supabase/client";
import type { Lead, LeadStatus } from "@/types/leads";

export async function getLeads() {
  try {
    console.log('Fetching leads...');
    const { data, error } = await supabase
      .from('contractor_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }

    console.log('Leads fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getLeads function:', error);
    throw error;
  }
}

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
  try {
    console.log('Updating lead status...', { leadId, newStatus });
    
    const { data, error } = await supabase.functions.invoke('leads-api', {
      body: { id: leadId, status: newStatus },
      method: 'PUT',
    })

    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }

    console.log('Lead status updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateLeadStatus function:', error);
    throw error;
  }
}

export async function updateLeadScore(leadId: string, newScore: number) {
  try {
    console.log('Updating lead score...', { leadId, newScore });
    
    const { data, error } = await supabase.functions.invoke('leads-api', {
      body: { id: leadId, lead_score: newScore },
      method: 'PUT',
    })

    if (error) {
      console.error('Error updating lead score:', error);
      throw error;
    }

    console.log('Lead score updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateLeadScore function:', error);
    throw error;
  }
}

export async function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'status'>) {
  try {
    console.log('Creating new lead...', leadData);
    
    const { data, error } = await supabase.functions.invoke('leads-api', {
      body: leadData,
      method: 'POST',
    })

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }

    console.log('Lead created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createLead function:', error);
    throw error;
  }
}
