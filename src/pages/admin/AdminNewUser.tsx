
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  UserCheck, UserPlus, Shield, Loader2, Mail, Lock, AlertCircle
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const newUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  makeAdmin: z.boolean().default(false),
});

type NewUserFormValues = z.infer<typeof newUserSchema>;

export function AdminNewUser() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [enableAdminCreation, setEnableAdminCreation] = useState(false);

  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      email: '',
      password: '',
      makeAdmin: false,
    },
  });

  const handleEnableAdminCreation = async () => {
    setEnableAdminCreation(!enableAdminCreation);
    
    toast({
      title: enableAdminCreation ? "Admin creation disabled" : "Admin creation enabled",
      description: enableAdminCreation ? 
        "New users cannot be created as admins" : 
        "You can now create new users as admins",
    });
  };

  const onSubmit = async (data: NewUserFormValues) => {
    try {
      setIsLoading(true);
      
      // Create the user with email and password
      const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true // Skip email confirmation
      });
      
      if (signUpError) throw signUpError;
      if (!userData.user) throw new Error("Failed to create user");
      
      const userId = userData.user.id;
      
      // If makeAdmin is true and admin creation is enabled, set the user's role to admin
      if (data.makeAdmin && enableAdminCreation) {
        const { error: roleError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            role: 'admin',
            updated_at: new Date().toISOString()
          });
          
        if (roleError) throw roleError;
      }
      
      toast({
        title: "User created successfully",
        description: `${data.email} added as ${data.makeAdmin && enableAdminCreation ? 'an admin' : 'a regular user'}`,
      });
      
      // Reset form
      form.reset();
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Failed to create user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">User Management</h2>
        <p className="text-muted-foreground">
          Create new users and manage their roles
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Admin Creation Settings
          </CardTitle>
          <CardDescription>
            Control the ability to create new users with admin privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Wrap this in a Form component to provide the FormContext */}
          <Form {...form}>
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Enable Admin Creation
                </FormLabel>
                <FormDescription>
                  Allow creation of new users with admin privileges
                </FormDescription>
              </div>
              <Switch
                checked={enableAdminCreation}
                onCheckedChange={handleEnableAdminCreation}
              />
            </div>
          </Form>
          
          {!enableAdminCreation && (
            <Alert className="mt-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Admin creation is disabled</AlertTitle>
              <AlertDescription>
                Enable the option above to create new users with admin privileges.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            Create New User
          </CardTitle>
          <CardDescription>
            Add a new user to the system and define their role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Enter email address" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="Enter password" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="makeAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        Admin
                      </FormLabel>
                      <FormDescription>
                        Set this user as an admin with full privileges
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!enableAdminCreation}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
