export function resolveSiteHref(href: string) {
  if (href.startsWith('#') && href.length > 1) {
    return `/${href}`;
  }

  return href;
}

export function isExternalSiteHref(href: string) {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}
