import type { HomepageSectionContent } from '@/types/home/homepage-section';

export interface SectionHeadingProps {
  section: HomepageSectionContent;
  headingId: string;
  headingClassName?: string;
  titleMotionAttr?: string;
  maskTitle?: boolean;
}

export function SectionHeading({
  section,
  headingId,
  headingClassName = 'font-display text-3xl font-semibold tracking-tight sm:text-4xl',
  titleMotionAttr,
  maskTitle = false,
}: SectionHeadingProps) {
  const hasAccentTitle = Boolean(section.accentTitle?.trim());
  const highlightTitle =
    !hasAccentTitle || section.highlightTarget === 'title';
  const highlightAccent =
    hasAccentTitle && section.highlightTarget === 'accent';

  const titleClassName = highlightTitle ? 'text-home-accent' : 'text-white';
  const accentClassName = highlightAccent ? 'text-home-accent' : 'text-white';
  const motionProps = titleMotionAttr
    ? { [titleMotionAttr]: true }
    : undefined;

  function renderTitlePart(text: string, className: string) {
    const content = (
      <span {...motionProps} className={`inline-block ${className}`}>
        {text}
      </span>
    );

    if (!maskTitle) {
      return content;
    }

    return (
      <span className="inline-block overflow-hidden align-bottom">{content}</span>
    );
  }

  return (
    <div className="flex max-w-3xl flex-col gap-3 sm:gap-4">
      <p className="text-sm text-home-muted">{section.eyebrow}</p>
      {maskTitle ? (
        <div className="overflow-hidden">
          <h2 id={headingId} className={headingClassName}>
            {renderTitlePart(section.title, titleClassName)}
            {hasAccentTitle ? (
              <>
                {' '}
                {renderTitlePart(section.accentTitle ?? '', accentClassName)}
              </>
            ) : null}
          </h2>
        </div>
      ) : (
        <h2 id={headingId} className={headingClassName}>
          {renderTitlePart(section.title, titleClassName)}
          {hasAccentTitle ? (
            <>
              {' '}
              {renderTitlePart(section.accentTitle ?? '', accentClassName)}
            </>
          ) : null}
        </h2>
      )}
      {maskTitle ? (
        <div className="overflow-hidden">
          <p
            {...motionProps}
            className="max-w-2xl text-base leading-7 text-home-muted sm:text-lg sm:leading-8"
          >
            {section.description}
          </p>
        </div>
      ) : (
        <p className="max-w-2xl text-base leading-7 text-home-muted sm:text-lg sm:leading-8">
          {section.description}
        </p>
      )}
    </div>
  );
}
