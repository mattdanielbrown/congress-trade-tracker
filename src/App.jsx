import React from 'react';
import Layout from './components/Layout';
import { Button } from '@/components/ui/button';
import { useDataSync } from './hooks/useDataSync';
import useMemberStore from './store/useMemberStore';
import { TradesTable } from './components/TradesTable';
import { SectorHeatmap } from './components/SectorHeatmap';

function App() {
  useDataSync();
  const { trades, signals, getTotalTrades30d, getTopSectors } = useMemberStore();

  const totalTrades = getTotalTrades30d();
  const topSectors = getTopSectors();
  const mainSector = topSectors.length > 0 ? topSectors[0] : { sector: 'N/A', percentage: 0 };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero / Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Trades (30d)</h3>
            <p className="text-3xl font-bold">{totalTrades}</p>
            <div className="text-xs text-green-500 font-medium">Dynamically Calculated</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Top Sector Exposure</h3>
            <p className="text-3xl font-bold">{mainSector.sector}</p>
            <div className="text-xs text-slate-500 font-medium">{mainSector.percentage}% of all disclosures</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Potential Conflicts</h3>
            <p className="text-3xl font-bold text-red-500">24</p>
            <div className="text-xs text-red-500/80 font-medium">High priority alerts active</div>
          </div>
        </section>

        {/* Heatmap Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Portfolio Sector Heatmap</h2>
          <SectorHeatmap data={topSectors} />
        </section>

        {/* Main Content Area */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Trades Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Latest Disclosures</h2>
              <Button variant="outline" size="sm" className="text-xs">View All Trades</Button>
            </div>
            <TradesTable data={trades} />
          </div>

          {/* High-Conviction Signals / Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              High-Conviction Signals
            </h2>
            <p className="text-xs text-slate-500 mb-4 italic">Detected trade clusters signaling potential insider movement.</p>
            <div className="space-y-3">
              {signals.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-xl">
                  No high-conviction signals detected in current timeframe.
                </div>
              )}
              {signals.slice(0, 5).map((signal, i) => (
                <div key={i} className="p-4 bg-slate-900 border border-blue-500/20 rounded-xl space-y-2 group hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{signal.ticker}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${signal.signal.includes('Buy') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {signal.signal}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Confidence</div>
                      <div className="text-sm font-bold text-blue-400">{signal.confidence}%</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-blue-400 font-medium">{signal.count} Legislators</span>: {signal.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(n => (
                        <div key={n} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold">M{n}</div>
                      ))}
                      {signal.count > 3 && <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold">+{signal.count - 3}</div>}
                    </div>
                    <Button variant="link" className="p-0 h-auto text-[10px] text-blue-400 group-hover:text-blue-300">Detailed Analysis →</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </Layout>
  );
}

export default App;
