import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Home, Package, ShoppingCart, Users, FileText, Printer, Settings, LogOut, Menu, X, Store, ChevronRight } from 'lucide-react';

export default function DashboardLayout() {
  const { user, shop, logout, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Billing', href: '/billing', icon: ShoppingCart },
    { name: 'Categories', href: '/categories', icon: Package },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Bills', href: '/bills', icon: FileText },
    { name: 'Printer', href: '/printer', icon: Printer },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-slate-950/50 md:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 md:static md:w-64 md:translate-x-0 md:shadow-none ${sidebarOpen ? 'translate-x-0' : ''}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/25"><Store className="h-5 w-5" /></div>
            <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">SmartShop</p><h1 className="truncate text-base font-bold">{shop?.shop_name || 'Retail workspace'}</h1></div>
          </div>
          <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-300'}`} />
                    {item.name}
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={logout} className="flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 md:hidden">{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            <h2 className="truncate text-lg font-bold text-slate-900 md:text-xl">
            {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-right">
            <div className="hidden text-sm sm:block"><p className="text-xs text-slate-400">Welcome back</p><p className="font-semibold text-slate-700">{user.name}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">{user.name?.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
