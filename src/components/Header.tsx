import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { profile, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (profile) {
      navigate("/profile");
    } else {
      // Store the current location to redirect back after login
      navigate("/auth", { state: { from: window.location.pathname } });
    }
  };

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <Link to="/" className="text-2xl font-semibold">CivicWatch</Link>
        </div>

        <div>
          {loading ? null : profile ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleProfileClick}
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm text-white hover:bg-gray-700 transition-colors"
              >
                {profile.name ? profile.name[0].toUpperCase() : (profile.email || "U")[0].toUpperCase()}
              </button>
              <div className="text-sm">
                <div>{profile.name ?? profile.email}</div>
              </div>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth", { state: { from: window.location.pathname } })}
              className="text-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
