import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { SearchResult } from '@/types/Index';
import { semanticSearch } from '@/services/semanticSearch';
import { uploadSampleData } from '@/utils/sampleData';
import { HelpCircle, Wrench, Database } from 'lucide-react';
import "./hello.css";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    try {
      const searchResults = await semanticSearch(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      const count = await uploadSampleData();
      toast({
        title: "Sample Data Loaded",
        description: "Successfully added ${count} technicians to the database.",
      });
    } catch (error) {
      console.error('Failed to load sample data:', error);
      toast({
        title: "Error",
        description: "Failed to load sample data. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-tech-blue mb-4">Technician Finder</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Describe your problem in natural language and we'll find the right technician for you.
          </p>
        </header>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="mb-8 mx-auto flex justify-center">
            <TabsTrigger value="search" className="data-[state=active]:bg-tech-blue data-[state=active]:text-white">
              <HelpCircle className="mr-2 h-4 w-4" />
              Find a Technician
            </TabsTrigger>
            <TabsTrigger value="demo" className="data-[state=active]:bg-tech-teal data-[state=active]:text-white">
              <Database className="mr-2 h-4 w-4" />
              Demo Functions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="py-4">
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
            
            {!searchQuery && results.length === 0 && (
              <div className="text-center mt-16">
                <div className="bg-tech-light-blue text-tech-blue p-6 rounded-xl max-w-2xl mx-auto">
                  <Wrench className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">How to use this app</h3>
                  <p className="text-gray-600">
                    Describe your problem in natural language. For example:
                  </p>
                  <ul className="mt-2 space-y-2 text-left max-w-md mx-auto">
                    <li className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      "My kitchen sink is leaking and water is pooling on the floor."
                    </li>
                    <li className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      "The air conditioner is making a strange noise and not cooling."
                    </li>
                    <li className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      "I need someone to install new lighting fixtures in my living room."
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            <SearchResults 
              results={results}
              searchQuery={searchQuery}
              isSearching={isSearching}
            />
          </TabsContent>
          
          <TabsContent value="demo" className="py-4">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Demo Functions</h2>
              <p className="mb-6 text-gray-600">
                This app demonstrates semantic search using Google's Vertex AI embeddings. 
                Use the button below to populate your Firestore database with sample technician data.
              </p>
              
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <h3 className="font-medium text-gray-800 mb-2">About this demo</h3>
                <p className="text-sm text-gray-600 mb-2">
                  In a production environment, you would:
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Set up a Google Cloud project with Vertex AI enabled</li>
                  <li>Generate and store embeddings for each technician document</li> 
                  <li>Use a proper vector database for faster semantic search</li>
                  <li>Implement authentication for secure API access</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleLoadSampleData} 
                disabled={isLoading}
                className="w-full bg-tech-teal hover:bg-teal-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-tech-light-teal border-t-transparent animate-spin mr-2" />
                    Loading Sample Data...
                  </>
                ) : (
                  <>Load Sample Technician Data</>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="mt-20 text-center text-sm text-gray-500">
        <p>Technician Finder - Semantic Search Demo</p>
        <p className="mt-1">
          <a href="#" className="text-tech-blue hover:underline">Terms</a> · 
          <a href="#" className="text-tech-blue hover:underline ml-2">Privacy</a> · 
          <a href="#" className="text-tech-blue hover:underline ml-2">Contact</a>
        </p>
      </footer>
    </div>
  );
};

export default Index;