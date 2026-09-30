import type { BlogPost } from '@/types/home/blog';

export interface BlogPostModalProps {
  post: BlogPost;
  onClose: () => void;
}
