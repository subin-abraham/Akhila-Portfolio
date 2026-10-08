import type { BlogPost } from '@/types/home/blog';
import type { HomepageSectionContent } from '@/types/home/homepage-section';

export interface BlogPageData {
  section: HomepageSectionContent;
  posts: BlogPost[];
}

export interface BlogPageProps {
  data: BlogPageData;
}
