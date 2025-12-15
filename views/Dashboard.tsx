import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Article, KPIData } from '../types';
import { generateTrendData } from '../services/mockData';

interface DashboardProps {
  articles: Article[];
}

const Dashboard: React.FC<DashboardProps> = ({ articles }) => {
  // Aggregate Metrics on the fly
  const totalArticles = 36420; // Hardcoded context number
  const matchedArticles = articles.filter(a => a.competitors.length > 0).length;
  const matchRate = (matchedArticles / articles.length) * 100;
  
  const avgIndex = articles.reduce((acc, curr) => acc + curr.priceIndex, 0) / articles.length;
  
  const cheaper = articles.filter(a => a.priceIndex < 98).length;
  const expensive = articles.filter(a => a.priceIndex > 102).length;
  const equal = articles.length - cheaper - expensive;

  const trendData = generateTrendData();

  const distributionData = [
    { name: 'Günstiger (<98)', value: cheaper, fill: '#10b981' }, // Emerald-500
    { name: 'Parität (98-102)', value: equal, fill: '#64748b' }, // Slate-500
    { name: 'Teurer (>102)', value: expensive, fill: '#f43f5e' }, // Rose-500
  ];

  const StatCard = ({ title, value, subtext, trend, trendValue, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
          <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
        </div>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span className={`flex items-center font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {trendValue}
        </span>
        <span className="text-slate-400 ml-2">{subtext}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Preisindex" 
          value={avgIndex.toFixed(1)} 
          subtext="vs Markt (100.0)" 
          trend="up" 
          trendValue="+0.5%" 
          icon={TrendingUp}
          color="bg-blue-500 text-blue-600"
        />
        <StatCard 
          title="Katalogabdeckung" 
          value={`${matchRate.toFixed(1)}%`} 
          subtext="von 36,420 Artikeln" 
          trend="up" 
          trendValue="+1.2%" 
          icon={CheckCircle2}
          color="bg-emerald-500 text-emerald-600"
        />
        <StatCard 
          title="Chancen" 
          value="142" 
          subtext="Preiserhöhungspotenzial" 
          trend="down" 
          trendValue="-12" 
          icon={TrendingUp}
          color="bg-amber-500 text-amber-600"
        />
        <StatCard 
          title="Kritische Warnungen" 
          value="28" 
          subtext="Marge < 15%" 
          trend="down" 
          trendValue="+4" 
          icon={AlertCircle}
          color="bg-rose-500 text-rose-600"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Preisindex-Verlauf (YTD)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={[90, 110]} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="index" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Marktindex" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Wettbewerbsposition</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-slate-500 text-center">
            Vergleich mit Galaxus & Velofactory
          </div>
        </div>
      </div>
      
      {/* Quick Action Table (Top 5 Movers) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Kritische Preisabweichungen (Top 5)</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Alle Warnungen anzeigen</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3">SKU</th>
                        <th className="px-6 py-3">Produktname</th>
                        <th className="px-6 py-3">Unser Preis</th>
                        <th className="px-6 py-3">Wettbewerber</th>
                        <th className="px-6 py-3">Abstand</th>
                        <th className="px-6 py-3">Aktion</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {articles.slice(0, 5).map((article) => (
                        <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3 font-mono text-slate-600">{article.sku}</td>
                            <td className="px-6 py-3 font-medium text-slate-800">{article.name}</td>
                            <td className="px-6 py-3">{article.ownPrice.toFixed(2)}</td>
                            <td className="px-6 py-3">{article.minCompetitorPrice.toFixed(2)}</td>
                            <td className={`px-6 py-3 font-bold ${article.gapToCheapest > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {article.gapToCheapest > 0 ? '+' : ''}{article.gapToCheapest.toFixed(1)}%
                            </td>
                            <td className="px-6 py-3">
                                <button className="text-xs bg-white border border-slate-300 hover:bg-slate-50 px-2 py-1 rounded shadow-sm">
                                    Analysieren
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;