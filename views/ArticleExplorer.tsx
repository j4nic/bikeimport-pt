import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronRight, ExternalLink, AlertTriangle } from 'lucide-react';
import { Article, Availability } from '../types';

interface ArticleExplorerProps {
  articles: Article[];
}

const ArticleExplorer: React.FC<ArticleExplorerProps> = ({ articles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'cheaper' | 'expensive' | 'equal'>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filtering Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = 
        article.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filterStatus === 'cheaper') return article.gapToCheapest < -2;
      if (filterStatus === 'expensive') return article.gapToCheapest > 2;
      if (filterStatus === 'equal') return article.gapToCheapest >= -2 && article.gapToCheapest <= 2;

      return true;
    });
  }, [articles, searchTerm, filterStatus]);

  const getPositionBadge = (gap: number) => {
    if (gap < -2) return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Günstiger</span>;
    if (gap > 2) return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">Teurer</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Parität</span>;
  };

  const getAvailabilityColor = (status: Availability) => {
      switch(status) {
          case Availability.IN_STOCK: return 'text-green-600';
          case Availability.LOW_STOCK: return 'text-amber-600';
          default: return 'text-red-600';
      }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Suche nach SKU, Name oder Marke..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
          >
            Alle Artikel
          </button>
          <button 
            onClick={() => setFilterStatus('expensive')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'expensive' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
          >
            Zu teuer
          </button>
          <button 
            onClick={() => setFilterStatus('cheaper')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${filterStatus === 'cheaper' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
          >
            Günstiger
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100"><div className="flex items-center gap-1">Artikel <ArrowUpDown size={14} /></div></th>
                <th className="px-4 py-3">Marke</th>
                <th className="px-4 py-3 text-right">Unser Preis</th>
                <th className="px-4 py-3 text-right">Marktpreis</th>
                <th className="px-4 py-3 text-center">Index</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Verfügbarkeit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArticles.map((article) => (
                <React.Fragment key={article.id}>
                  <tr 
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedRow === article.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === article.id ? null : article.id)}
                  >
                    <td className="px-4 py-3 text-slate-400">
                        {expandedRow === article.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{article.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{article.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{article.brand}</td>
                    <td className="px-4 py-3 text-right font-medium">{article.ownPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                        {article.competitors.length > 0 ? article.minCompetitorPrice.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                        {article.competitors.length > 0 ? (
                           <span className={`font-bold ${article.priceIndex > 105 ? 'text-rose-600' : article.priceIndex < 95 ? 'text-emerald-600' : 'text-slate-600'}`}>
                               {article.priceIndex.toFixed(0)}
                           </span>
                        ) : (
                            <span className="text-slate-300">-</span>
                        )}
                    </td>
                    <td className="px-4 py-3 text-center">
                        {article.competitors.length > 0 ? getPositionBadge(article.gapToCheapest) : <span className="text-xs text-slate-400 italic">Kein Match</span>}
                    </td>
                    <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${getAvailabilityColor(article.ownAvailability)}`}>
                            <div className={`w-2 h-2 rounded-full bg-current`} />
                            {article.ownAvailability}
                        </span>
                    </td>
                  </tr>
                  
                  {/* Expanded Detail View */}
                  {expandedRow === article.id && (
                      <tr className="bg-slate-50">
                          <td colSpan={8} className="p-4 border-b border-slate-200">
                              <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
                                  <div className="mb-3 flex justify-between items-center">
                                      <h4 className="font-bold text-slate-700">Wettbewerber-Analyse</h4>
                                      <div className="text-xs text-slate-500">Letztes Update: Heute, 10:00 Uhr</div>
                                  </div>
                                  
                                  {article.competitors.length === 0 ? (
                                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded">
                                          <AlertTriangle size={16} />
                                          <span>Keine passenden Produkte auf Galaxus oder Velofactory gefunden.</span>
                                      </div>
                                  ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {article.competitors.map((comp, idx) => {
                                              const diff = ((article.ownPrice - comp.price) / comp.price) * 100;
                                              const isCheaper = comp.price < article.ownPrice;
                                              return (
                                                <div key={idx} className="border border-slate-200 rounded p-3 flex justify-between items-center hover:shadow-md transition-shadow">
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{comp.competitorName}</div>
                                                        <div className={`text-xs mt-1 ${getAvailabilityColor(comp.availability)}`}>
                                                            {comp.availability}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-slate-800">{comp.price.toFixed(2)}</div>
                                                        <div className={`text-xs font-medium ${isCheaper ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                            {isCheaper ? 'Günstiger um ' : 'Teurer um '}
                                                            {Math.abs(diff).toFixed(1)}%
                                                        </div>
                                                        <a href={comp.url} className="flex items-center justify-end gap-1 text-xs text-blue-600 hover:underline mt-1">
                                                            Besuchen <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                              )
                                          })}
                                      </div>
                                  )}
                              </div>
                          </td>
                      </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
            <span>Zeige {filteredArticles.length} von {articles.length} Artikeln</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50">Zurück</button>
                <button className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Weiter</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleExplorer;