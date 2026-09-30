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
          className="flex h-14 w-40 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-home-logo px-4 sm:w-44"
        >
          <span className="truncate text-sm font-medium tracking-wide text-white/85">
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function WorkedWithSection({ items }: WorkedWithSectionProps) {
  return (
    <section aria-label="Worked with" className="flex flex-col gap-4">
      <p className="text-sm text-home-muted">Worked with</p>
      <div className="worked-with-marquee">
        <div className="worked-with-track">
          <CompanyRow items={items} keyPrefix="a" />
          <CompanyRow items={items} keyPrefix="b" inert />
        </div>
      </div>
    </section>
  );
}
