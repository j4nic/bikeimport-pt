import React from 'react';
import { Article } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

interface CategoryAnalysisProps {
  articles: Article[];
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ articles }) => {
  // Aggregate data by category
  const categoryMap = new Map<string, { total: number, sumIndex: number, cheaper: number, expensive: number }>();

  articles.forEach(a => {
      const current = categoryMap.get(a.category) || { total: 0, sumIndex: 0, cheaper: 0, expensive: 0 };
      if (a.competitors.length > 0) {
          current.total++;
          current.sumIndex += a.priceIndex;
          if (a.priceIndex < 98) current.cheaper++;
          if (a.priceIndex > 102) current.expensive++;
      }
      categoryMap.set(a.category, current);
  });

  const chartData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      avgIndex: data.total > 0 ? parseFloat((data.sumIndex / data.total).toFixed(1)) : 0,
      coverage: data.total,
      cheaperPct: (data.cheaper / data.total) * 100,
      expensivePct: (data.expensive / data.total) * 100,
  })).sort((a, b) => b.avgIndex - a.avgIndex); // Sort by most expensive category relative to market

  return (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Übersicht Kategorie-Preisindex</h2>
            <p className="text-sm text-slate-500 mb-6">Welche Kategorien liegen über dem Marktpreis (Index > 100)?</p>
            
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" domain={[80, 120]} stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} stroke="#64748b" />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Bar dataKey="avgIndex" barSize={20} name="Preisindex">
                             {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.avgIndex > 102 ? '#f43f5e' : entry.avgIndex < 98 ? '#10b981' : '#64748b'} />
                             ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Verteilung der Wettbewerbsfähigkeit</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Kategorie</th>
                                <th className="px-4 py-2 text-center text-emerald-600">Günstiger %</th>
                                <th className="px-4 py-2 text-center text-rose-600">Teurer %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {chartData.map(cat => (
                                <tr key={cat.name}>
                                    <td className="px-4 py-2 font-medium">{cat.name}</td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="w-full bg-slate-100 rounded-full h-2 relative">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${cat.cheaperPct}%` }}></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{cat.cheaperPct.toFixed(0)}%</span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="w-full bg-slate-100 rounded-full h-2 relative">
                                            <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${cat.expensivePct}%` }}></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{cat.expensivePct.toFixed(0)}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
                    <ScatterChart width={40} height={40}>
                         <Scatter data={[{x:1, y:1}]} fill="#2563eb" />
                    </ScatterChart>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Sortimentslücken-Analyse</h3>
                <p className="text-slate-500 text-sm mt-2 mb-6 max-w-xs">
                    "Elektronik" hat den höchsten Preisindex (108.0), aber eine geringe Abdeckung. Erwägen Sie eine Erweiterung des abgeglichenen Sortiments.
                </p>
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded hover:bg-slate-50 shadow-sm">
                    Detaillierten Bericht anzeigen
                </button>
            </div>
        </div>
    </div>
  );
};

export default CategoryAnalysis;