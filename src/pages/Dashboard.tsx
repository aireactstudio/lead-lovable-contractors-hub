import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus } from '@/lib/supabase';
import Header from '@/components/Header';
import LeadTable from '@/components/LeadTable';
import StatsCard from '@/components/StatsCard';
import { toast } from '@/components/ui/sonner';
import type { Lead, LeadStatus } from '@/types/leads';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Attempting to fetch leads...');
        const fetchedLeads = await getLeads();
        console.log('Leads fetched:', fetchedLeads);
        setLeads(fetchedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setError('Failed to fetch leads. Please try again later.');
        toast.error('Failed to fetch leads');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    
    try {
      await updateLeadStatus(leadId, newStatus);
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead status');
      
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { 
            ...lead, 
            status: leads.find(l => l.id === leadId)?.status || lead.status 
          } : lead
        )
      );
    }
  };

  const handleUpdateScore = async (leadId: string, newScore: number) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, lead_score: newScore } : lead
      )
    );
    
    try {
      await updateLeadScore(leadId, newScore);
      toast.success('Lead score updated successfully');
    } catch (error) {
      console.error('Error updating lead score:', error);
      toast.error('Failed to update lead score');
      
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { 
            ...lead, 
            lead_score: leads.find(l => l.id === leadId)?.lead_score || lead.lead_score 
          } : lead
        )
      );
    }
  };

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    interested: leads.filter(lead => lead.status === 'interested').length,
    closed: leads.filter(lead => lead.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Lead Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your contractor leads</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total Leads" value={stats.totalLeads} />
          <StatsCard title="New" value={stats.newLeads} />
          <StatsCard title="Contacted" value={stats.contacted} />
          <StatsCard title="Interested" value={stats.interested} />
          <StatsCard title="Closed" value={stats.closed} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Contractor Leads</h2>
            <div className="flex items-center space-x-2">
              {/* Add filter controls here if needed */}
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <p>Loading leads...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          ) : (
            <LeadTable 
              leads={leads} 
              onUpdateStatus={handleUpdateStatus}
              onUpdateScore={handleUpdateScore}
            />
          )}
        </div>
      </main>
    </div>
  );
}
