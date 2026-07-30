/** Shared types for the multi-tech field site registry. */

export type SiteStatus = "approved" | "pending" | "ghosted";
export type ContributionStatus = "pending" | "approved" | "ghosted";

/** What the tech was doing when we asked micro-questions. */
export type SurveyContext =
  | "general"
  | "create_site"
  | "topography"
  | "tanks"
  | "networking"
  | "forecourt"
  | "pos"
  | "atg"
  | "service_call"
  | "quote";

export type FieldSite = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  lat: number | null;
  lon: number | null;
  miles_from_base: number | null;
  phone: string | null;
  osm_id: string | null;
  source: string;
  status: SiteStatus;
  survey_json: string;
  completeness: number;
  notes: string | null;
  created_by: string | null;
  last_touched_by: string | null;
};

export type SiteSuggestion = {
  id: string;
  name: string;
  brand: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  miles_from_base: number | null;
  status: SiteStatus;
  completeness: number;
  label: string;
  score: number;
};

export type DuplicateMatch = {
  site: SiteSuggestion;
  reason: string;
};

export type SurveyAnswerMap = Record<string, string>;

export type ContributionRow = {
  id: string;
  created_at: string;
  site_id: string | null;
  contributor_name: string | null;
  contributor_phone: string | null;
  contributor_email: string | null;
  context: string;
  answers_json: string;
  terms_accepted: boolean;
  status: ContributionStatus;
  review_note: string | null;
  site_name?: string | null;
};

export type CreateSiteInput = {
  name: string;
  brand?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  lat?: number | null;
  lon?: number | null;
  notes?: string;
  forceCreate?: boolean;
  contributorName?: string;
  contributorPhone?: string;
  contributorEmail?: string;
  termsAccepted: boolean;
  answers?: SurveyAnswerMap;
  context?: SurveyContext;
};

export type ContributeInput = {
  siteId: string;
  context: SurveyContext;
  answers: SurveyAnswerMap;
  contributorName?: string;
  contributorPhone?: string;
  contributorEmail?: string;
  termsAccepted: boolean;
};
