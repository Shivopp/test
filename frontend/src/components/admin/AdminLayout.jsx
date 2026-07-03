import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen bg-gray-50/50 overflow-hidden font-sans antialiased">
      {/* 1. Persistent Navigation Sidebar */}
      <Sidebar />

      {/* Right Core Content Column Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2. Horizontal Top App Bar Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">System Gateway Active</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">Admin Mode</p>
              <p className="text-xs text-gray-400 mt-0.5">Control Session</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm border border-purple-200">
              A
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC PAGES ACTION HUB RENDER CONTAINER */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {/* React Router mounts the nested sub-components dynamically inside here */}
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}