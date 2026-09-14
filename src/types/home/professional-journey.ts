export interface ProfessionalJourneyItem {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  period: string;
  description: string;
  sortOrder: number;
}
