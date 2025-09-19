import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

// inside src/components/auth/AuthForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (isLogin) {
      const res = await signIn(email, password);
      if (res.error) {
        toast({ title: "Error", description: res.error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You have successfully signed in." });
        // navigate only after signIn has completed & token/profile updated
        navigate("/profile");
      }
    } else {
      if (!fullName.trim()) {
        toast({ title: "Error", description: "Please enter your full name", variant: "destructive" });
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, fullName);
      if (res.error) {
        toast({ title: "Error", description: res.error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Account created! Please sign in." });
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setFullName("");
      }
    }
  } catch (err) {
    toast({ title: "Error", description: "Unexpected error occurred", variant: "destructive" });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">CivicWatch</h1>
          <p className="text-sm text-muted-foreground mt-1">Community Safety & Governance</p>
        </div>

        <Card className="mx-auto max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold">
              {isLogin ? "Welcome Back" : "Join CivicWatch"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to report and track community issues"
                : "Create an account to help make your community safer"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-500 hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
