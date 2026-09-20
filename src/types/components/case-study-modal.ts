import type { CaseStudy } from '@/types/home/case-study';

export interface CaseStudyModalProps {
  item: CaseStudy;
  onClose: () => void;
}
