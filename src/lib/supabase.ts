
import { supabase } from "@/integrations/supabase/client";
import type { LeadStatus } from "@/types/leads";

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
  } catch (error) {
    console.error('Error in updateLeadStatus function:', error);
    throw error;
  }
}
