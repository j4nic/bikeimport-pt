import React, { useMemo } from 'react';
import { Article } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Layers } from 'lucide-react';

interface Props {
  articles: Article[];
}

const AssortmentComparison: React.FC<Props> = ({ articles }) => {
  // --- Data Aggregation ---
  const { categoryStats, overallStats } = useMemo(() => {
    const catMap = new Map<string, { 
      total: number; 
      matched: number; 
      sumIndex: number; 
      cheaper: number; 
      expensive: number;
    }>();

    let globalSumIndex = 0;
    let globalMatched = 0;

    articles.forEach(a => {
      const current = catMap.get(a.category) || { total: 0, matched: 0, sumIndex: 0, cheaper: 0, expensive: 0 };
      
      current.total++;
      if (a.competitors.length > 0) {
        current.matched++;
        current.sumIndex += a.priceIndex;
        globalSumIndex += a.priceIndex;
        globalMatched++;

        if (a.priceIndex < 98) current.cheaper++;
        else if (a.priceIndex > 102) current.expensive++;
      }
      catMap.set(a.category, current);
    });

    const stats = Array.from(catMap.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      matched: data.matched,
      matchRate: (data.matched / data.total) * 100,
      avgIndex: data.matched > 0 ? data.sumIndex / data.matched : 100,
      cheaperPct: data.matched > 0 ? (data.cheaper / data.matched) * 100 : 0,
      expensivePct: data.matched > 0 ? (data.expensive / data.matched) * 100 : 0,
    }));

    // Sort by Index descending (most expensive categories first)
    stats.sort((a, b) => b.avgIndex - a.avgIndex);

    return {
      categoryStats: stats,
      overallStats: {
        globalIndex: globalMatched > 0 ? globalSumIndex / globalMatched : 100,
        totalArticles: articles.length,
        totalMatched: globalMatched
      }
    };
  }, [articles]);

  return (
    <div className="space-y-8">
      
      {/* --- Section 1: Assortment Overview (Gesamt-Sortiment) --- */}
      <section>
        <div className="flex items-center gap-2 mb-4">
            <Layers className="text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Gesamt-Sortimentsübersicht</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Market Position Indicator */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-sm text-slate-500 uppercase font-medium tracking-wide">Globaler Markt-Index</div>
                        <div className="text-4xl font-bold text-slate-900 mt-2">
                            {overallStats.globalIndex.toFixed(1)} <span className="text-lg text-slate-400 font-normal">Punkte</span>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold ${overallStats.globalIndex > 100 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {overallStats.globalIndex > 100 ? 'Teurer als Markt' : 'Günstiger als Markt'}
                    </div>
                </div>
                
                {/* Visual Bar for Index */}
                <div className="relative pt-6 pb-2">
                    <div className="h-4 bg-slate-100 rounded-full w-full overflow-hidden relative">
                        {/* Center marker */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10"></div>
                        {/* Value marker */}
                        <div 
                            className={`absolute top-0 bottom-0 transition-all duration-500 ${overallStats.globalIndex > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ 
                                left: '50%', 
                                width: `${Math.min(Math.abs(overallStats.globalIndex - 100) * 2, 50)}%`, // Scale logic
                                transform: overallStats.globalIndex < 100 ? 'translateX(-100%)' : 'none'
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                        <span>90.0 (Aggressiv)</span>
                        <span>100.0 (Markt)</span>
                        <span>110.0 (Premium)</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="text-sm text-slate-500 font-medium">Vergleichbare Artikel</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">{overallStats.totalMatched.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 mt-1">von {overallStats.totalArticles.toLocaleString()} Gesamtartikeln</div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Datenqualität</span>
                        <span className="text-green-600 font-medium">Hoch</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 mt-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[92%]"></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- Section 2: Category Breakdown (Kategorie-Ebene) --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <TrendingUp className="text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-800">Performance nach Kategorie</h2>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis domain={[90, 110]} hide />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" />
                        <Bar dataKey="avgIndex" radius={[4, 4, 0, 0]} barSize={40}>
                            {categoryStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.avgIndex > 101 ? '#f43f5e' : entry.avgIndex < 99 ? '#10b981' : '#cbd5e1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-slate-500 mt-2">Durchschnittlicher Preisindex pro Kategorie (100 = Markt)</div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">Kategorie</th>
                        <th className="px-6 py-3 text-right">Artikel</th>
                        <th className="px-6 py-3 text-right">Match-Rate</th>
                        <th className="px-6 py-3 text-center">Preis-Index</th>
                        <th className="px-6 py-3">Markt-Position</th>
                        <th className="px-6 py-3 text-right">Aktion</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {categoryStats.map((cat) => (
                        <tr key={cat.name} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800">{cat.name}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{cat.total}</td>
                            <td className="px-6 py-4 text-right">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${cat.matchRate < 50 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {cat.matchRate.toFixed(0)}%
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center font-mono font-medium">
                                {cat.avgIndex.toFixed(1)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${cat.cheaperPct}%` }} className="bg-emerald-400 h-full" title="Günstiger"></div>
                                        <div style={{ width: `${100 - cat.cheaperPct - cat.expensivePct}%` }} className="bg-slate-300 h-full" title="Parität"></div>
                                        <div style={{ width: `${cat.expensivePct}%` }} className="bg-rose-400 h-full" title="Teurer"></div>
                                    </div>
                                    <span className="text-xs text-slate-400 w-8 text-right">
                                        {cat.avgIndex > 100 ? <ArrowUpRight size={14} className="text-rose-500 inline" /> : cat.avgIndex < 100 ? <ArrowDownRight size={14} className="text-emerald-500 inline" /> : <Minus size={14} className="text-slate-400 inline" />}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
};

export default AssortmentComparison;