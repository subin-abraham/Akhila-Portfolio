'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { ADMIN_FIELD_CLASS } from '@/features/admin/components/AdminFormPrimitives';
import type { AdminPlatformLookupProps } from '@/types/components/admin-shell';

export function AdminPlatformLookup({
  id,
  name,
  label,
  defaultValue,
  options,
  required = false,
  describedBy,
  invalid = false,
  placeholder = 'Search platforms…',
}: AdminPlatformLookupProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selectedOption?.label ?? '');
  const [value, setValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized || currentOption?.label.toLowerCase() === normalized) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query, currentOption?.label]);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  function closeLookup() {
    setOpen(false);
    const current = options.find((option) => option.value === valueRef.current);
    setQuery(current?.label ?? '');
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        const current = options.find((option) => option.value === valueRef.current);
        setQuery(current?.label ?? '');
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [options]);

  function selectOption(optionValue: string, optionLabel: string) {
    setValue(optionValue);
    setQuery(optionLabel);
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
      return;
    }

    if (!open) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) =>
        current + 1 >= filteredOptions.length ? 0 : current + 1,
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) =>
        current - 1 < 0 ? Math.max(filteredOptions.length - 1, 0) : current - 1,
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) {
        selectOption(option.value, option.label);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeLookup();
    }
  }

  return (
    <div ref={rootRef} className="relative space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input type="hidden" name={name} value={value} required={required} />
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={`${ADMIN_FIELD_CLASS} pr-10`}
        />
        <button
          id={`${id}-toggle`}
          type="button"
          title={open ? 'Close platform list' : 'Open platform list'}
          aria-label={open ? 'Close platform list' : 'Open platform list'}
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => {
            setOpen((current) => !current);
            inputRef.current?.focus();
          }}
          className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-home-muted transition hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
          >
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-white/15 bg-[#161616] py-1 shadow-xl"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-home-muted">No platforms found</li>
          ) : (
            filteredOptions.map((option, index) => {
              const isActive = index === activeIndex;
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    id={`${id}-option-${option.value}`}
                    type="button"
                    title={option.label}
                    aria-label={option.label}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option.value, option.label)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                      isActive ? 'bg-home-accent/15 text-home-accent' : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected ? (
                      <span className="text-xs text-home-accent">Selected</span>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
