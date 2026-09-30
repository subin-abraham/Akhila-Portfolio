'use client';

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

import { ADMIN_FIELD_CLASS } from '@/features/admin/components/AdminFormPrimitives';
import { SocialPlatformIcon } from '@/features/home/components/SocialIcons';
import { isSocialPlatform } from '@/features/home/lib/social-platforms';
import type { AdminPlatformLookupProps } from '@/types/components/admin-shell';

interface ListboxPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

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
  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selectedOption?.label ?? '');
  const [value, setValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<ListboxPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized || currentOption?.label.toLowerCase() === normalized) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query, currentOption?.label]);

  const valueRef = useRef(value);
  const selectedPlatform = isSocialPlatform(value) ? value : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  function updatePosition() {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 6;
    const preferredHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const openUpward = spaceBelow < 160 && spaceAbove > spaceBelow;
    const available = openUpward ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(120, Math.min(preferredHeight, available - gap));

    if (openUpward) {
      setPosition({
        bottom: window.innerHeight - rect.top + gap,
        left: rect.left,
        width: rect.width,
        maxHeight,
      });
      return;
    }

    setPosition({
      top: rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  }

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    updatePosition();

    function handleReposition() {
      updatePosition();
    }

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, filteredOptions.length]);

  function closeLookup() {
    setOpen(false);
    const current = options.find((option) => option.value === valueRef.current);
    setQuery(current?.label ?? '');
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || listboxRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
      const current = options.find((option) => option.value === valueRef.current);
      setQuery(current?.label ?? '');
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open, options]);

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

  const listbox =
    open && mounted && position ? (
      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-label={label}
        style={{
          position: 'fixed',
          top: position.top,
          bottom: position.bottom,
          left: position.left,
          width: position.width,
          maxHeight: position.maxHeight,
        }}
        className="z-[120] overflow-y-auto rounded-xl border border-white/25 bg-[#1c1c1c] py-1.5 shadow-[0_16px_40px_rgb(0_0_0/0.75)] ring-1 ring-home-accent/20"
      >
        {filteredOptions.length === 0 ? (
          <li className="px-4 py-3 text-sm text-home-muted">No platforms found</li>
        ) : (
          filteredOptions.map((option, index) => {
            const isActive = index === activeIndex;
            const isSelected = option.value === value;
            const optionPlatform = isSocialPlatform(option.value) ? option.value : null;

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  id={`${id}-option-${option.value}`}
                  type="button"
                  title={option.label}
                  aria-label={option.label}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option.value, option.label)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                      isActive
                        ? 'bg-home-accent/20 text-home-accent'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                  {optionPlatform ? (
                    <span
                      className={`inline-flex size-5 shrink-0 items-center justify-center ${
                        isActive ? 'text-home-accent' : 'text-home-muted'
                      }`}
                      aria-hidden="true"
                    >
                      <SocialPlatformIcon platform={optionPlatform} />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">{option.label}</span>
                  {isSelected ? (
                    <span className="text-xs text-home-accent">Selected</span>
                  ) : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
    ) : null;

  return (
    <div ref={rootRef} className="relative space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input type="hidden" name={name} value={value} required={required} />
      <div ref={triggerRef} className="relative">
        {selectedPlatform ? (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 z-10 inline-flex w-11 items-center justify-center text-home-muted"
            aria-hidden="true"
          >
            <SocialPlatformIcon platform={selectedPlatform} />
          </span>
        ) : null}
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
          className={`${ADMIN_FIELD_CLASS} pr-10 ${selectedPlatform ? 'pl-11' : ''}`}
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

      {mounted && listbox ? createPortal(listbox, document.body) : null}
    </div>
  );
}
