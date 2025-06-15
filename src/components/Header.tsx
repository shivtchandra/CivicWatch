
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper: Get user initials (first + last, or first two letters if only one part)
  const getInitials = (name?: string | null) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  };

  return (
    <header className="bg-black border-b shadow-sm py-1 px-2 sm:py-2 sm:px-4">
      <div className="container mx-auto relative flex items-center h-14 sm:h-16">
        {/* Left: CivicWatch */}
        <div className="flex items-center">
          <span
            className={`
              text-2xl xs:text-3xl sm:text-5xl font-extralight
              tracking-tight
              font-inter
              py-0.5 px-2 xs:px-3 sm:px-4
              bg-black
              bg-clip-text
              text-transparent
              bg-gradient-to-r from-white via-slate-200 to-blue-300
              drop-shadow-[0_1px_12px_rgba(80,130,255,0.07)]
              select-none
              leading-tight
              animate-fade-in
            `}
            style={{ letterSpacing: "-0.025em" }}
          >
            CivicWatch
          </span>
        </div>
        {/* Center: Report Now button (absolutely centered) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex">
          <Button
            variant="ghost"
            size="sm"
            className="backdrop-blur-lg bg-black/40 border border-white/15 text-silver px-3 py-0.5 text-sm xs:px-4 xs:py-1 xs:text-base font-extralight rounded-md shadow shadow-black/20 hover:bg-black/50 hover:border-white/25 transition-colors"
            onClick={() => navigate('/report')}
          >
            <span className="hidden xs:inline">Report Now</span>
            <span className="inline xs:hidden">
              <span className="sr-only">Report Now</span>
              {/* Stylized 'R' compatible with dark header */}
              <span
                className="
                  flex 
                  items-center 
                  justify-center 
                  font-bold 
                  text-white 
                  text-base 
                  rounded-full 
                  bg-black/70
                  w-6 
                  h-6 
                  shadow-md 
                  border border-white/15
                  select-none
                  "
                aria-hidden="true"
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 2px 10px 0 #0007"
                }}
              >
                R
              </span>
            </span>
          </Button>
        </div>
        {/* Right: Profile/Nav */}
        <nav className="ml-auto flex items-center gap-2 xs:gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 xs:h-10 xs:w-10 rounded-full p-0">
                  <Avatar className="h-8 w-8 xs:h-10 xs:w-10">
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email} />
                    {/* Neutral black fallback with white initials */}
                    <AvatarFallback className="bg-black text-white font-semibold flex items-center justify-center h-8 w-8 xs:h-10 xs:w-10 text-base shadow-inner">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/profile'} >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/report'} >
                  Report an Issue
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-blue-600 hover:underline px-1 text-sm sm:px-2"
              >
                Sign In
              </Link>
              {/* Only show 'Sign Up' button after xs/sm breakpoint to conserve space */}
              <span className="hidden xs:inline">
                <Link
                  to="/auth"
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Sign Up
                </Link>
              </span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
