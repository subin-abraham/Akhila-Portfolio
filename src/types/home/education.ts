export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  period: string;
  grade: string | null;
  description: string;
  sortOrder: number;
}
