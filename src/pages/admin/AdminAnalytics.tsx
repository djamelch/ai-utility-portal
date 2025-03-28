
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase-client';
import { Loader2, BarChart2, Users, Database, MousePointerClick } from 'lucide-react';

export function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalTools: 0,
    totalUsers: 0,
    totalClicks: 0,
  });
  const [clickData, setClickData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // Get tool count
        const { count: toolCount, error: toolError } = await supabase
          .from('tools')
          .select('*', { count: 'exact', head: true });
        
        if (toolError) throw toolError;
        
        // Get user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        
        // Get total clicks
        const { data: clickData, error: clickError } = await supabase
          .from('tools')
          .select('click_count');
        
        if (clickError) throw clickError;
        
        const totalClicks = clickData?.reduce((sum, tool) => sum + (tool.click_count || 0), 0) || 0;
        
        setStats({
          totalTools: toolCount || 0,
          totalUsers: userCount || 0,
          totalClicks: totalClicks,
        });
        
        // Get top clicked tools
        const { data: topTools, error: topToolsError } = await supabase
          .from('tools')
          .select('name, click_count')
          .order('click_count', { ascending: false })
          .limit(5);
        
        if (topToolsError) throw topToolsError;
        
        setClickData(topTools || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Tools" 
          value={stats.totalTools}
          description="AI tools in database"
          icon={<Database className="h-8 w-8 text-primary" />}
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers}
          description="Registered users"
          icon={<Users className="h-8 w-8 text-primary" />}
        />
        <StatCard 
          title="Total Clicks" 
          value={stats.totalClicks}
          description="Tool link clicks"
          icon={<MousePointerClick className="h-8 w-8 text-primary" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Top Clicked Tools
          </CardTitle>
          <CardDescription>
            Most popular tools based on click count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {clickData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clickData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="click_count" fill="#8884d8" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No click data available yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
