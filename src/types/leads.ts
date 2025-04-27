
export type LeadStatus = 'new' | 'contacted' | 'interested' | 'closed';

export interface Lead {
  id: string;
  business_name: string;
  owner_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  review_count: number;
  review_score: number | null;
  city: string;
  state: string;
  service_category: string;
  source: string;
  profile_url: string | null;
  website_status: string | null;
  lead_score: number | null;
  last_contacted: string | null;
  status: LeadStatus;
  created_at: string;
}
