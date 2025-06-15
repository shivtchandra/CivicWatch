
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Users } from "lucide-react";

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative dark-glass-card">
      {/* background accent */}
      <div className="blur-accent-dark w-40 h-40 left-0 top-0 bg-blue-500/40"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4
              bg-white/40 backdrop-blur-md border border-white/20 shadow-lg
              "
            style={{
              background: "rgba(255,255,255,0.25)",
              boxShadow: "0 2px 14px 0 rgba(0,0,0,0.10)",
            }}
          >
            <Users className="h-8 w-8 text-black/80" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            CivicWatch
          </h1>
          <p className="text-zinc-200">
            Community Safety & Governance
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
