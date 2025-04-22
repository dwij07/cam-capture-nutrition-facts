
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">NutriTrack</CardTitle>
          <CardDescription>Track your diet and nutrition journey</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardContent className="pt-4">
              <LoginForm />
            </CardContent>
          </TabsContent>
          
          <TabsContent value="signup">
            <CardContent className="pt-4">
              <SignUpForm />
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Your nutrition journey starts here
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
