import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              CTS
            </div>
            <h1 className="text-xl font-bold tracking-tight">CongressTrade <span className="text-blue-500">Sentinel</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Politicians</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Trends</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Alerts</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-xs px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-medium">
              LIVE DATA
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} CongressTrade Sentinel. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
