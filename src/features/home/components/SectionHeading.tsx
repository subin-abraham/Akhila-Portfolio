import type { HomepageSectionContent } from '@/types/home/homepage-section';

export interface SectionHeadingProps {
  section: HomepageSectionContent;
  headingId: string;
  headingClassName?: string;
  titleMotionAttr?: string;
  maskTitle?: boolean;
  variant?: 'default' | 'inCard';
  hideDescription?: boolean;
}

export function SectionHeading({
  section,
  headingId,
  headingClassName,
  titleMotionAttr,
  maskTitle = false,
  variant = 'default',
  hideDescription = false,
}: SectionHeadingProps) {
  const isInCard = variant === 'inCard';
  const resolvedHeadingClassName =
    headingClassName ??
    (isInCard
      ? 'font-display text-2xl font-normal tracking-tight text-home-heading sm:text-[1.75rem]'
      : 'font-display text-3xl font-semibold tracking-tight sm:text-4xl');
  const hasAccentTitle = Boolean(section.accentTitle?.trim());
  const highlightTitle =
    !hasAccentTitle || section.highlightTarget === 'title';
  const highlightAccent =
    hasAccentTitle && section.highlightTarget === 'accent';

  const titleClassName =
    !isInCard && highlightTitle ? 'text-home-accent' : 'text-home-heading';
  const accentClassName =
    !isInCard && highlightAccent ? 'text-home-accent' : 'text-home-heading';
  const motionProps = titleMotionAttr
    ? { [titleMotionAttr]: true }
    : undefined;
  const showDescription = !hideDescription && !isInCard;
  const showEyebrow = !isInCard && Boolean(section.eyebrow?.trim());

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
    <div
      className={
        isInCard
          ? 'flex flex-col gap-1'
          : 'flex max-w-3xl flex-col gap-3 sm:gap-4'
      }
    >
      {showEyebrow ? (
        <p className="text-sm text-home-muted">{section.eyebrow}</p>
      ) : null}
      {maskTitle ? (
        <div className="overflow-hidden">
          <h2 id={headingId} className={resolvedHeadingClassName}>
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
        <h2 id={headingId} className={resolvedHeadingClassName}>
          {renderTitlePart(section.title, titleClassName)}
          {hasAccentTitle ? (
            <>
              {' '}
              {renderTitlePart(section.accentTitle ?? '', accentClassName)}
            </>
          ) : null}
        </h2>
      )}
      {showDescription ? (
        maskTitle ? (
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
        )
      ) : null}
    </div>
  );
}
