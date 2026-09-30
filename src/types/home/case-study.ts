export interface CaseStudy {
  id: string;
  title: string;
  client: string | null;
  period: string;
  summary: string;
  description: string;
  sortOrder: number;
}
