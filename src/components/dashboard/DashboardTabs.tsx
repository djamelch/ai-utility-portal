
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Star, UserCircle } from 'lucide-react';
import { SavedToolsTab } from './SavedToolsTab';
import { UserReviewsTab } from './UserReviewsTab';
import { ProfileTab } from './ProfileTab';

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('saved');

  return (
    <Tabs 
      defaultValue="saved" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-6">
        <TabsTrigger value="saved">
          <Heart className="h-4 w-4 mr-2" />
          Saved Tools
        </TabsTrigger>
        <TabsTrigger value="reviews">
          <Star className="h-4 w-4 mr-2" />
          Your Reviews
        </TabsTrigger>
        <TabsTrigger value="profile">
          <UserCircle className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="saved" className="space-y-6">
        <SavedToolsTab />
      </TabsContent>
      
      <TabsContent value="reviews" className="space-y-6">
        <UserReviewsTab />
      </TabsContent>
      
      <TabsContent value="profile" className="space-y-6">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
}
