
"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase-client';
import { Search, Filter, X } from 'lucide-react';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState('');
  const [prices, setPrices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    async function fetchFilters() {
      try {
        // Fetch unique primary tasks
        const { data: taskData, error: taskError } = await supabase
          .from('tools')
          .select('primary_task')
          .order('primary_task');
        
        if (taskError) throw taskError;
        
        if (taskData) {
          // Extract unique values
          const uniqueTasks = Array.from(new Set(taskData.map(item => 
            item.primary_task
          ))).filter(task => task); // Filter out null/empty
          
          setTasks(uniqueTasks);
        }
        
        // Fetch unique pricing options
        const { data: priceData, error: priceError } = await supabase
          .from('tools')
          .select('pricing')
          .order('pricing');
        
        if (priceError) throw priceError;
        
        if (priceData) {
          // Extract unique values
          const uniquePrices = Array.from(new Set(priceData.map(item => 
            item.pricing
          ))).filter(price => price); // Filter out null/empty
          
          setPrices(uniquePrices);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    }
    
    fetchFilters();
  }, []);
  
  const clearFilters = () => {
    setSearchQuery('');
    setTaskFilter('');
    setPriceFilter('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                AI Tools Explorer
              </h1>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                Discover the best AI tools for your workflow. Browse our curated collection of 
                AI-powered applications to improve your productivity and creativity.
              </p>
              
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search AI tools..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="whitespace-nowrap"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                  
                  {(taskFilter || priceFilter) && (
                    <Button variant="ghost" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Task Type
                    </label>
                    <Select value={taskFilter} onValueChange={setTaskFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Task Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Task Types</SelectItem>
                        {tasks.map((task) => (
                          <SelectItem key={task} value={task}>
                            {task}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Pricing
                    </label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Pricing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Pricing</SelectItem>
                        {prices.map((price) => (
                          <SelectItem key={price} value={price}>
                            {price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </MotionWrapper>
          
          <MotionWrapper animation="fadeIn" delay="delay-200">
            <ToolGrid
              searchQuery={searchQuery}
              taskFilter={taskFilter}
              priceFilter={priceFilter}
            />
          </MotionWrapper>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
