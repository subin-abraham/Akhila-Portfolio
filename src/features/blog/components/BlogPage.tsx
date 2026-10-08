'use client';

import { useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { BlogPostModal } from '@/features/blog/components/BlogPostModal';
import { formatPublishedOn } from '@/features/blog/lib/format-published-on';
import { SectionHeading } from '@/features/home/components/SectionHeading';
import type { BlogPageProps } from '@/types/components/blog-page';
import type { BlogPost } from '@/types/home/blog';

export function BlogPage({ data }: BlogPageProps) {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const hasPosts = data.posts.length > 0;

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-12">
        <div className="flex flex-col gap-8 sm:gap-10">
          <SectionHeading section={data.section} headingId="blog-heading" />

          {hasPosts ? (
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {data.posts.map((post) => {
                const publishedLabel = formatPublishedOn(post.publishedOn);

                return (
                  <li key={post.id}>
                    <button
                      id={`blog-post-${post.slug}`}
                      type="button"
                      title={`Read ${post.title}`}
                      aria-label={`Read ${post.title}`}
                      onClick={() => setActivePost(post)}
                      className="group flex h-full w-full cursor-pointer flex-col gap-3 rounded-2xl border border-home-border bg-home-surface p-5 text-left transition hover:border-home-accent/40 hover:bg-home-surface-hover sm:p-6"
                    >
                      <p className="text-sm font-medium text-home-accent">
                        <time dateTime={post.publishedOn}>{publishedLabel}</time>
                      </p>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-home-heading sm:text-2xl">
                        {post.title}
                      </h3>
                      <p className="flex-1 text-base leading-7 text-home-muted">
                        {post.excerpt}
                      </p>
                      <span className="mt-1 text-sm font-medium text-home-accent transition group-hover:translate-x-0.5">
                        Read more
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              title="No posts yet"
              description="Articles and notes will show up here once they are published."
            />
          )}
        </div>
      </div>

      {activePost ? (
        <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
      ) : null}
    </>
  );
}
