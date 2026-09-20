import type { WorkedWithItem } from '@/types/home/worked-with';

export interface WorkedWithSectionProps {
  items: WorkedWithItem[];
}

export interface CompanyRowProps {
  items: WorkedWithItem[];
  keyPrefix: string;
  inert?: boolean;
}
