
import React from 'react';
import { SearchResult } from '@/types/Index';
import TechnicianCard from './TechnicanCard';

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isSearching: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchQuery, isSearching }) => {
  if (isSearching) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8">
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-48 bg-gray-100 rounded-lg animate-pulse-light" />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 text-center py-10">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No technicians found</h3>
        <p className="text-gray-500">Try a different search query or check back later</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-500">
          Found {results.length} technicians for "{searchQuery}"
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result) => (
          <TechnicianCard 
            key={result.technician.id}
            technician={result.technician}
            score={result.score}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
