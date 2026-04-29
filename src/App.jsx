import React from 'react';
import Layout from './components/Layout';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero / Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Trades (30d)</h3>
            <p className="text-3xl font-bold">1,284</p>
            <div className="text-xs text-green-500 font-medium">+12.5% from last month</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Top Sector Exposure</h3>
            <p className="text-3xl font-bold">Technology</p>
            <div className="text-xs text-slate-500 font-medium">34% of all disclosures</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Potential Conflicts</h3>
            <p className="text-3xl font-bold text-red-500">24</p>
            <div className="text-xs text-red-500/80 font-medium">High priority alerts active</div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Trades Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Latest Disclosures</h2>
              <Button variant="outline" size="sm" className="text-xs">View All Trades</Button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Politician</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Ticker</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Amount</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { name: 'Nancy Pelosi', ticker: 'NVDA', type: 'Buy', amount: '$1M - $5M', date: '2024-04-20' },
                    { name: 'Tommy Tuberville', ticker: 'TSLA', type: 'Sell', amount: '$15K - $50K', date: '2024-04-18' },
                    { name: 'Josh Gottheimer', ticker: 'MSFT', type: 'Buy', amount: '$1K - $15K', date: '2024-04-15' },
                    { name: 'Ro Khanna', ticker: 'AAPL', type: 'Buy', amount: '$50K - $100K', date: '2024-04-12' },
                    { name: 'Mark Alford', ticker: 'AMD', type: 'Sell', amount: '$1K - $15K', date: '2024-04-10' },
                  ].map((trade, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium">{trade.name}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold">{trade.ticker}</span></td>
                      <td className="p-4">
                        <span className={trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{trade.amount}</td>
                      <td className="p-4 text-slate-500 text-sm">{trade.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* High-Conviction Signals / Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              High-Conviction Signals
            </h2>
            <p className="text-xs text-slate-500 mb-4 italic">Detected trade clusters signaling potential insider movement.</p>
            <div className="space-y-3">
              {[
                { ticker: 'PLTR', signal: 'Strong Buy', confidence: 92, count: 5, description: '5 members from Defense & Intelligence committees purchased within 7 days.' },
                { ticker: 'ENPH', signal: 'Buy Cluster', confidence: 78, count: 3, description: 'Cluster detected in Energy sector following Green Energy bill markup.' },
                { ticker: 'RTX', signal: 'Symmetric Sell', confidence: 85, count: 4, description: 'Simultaneous sell-off by 4 members ahead of defense contract delay.' },
              ].map((signal, i) => (
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
