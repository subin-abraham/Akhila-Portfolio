import Image from 'next/image';

import type {
  LogoRowProps,
  WorkedWithSectionProps,
} from '@/types/components/worked-with-section';

function LogoRow({ items, keyPrefix, inert = false }: LogoRowProps) {
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
          <Image
            src={item.logoUrl}
            alt={inert ? '' : `${item.name} logo`}
            width={110}
            height={32}
            unoptimized
            className="h-7 w-auto opacity-80"
          />
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
          <LogoRow items={items} keyPrefix="a" />
          <LogoRow items={items} keyPrefix="b" inert />
        </div>
      </div>
    </section>
  );
}
