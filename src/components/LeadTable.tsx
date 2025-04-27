import React from 'react';
import type { Lead, LeadStatus } from '@/types/leads';
import LeadStatusBadge from './LeadStatusBadge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LeadTableProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
}

export default function LeadTable({ leads, onUpdateStatus }: LeadTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Business</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr 
              key={lead.id} 
              className="bg-white hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{lead.business_name}</p>
                  <p className="text-xs text-muted-foreground">{lead.service_category}</p>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <p className="text-sm">{lead.owner_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{lead.email || lead.phone_number || 'No contact info'}</p>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <p className="text-sm">{lead.city}, {lead.state}</p>
                  <p className="text-xs text-muted-foreground">Source: {lead.source}</p>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{lead.lead_score}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{lead.review_score}</span>
                    <span className="mx-1">•</span>
                    <span>{lead.review_count} reviews</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant={lead.status === 'contacted' ? 'default' : 'outline'}
                          onClick={() => onUpdateStatus(lead.id, 'contacted')}
                          disabled={lead.status === 'contacted'}
                        >
                          Contacted
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as contacted</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant={lead.status === 'interested' ? 'default' : 'outline'}
                          onClick={() => onUpdateStatus(lead.id, 'interested')}
                          disabled={lead.status === 'interested'}
                        >
                          Interested
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as interested</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant={lead.status === 'closed' ? 'default' : 'outline'}
                          onClick={() => onUpdateStatus(lead.id, 'closed')}
                          disabled={lead.status === 'closed'}
                        >
                          Closed
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as closed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
