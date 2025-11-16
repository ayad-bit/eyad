import React, { useState, useEffect } from 'react';
import { getRelationship } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const HISTORY_STORAGE_KEY = 'aloreiniTreeSearchHistory';
const MAX_HISTORY_ITEMS = 3;

const MainScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const response = await getRelationship(searchQuery);
      setResult(response);
      
      const newHistory = [searchQuery, ...history.filter(item => item !== searchQuery)].slice(0, MAX_HISTORY_ITEMS);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };
  
  const handleHistoryOrSuggestionClick = (text: string) => {
    setQuery(text);
    executeSearch(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl font-bold text-[#4a69bd] mb-2 text-center">
        شجرة عائلة العريني
      </h1>
      <p className="text-md md:text-lg text-[#5c8599] mb-8 text-center">
        أدخل اسمين أو أكثر لمعرفة صلة القرابة بينهم.
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جرب: ما هي علاقة إياد بن يوسف بكل من عبدالله بن طارق ومحمد بن إبراهيم؟"
            className="w-full p-4 pr-12 text-lg border-2 border-[#d1dce5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4a69bd] transition-shadow shadow-sm focus:shadow-lg"
            rows={3}
            disabled={isLoading}
          />
          <svg className="w-6 h-6 absolute top-4 right-4 text-[#4a69bd] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 px-8 py-4 bg-[#5c8599] text-white font-bold text-lg rounded-xl shadow-lg hover:bg-[#4a69bd] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5c8599] focus:ring-offset-[#f8f7f4] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <LoadingSpinner /> : 'ابحث عن العلاقة'}
        </button>
      </form>

      <div className="w-full mt-8 p-6 bg-white border-2 border-[#d1dce5] rounded-xl shadow-md min-h-[120px] text-center flex items-center justify-center">
        {isLoading && <p className="text-gray-500">جاري البحث...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {result && <p className="text-[#3a506b] text-lg leading-relaxed whitespace-pre-wrap">{result}</p>}
        {!isLoading && !error && !result && (
          <p className="text-gray-400">ستظهر نتيجة البحث هنا</p>
        )}
      </div>

      <div className="w-full mt-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#4a69bd] mb-3 text-center md:text-right">آخر عمليات البحث</h3>
          <div className="flex flex-col gap-2">
            {history.length > 0 ? (
              history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryOrSuggestionClick(item)}
                  className="w-full text-right p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-200 text-[#3a506b] shadow-sm"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-gray-400 text-center md:text-right">لا يوجد سجل بحث حتى الآن.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;