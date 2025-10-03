import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, TrendingUp } from "lucide-react";

// Simple local storage auth fallback for testing
const LOCAL_AUTH_KEY = "finbridge_user";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");
  const navigate = useNavigate();

  // Check Supabase connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionStatus("error");
        } else {
          console.log("Supabase connection successful");
          setConnectionStatus("connected");
        }
      } catch (error) {
        console.error("Failed to connect to Supabase:", error);
        setConnectionStatus("error");
      }
    };

    checkConnection();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  // Demo/Guest login function for testing
  const handleDemoLogin = async () => {
    try {
      // Try to use a predefined demo account in Supabase
      const demoEmail = "demo@finbridge.com";
      const demoPassword = "demo123456";
      
      console.log("Attempting demo login with:", demoEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (data.session) {
        console.log("Demo login successful with Supabase:", data.user?.id);
        toast.success("Signed in as demo user!");
        navigate("/dashboard");
        return;
      }
      
      if (error && error.message.includes("Invalid login credentials")) {
        // Demo account doesn't exist or needs to be created
        console.log("Demo account not found, creating...");
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        });
        
        if (signupData.session) {
          console.log("Demo account created and signed in:", signupData.user?.id);
          toast.success("Signed in as demo user!");
          navigate("/dashboard");
          return;
        } else if (signupData.user) {
          console.log("Demo account created but needs confirmation - using local fallback");
        }
      }
      
      // Fall back to local demo if Supabase fails
      console.log("Using local demo fallback");
      const demoUser = {
        id: "demo-user",
        email: "demo@finbridge.com",
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
      toast.success("Signed in as demo user (local mode)!");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Demo login error:", error);
      
      // Final fallback to local demo
      const demoUser = {
        id: "demo-user", 
        email: "demo@finbridge.com",
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
      toast.success("Signed in as demo user (local mode)!");
      navigate("/dashboard");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check connection status first
    if (connectionStatus === "error") {
      toast.error("Cannot sign up: Authentication service unavailable");
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    console.log("Attempting to sign up with:", { email, passwordLength: password.length });

    try {
      // Sign up the user with Supabase
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      console.log("Supabase signup response:", { signupData, signupError });

      if (signupError) {
        console.error("Supabase signup error:", signupError);
        
        if (signupError.message.includes("User already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(`Signup failed: ${signupError.message}`);
        }
        return;
      }

      if (signupData.user) {
        console.log("User successfully created in Supabase:", signupData.user.id);
        
        // Check if user is immediately confirmed (no email verification required)
        if (signupData.session) {
          console.log("User has immediate session - redirecting to dashboard");
          toast.success("Account created successfully! Redirecting to dashboard...");
          navigate("/dashboard");
        } else {
          // User created but needs email confirmation
          console.log("User created but needs email confirmation");
          toast.success("Account created! Please check your email for verification, or try signing in.");
          // Don't redirect, let them try to sign in
        }
      } else {
        toast.error("Signup failed: No user data received");
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast.error("An unexpected error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check connection status first
    if (connectionStatus === "error") {
      toast.error("Cannot sign in: Authentication service unavailable");
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    console.log("Attempting to sign in with:", { email, passwordLength: password.length });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log("Supabase signin response:", { data, error });

      if (error) {
        console.error("Supabase signin error:", error);
        
        // Provide specific error messages based on error type
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. If you just signed up, please check your email for verification.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email address before signing in. Check your inbox for the verification email.");
        } else if (error.message.includes("Too many requests")) {
          toast.error("Too many sign-in attempts. Please wait a moment and try again.");
        } else if (error.message.includes("User not found")) {
          toast.error("No account found with this email. Please sign up first.");
        } else {
          toast.error(`Sign in failed: ${error.message}`);
        }
      } else if (data.user && data.session) {
        console.log("Sign in successful:", data);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Sign in failed: Please try again");
      }
    } catch (error) {
      console.error("Unexpected error during signin:", error);
      toast.error("An unexpected error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FinBridge</h1>
          <p className="text-slate-300">Your Path to Financial Freedom</p>
        </div>

        {/* Connection Status */}
        {connectionStatus === "checking" && (
          <div className="flex items-center justify-center text-slate-400 mb-4">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Connecting to authentication service...
          </div>
        )}
        
        {connectionStatus === "error" && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm text-center">
              Authentication service unavailable. Some features may be limited.
            </p>
          </div>
        )}

        <Card className="bg-white/5 backdrop-blur border-white/10">
          <div className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-slate-800/50">
                <TabsTrigger value="signin" className="text-slate-300 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-slate-300 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleEmailChange}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                    {emailError && (
                      <p className="text-red-400 text-sm">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={isLoading || !!emailError}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleEmailChange}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                    {emailError && (
                      <p className="text-red-400 text-sm">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={isLoading || !!emailError}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Login */}
            <div className="mt-6 pt-6 border-t border-slate-600">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800/50"
                onClick={handleDemoLogin}
              >
                Continue as Demo User
              </Button>
              <p className="text-xs text-slate-400 text-center mt-2">
                Quick access for testing the application
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;