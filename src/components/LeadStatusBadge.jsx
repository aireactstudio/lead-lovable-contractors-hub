
import React from 'react';
import { cn } from '@/lib/utils';

const statusColors = {
  new: 'bg-status-new text-white',
  contacted: 'bg-status-contacted text-white',
  interested: 'bg-status-interested text-white',
  closed: 'bg-status-closed text-white',
};

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  closed: 'Closed',
};

export default function LeadStatusBadge({ status }) {
  return (
    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', statusColors[status] || 'bg-gray-200 text-gray-800')}>
      {statusLabels[status] || status}
    </span>
  );
}
