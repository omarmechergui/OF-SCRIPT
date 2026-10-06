import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-red-500/30 flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-6 sticky top-0 h-screen overflow-y-auto">
        <div className="text-xl font-bold tracking-tighter uppercase mb-4">
          <span className="text-red-500">OFF</span>SCRIPT <span className="text-xs text-gray-500">ADMIN</span>
        </div>
        
        <div className="space-y-1 text-sm font-medium">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Overview</div>
          <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Dashboard</Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Users</Link>
        </div>
        
        <div className="space-y-1 text-sm font-medium">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform</div>
          <Link href="/admin/projects" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Projects</Link>
          <Link href="/admin/competitions" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Competitions</Link>
        </div>
        
        <div className="space-y-1 text-sm font-medium">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gamification</div>
          <Link href="/admin/badges" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Badges</Link>
          <Link href="/admin/rewards" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Reward Rules</Link>
          <Link href="/admin/points" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Point Adjustments</Link>
        </div>
        
        <div className="space-y-1 text-sm font-medium">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System</div>
          <Link href="/admin/audit-logs" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-red-400 transition-colors">Audit Logs</Link>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-800">
          <Link href="/dashboard" className="block px-3 py-2 rounded-md text-sm hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors">
            Exit Admin Area
          </Link>
        </div>
      </nav>
      
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
