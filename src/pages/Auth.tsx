import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Github, Mail } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sign-in");
  const [isResetRequested, setIsResetRequested] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSignUp = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description:
          "Please check your email for a confirmation link to complete your registration.",
      });
      setActiveTab("sign-in");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create an account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignIn = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>
  ) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setIsResetRequested(true);
      toast({
        title: "Password reset email sent",
        description:
          "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with GitHub",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const signInWithEmail = async () => {
    try {
      setIsLoading(true);
      // This is just a placeholder for a "magic link" authentication
      const email = signInForm.getValues().email;
      if (!email) {
        throw new Error("Please enter your email address");
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic link sent",
        description:
          "Check your email for a sign in link. If it doesn't appear within a few minutes, check your spam folder.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container flex items-center justify-center min-h-[70vh]">
          <MotionWrapper animation="fadeIn" className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground animate-pulse">
              Please wait...
            </p>
          </MotionWrapper>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container flex items-center justify-center py-10 md:py-20">
        <MotionWrapper animation="fadeIn" className="w-full max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {activeTab === "sign-up"
                  ? "Create an Account"
                  : activeTab === "forgot-password"
                  ? "Reset Password"
                  : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "sign-up"
                  ? "Sign up to access all features"
                  : activeTab === "forgot-password"
                  ? "Enter your email to receive a password reset link"
                  : "Sign in to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab !== "forgot-password" ? (
                <Tabs
                  defaultValue={activeTab}
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sign-in" className="space-y-4">
                    <Form {...signInForm}>
                      <form
                        onSubmit={signInForm.handleSubmit(onSignIn)}
                        className="space-y-4"
                      >
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="email@example.com"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="p-0 h-auto text-xs"
                                  onClick={() => setActiveTab("forgot-password")}
                                >
                                  Forgot Password?
                                </Button>
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Sign In
                        </Button>
                      </form>
                    </Form>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={signInWithGitHub}
                        className="w-full"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={signInWithEmail}
                        className="w-full"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="sign-up" className="space-y-4">
                    <Form {...signUpForm}>
                      <form
                        onSubmit={signUpForm.handleSubmit(onSignUp)}
                        className="space-y-4"
                      >
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="email@example.com"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="••••••••"
                                  type="password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Must be at least 8 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Create Account
                        </Button>
                      </form>
                    </Form>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={signInWithGitHub}
                        className="w-full"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={signInWithEmail}
                        className="w-full"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-4">
                  {isResetRequested ? (
                    <div className="text-center py-6">
                      <MotionWrapper animation="fadeIn">
                        <div className="text-center mb-4">
                          <Mail className="mx-auto h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          Check your email
                        </h3>
                        <p className="text-muted-foreground">
                          We sent a password reset link to your email address.
                        </p>
                        <Button
                          className="mt-4"
                          variant="outline"
                          onClick={() => {
                            setIsResetRequested(false);
                            setActiveTab("sign-in");
                          }}
                        >
                          Back to Sign In
                        </Button>
                      </MotionWrapper>
                    </div>
                  ) : (
                    <Form {...forgotPasswordForm}>
                      <form
                        onSubmit={forgotPasswordForm.handleSubmit(
                          onForgotPassword
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={forgotPasswordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="email@example.com"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Send Reset Link
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {activeTab === "forgot-password" && !isResetRequested && (
                <Button
                  type="button"
                  variant="link"
                  className="text-sm"
                  onClick={() => setActiveTab("sign-in")}
                >
                  Back to Sign In
                </Button>
              )}
            </CardFooter>
          </Card>
        </MotionWrapper>
      </div>
    </PageWrapper>
  );
}
