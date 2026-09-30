export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-home-bg">
      {children}
    </div>
  );
}
