
import React, { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus } from '@/lib/supabase';
import Header from '@/components/Header';
import LeadTable from '@/components/LeadTable';
import StatsCard from '@/components/StatsCard';
import { toast } from '@/components/ui/sonner';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const fetchedLeads = await getLeads();
        setLeads(fetchedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to fetch leads');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId, newStatus) => {
    // Optimistic UI update
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    
    try {
      // Send update to server
      await updateLeadStatus(leadId, newStatus);
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead status');
      
      // Revert the optimistic update if there was an error
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

  // Calculate stats
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
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          ) : (
            <LeadTable leads={leads} onUpdateStatus={handleUpdateStatus} />
          )}
        </div>
      </main>
    </div>
  );
}
