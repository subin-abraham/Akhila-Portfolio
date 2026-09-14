export interface FooterContent {
  id: string;
  brandName: string;
  tagline: string;
  statusLabel: string;
  ctaLabel: string;
  ctaHref: string;
  copyrightName: string;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
}

export interface FooterLinkColumn {
  columnKey: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterData {
  content: FooterContent;
  columns: FooterLinkColumn[];
}
