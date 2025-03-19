
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center search-animation">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your issue (e.g., 'water motor not working')"
          className="pr-24 py-6 pl-12 text-lg rounded-full border-2 border-tech-gray focus-visible:ring-tech-blue focus-visible:border-tech-blue shadow-sm transition-all"
        />
        <Search className="absolute left-4 text-tech-dark-gray" size={20} />
        <Button 
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute right-2 bg-tech-blue hover:bg-blue-600 text-white rounded-full px-6 py-2 transition-all"
        >
          {isSearching ? 
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-tech-light-blue border-t-transparent animate-spin" />
              <span>Searching...</span>
            </div> : 
            'Search'
          }
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
