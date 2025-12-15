import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import ArticleExplorer from './views/ArticleExplorer';
import AssortmentComparison from './views/AssortmentComparison';
import { generateMockData } from './services/mockData';
import { Article } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate initial data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    const loadData = () => {
      const mock = generateMockData();
      setData(mock);
      setLoading(false);
    };

    // Small delay to simulate network
    setTimeout(loadData, 800);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm font-medium animate-pulse">Lade PriceCompass Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard articles={data} />}
      {activeTab === 'articles' && <ArticleExplorer articles={data} />}
      {activeTab === 'assortment' && <AssortmentComparison articles={data} />}
      {activeTab === 'competitors' && (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Wettbewerber-Feed Konfiguration</h2>
          <p className="mt-2 text-sm">Wettbewerber-Feed-Mapping und Status-Logs würden hier angezeigt.</p>
        </div>
      )}
      {activeTab === 'settings' && (
         <div className="flex flex-col items-center justify-center h-96 text-slate-400">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Systemeinstellungen</h2>
          <p className="mt-2 text-sm">Benutzerverwaltung, API-Schlüssel und Benachrichtigungsschwellen.</p>
        </div>
      )}
    </Layout>
  );
}

export default App;