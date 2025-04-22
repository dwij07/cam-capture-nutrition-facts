
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let supabase;

// Check if environment variables are properly set
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.startsWith('http') && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseKey !== 'your-anon-key';

try {
  if (isSupabaseConfigured) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          setUser(userData.user);
        } else {
          // No active session, redirect to auth page
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in again"
        });
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return;
      }
      
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully"
      });
      navigate("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Header />
      
      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <p className="mb-4">You are logged in as: <strong>{user.email}</strong></p>
                <div className="flex justify-between">
                  <Button onClick={() => navigate("/")}>Go to Home Page</Button>
                  <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="mb-4">Please log in to access your dashboard.</p>
                <Button onClick={() => navigate("/auth")}>Login / Sign Up</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
