
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Lead, LeadStatus } from '@/types/leads';
import LeadStatusBadge from './LeadStatusBadge';
import { ExternalLink } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onUpdateScore: (leadId: string, score: number) => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateScore
}: LeadDetailModalProps) {
  const [leadScore, setLeadScore] = React.useState<number>(0);

  React.useEffect(() => {
    if (lead) {
      setLeadScore(lead.lead_score || 0);
    }
  }, [lead]);

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lead.business_name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Owner:</span> {lead.owner_name || 'Not available'}</p>
                <p><span className="text-muted-foreground">Email:</span> {lead.email || 'Not available'}</p>
                <p><span className="text-muted-foreground">Phone:</span> {lead.phone_number || 'Not available'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Business Details</h3>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Location:</span> {lead.city}, {lead.state}</p>
                <p><span className="text-muted-foreground">Category:</span> {lead.service_category}</p>
                <p><span className="text-muted-foreground">Source:</span> {lead.source}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Online Presence</h3>
            <div className="space-y-2">
              {lead.website && (
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Website:</span>
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                    {lead.website} <ExternalLink className="h-4 w-4" />
                  </a>
                </p>
              )}
              {lead.profile_url && (
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Profile:</span>
                  <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                    View Profile <ExternalLink className="h-4 w-4" />
                  </a>
                </p>
              )}
              <div className="flex items-center gap-4">
                <p><span className="text-muted-foreground">Reviews:</span> {lead.review_count}</p>
                <p><span className="text-muted-foreground">Score:</span> {lead.review_score || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Lead Management</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label htmlFor="leadScore">Lead Score</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="leadScore"
                    type="number"
                    value={leadScore}
                    onChange={(e) => setLeadScore(Number(e.target.value))}
                    className="max-w-[100px]"
                    min={0}
                    max={100}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateScore(lead.id, leadScore)}
                  >
                    Update Score
                  </Button>
                </div>
              </div>

              <div>
                <Label>Current Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <LeadStatusBadge status={lead.status} />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={lead.status === 'contacted' ? 'default' : 'outline'}
                    onClick={() => onUpdateStatus(lead.id, 'contacted')}
                    disabled={lead.status === 'contacted'}
                  >
                    Mark Contacted
                  </Button>
                  <Button
                    size="sm"
                    variant={lead.status === 'interested' ? 'default' : 'outline'}
                    onClick={() => onUpdateStatus(lead.id, 'interested')}
                    disabled={lead.status === 'interested'}
                  >
                    Mark Interested
                  </Button>
                  <Button
                    size="sm"
                    variant={lead.status === 'closed' ? 'default' : 'outline'}
                    onClick={() => onUpdateStatus(lead.id, 'closed')}
                    disabled={lead.status === 'closed'}
                  >
                    Mark Closed
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
