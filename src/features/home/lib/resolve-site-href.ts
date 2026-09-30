export function resolveSiteHref(href: string) {
  if (href.startsWith('#') && href.length > 1) {
    return `/${href}`;
  }

  return href;
}
