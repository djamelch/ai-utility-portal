
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const UserProfileSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="mt-1 p-2 border rounded bg-muted/30">
              {user?.email}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto"
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
