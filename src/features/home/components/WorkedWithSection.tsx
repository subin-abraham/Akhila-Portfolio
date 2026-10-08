import type {
  CompanyRowProps,
  WorkedWithSectionProps,
} from '@/types/components/worked-with-section';

function CompanyRow({ items, keyPrefix, inert = false }: CompanyRowProps) {
  return (
    <ul
      className="flex shrink-0 items-center gap-3 pr-3"
      aria-hidden={inert ? true : undefined}
    >
      {items.map((item) => (
        <li
          key={`${keyPrefix}-${item.id}`}
          className="flex h-14 w-40 shrink-0 items-center justify-center rounded-lg border border-home-border bg-home-logo px-4 sm:w-44"
        >
          <span className="truncate text-sm font-medium tracking-wide text-home-heading/85">
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function WorkedWithSection({ items }: WorkedWithSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="recent-work"
      aria-labelledby="worked-with-heading"
      className="home-bento-card scroll-mt-28"
    >
      <h2
        id="worked-with-heading"
        className="bento-card-title text-[1.5rem] sm:text-[1.65rem]"
      >
        Worked with
      </h2>
      <div className="worked-with-marquee">
        <div className="worked-with-track">
          <CompanyRow items={items} keyPrefix="a" />
          <CompanyRow items={items} keyPrefix="b" inert />
        </div>
      </div>
    </section>
  );
}
