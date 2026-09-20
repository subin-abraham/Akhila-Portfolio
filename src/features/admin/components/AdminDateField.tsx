'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import { ADMIN_FIELD_CLASS } from '@/features/admin/components/AdminFormPrimitives';
import type { AdminDateFieldProps } from '@/types/components/admin-shell';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const DISPLAY_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function parseISODate(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(viewMonth: Date): (Date | null)[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const cells: (Date | null)[] = [];

  for (let index = 0; index < startWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function AdminDateField({
  id,
  name,
  label,
  defaultValue = '',
  required = false,
  describedBy,
  invalid = false,
}: AdminDateFieldProps) {
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const initialDate = parseISODate(defaultValue);
  const [value, setValue] = useState(defaultValue);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [viewMonth, setViewMonth] = useState(
    () => initialDate ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});

  const displayValue = selectedDate ? DISPLAY_FORMATTER.format(selectedDate) : '';
  const calendarDays = buildCalendarDays(viewMonth);
  const today = new Date();
  const monthLabel = `${MONTH_LABELS[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const popoverWidth = Math.max(rect.width, 288);
      const estimatedHeight = 340;
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const openAbove = spaceBelow < estimatedHeight && rect.top > spaceBelow;
      const left = Math.min(
        Math.max(8, rect.left),
        window.innerWidth - popoverWidth - 8,
      );
      const top = openAbove
        ? Math.max(8, rect.top - estimatedHeight - gap)
        : rect.bottom + gap;

      setPopoverStyle({
        position: 'fixed',
        top,
        left,
        width: popoverWidth,
        zIndex: 100,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [isOpen]);

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setValue(toISODate(date));
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const clearDate = () => {
    setSelectedDate(null);
    setValue('');
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const goToToday = () => {
    const now = new Date();
    selectDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  const shiftMonth = (delta: number) => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onFocus={() => triggerRef.current?.focus()}
      />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        title={label}
        aria-label={selectedDate ? `${label}: ${displayValue}` : `${label}: choose a date`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-required={required}
        onClick={() => setIsOpen((open) => !open)}
        className={`${ADMIN_FIELD_CLASS} flex items-center justify-between gap-3 text-left`}
      >
        <span className={displayValue ? 'text-white' : 'text-home-muted'}>
          {displayValue || 'Select date'}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4 shrink-0 text-home-muted"
          fill="none"
        >
          <rect
            x="3.75"
            y="5.75"
            width="16.5"
            height="14.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M8 3.75v3.5M16 3.75v3.5M3.75 10h16.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen
        ? createPortal(
            <div
              ref={popoverRef}
              id={listboxId}
              role="dialog"
              aria-modal="false"
              aria-label={`${label} calendar`}
              style={popoverStyle}
              className="rounded-xl border border-white/12 bg-[#161616] p-3 shadow-[0_20px_48px_rgb(0_0_0/0.55)]"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <button
                  id={`${id}-prev-month`}
                  type="button"
                  title="Previous month"
                  aria-label="Previous month"
                  onClick={() => shiftMonth(-1)}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:border-home-accent/40 hover:bg-white/10"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <p className="font-display text-sm font-semibold text-white">{monthLabel}</p>
                <button
                  id={`${id}-next-month`}
                  type="button"
                  title="Next month"
                  aria-label="Next month"
                  onClick={() => shiftMonth(1)}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:border-home-accent/40 hover:bg-white/10"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-1">
                {WEEKDAY_LABELS.map((weekday) => (
                  <span
                    key={weekday}
                    className="py-1 text-center text-[0.7rem] font-medium tracking-wide text-home-muted uppercase"
                  >
                    {weekday}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <span key={`empty-${index}`} className="size-9" />;
                  }

                  const iso = toISODate(date);
                  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                  const isToday = isSameDay(date, today);

                  return (
                    <button
                      key={iso}
                      id={`${id}-day-${iso}`}
                      type="button"
                      title={DISPLAY_FORMATTER.format(date)}
                      aria-label={DISPLAY_FORMATTER.format(date)}
                      aria-pressed={isSelected}
                      onClick={() => selectDate(date)}
                      className={`inline-flex size-9 items-center justify-center rounded-lg text-sm transition ${
                        isSelected
                          ? 'bg-home-accent font-semibold text-home-ink'
                          : isToday
                            ? 'border border-home-accent/50 text-home-accent hover:bg-white/10'
                            : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                <button
                  id={`${id}-clear`}
                  type="button"
                  title="Clear date"
                  aria-label="Clear date"
                  onClick={clearDate}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-home-muted transition hover:bg-white/5 hover:text-white"
                >
                  Clear
                </button>
                <button
                  id={`${id}-today`}
                  type="button"
                  title="Select today"
                  aria-label="Select today"
                  onClick={goToToday}
                  className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-home-accent transition hover:bg-home-accent/10"
                >
                  Today
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
