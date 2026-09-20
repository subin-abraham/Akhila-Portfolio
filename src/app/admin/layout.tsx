export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return <div className="h-dvh overflow-hidden bg-home-bg">{children}</div>;
}
