
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart as BarChartIcon, 
  Users, 
  Wrench,
  MousePointerClick,
  Star,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface AnalyticsData {
  totalUsers: number;
  totalTools: number;
  totalClicks: number;
  totalReviews: number;
  averageRating: number;
  popularTools: {
    id: number;
    name: string;
    clicks: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    entity: string;
    entityName: string;
    timestamp: string;
  }[];
}

interface ChartData {
  name: string;
  clicks: number;
}

export function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalTools: 0,
    totalClicks: 0,
    totalReviews: 0,
    averageRating: 0,
    popularTools: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Get counts from different tables
      const [
        usersResult,
        toolsResult,
        reviewsResult,
        popularToolsResult
      ] = await Promise.all([
        // Count users
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        
        // Count tools
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        
        // Count reviews
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        
        // Top 5 tools by click count
        supabase.from('tools')
          .select('id, company_name, click_count')
          .order('click_count', { ascending: false })
          .limit(5)
      ]);
      
      // Calculate total clicks
      const { data: totalClicksData, error: totalClicksError } = await supabase
        .from('tools')
        .select('click_count');
        
      if (totalClicksError) throw totalClicksError;
      
      const totalClicks = totalClicksData?.reduce((sum, tool) => sum + (tool.click_count || 0), 0) || 0;
      
      // Calculate average rating
      const { data: ratingData, error: ratingError } = await supabase
        .from('reviews')
        .select('rating');
        
      if (ratingError) throw ratingError;
      
      const totalRating = ratingData?.reduce((sum, review) => sum + (review.rating || 0), 0) || 0;
      const averageRating = ratingData && ratingData.length > 0 ? totalRating / ratingData.length : 0;
      
      // Fetch recent activity from reviews and tools
      const [recentReviews, recentToolUpdates] = await Promise.all([
        supabase
          .from('reviews')
          .select('id, tool_id, created_at')
          .order('created_at', { ascending: false })
          .limit(3),
          
        supabase
          .from('tools')
          .select('id, company_name, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3)
      ]);
      
      // Map recent reviews to activity items
      const reviewActivities = (recentReviews.data || []).map(review => ({
        id: review.id,
        action: 'left',
        entity: 'review',
        entityName: `Tool ID: ${review.tool_id}`,
        timestamp: review.created_at || new Date().toISOString()
      }));
      
      // Map recent tool updates to activity items
      const toolActivities = (recentToolUpdates.data || []).map(tool => ({
        id: `tool-${tool.id}`,
        action: 'updated',
        entity: 'tool',
        entityName: tool.company_name || `Tool ID: ${tool.id}`,
        timestamp: tool.updated_at || new Date().toISOString()
      }));
      
      // Combine and sort activities
      const allActivities = [...reviewActivities, ...toolActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);

      // Prepare chart data from popular tools
      const chartData = popularToolsResult.data?.map(tool => ({
        name: tool.company_name || `Tool ${tool.id}`,
        clicks: tool.click_count || 0
      })) || [];
      
      setChartData(chartData);
      
      // Set all the analytics data
      setAnalyticsData({
        totalUsers: usersResult.count || 0,
        totalTools: toolsResult.count || 0,
        totalClicks,
        totalReviews: reviewsResult.count || 0,
        averageRating,
        popularTools: popularToolsResult.data?.map(tool => ({
          id: tool.id,
          name: tool.company_name || `Tool ${tool.id}`,
          clicks: tool.click_count || 0
        })) || [],
        recentActivity: allActivities
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalTools}</div>
            <p className="text-xs text-muted-foreground">
              AI tools in database
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Tool link visits
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              From {analyticsData.totalReviews} reviews
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Popular Tools</CardTitle>
            <CardDescription>
              Top 5 tools by click count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.length > 0 ? (
                analyticsData.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {activity.action === 'added' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {activity.action === 'updated' && <BarChartIcon className="h-4 w-4 text-blue-500" />}
                      {activity.action === 'left' && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {activity.action === 'added' && 'New tool added:'}
                          {activity.action === 'updated' && 'Tool updated:'}
                          {activity.action === 'left' && 'New review for:'}
                        </span>{' '}
                        {activity.entityName}
                      </p>
                      <p className="text-xs flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
