import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, User2 } from "lucide-react";
import GeneralMessageThread from "@/components/GeneralMessageThread";

interface ReporterProfileDropdownProps {
  reporterId: string;
  reporterName?: string | null;
  reporterEmail?: string | null;
  currentUserId: string;
}

const ReporterProfileDropdown: React.FC<ReporterProfileDropdownProps> = ({
  reporterId,
  reporterName,
  reporterEmail,
  currentUserId,
}) => {
  const [showMessageBox, setShowMessageBox] = useState(false);

  const profileUrl = `/profile?user=${reporterId}`; // Placeholder, adapt as needed

  // Helper: initials
  const getInitials = (name?: string | null) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  };

  if (!reporterId || reporterId === currentUserId) return null;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 px-2 py-1 border bg-black text-white rounded shadow hover:bg-black/80 focus:outline-none transition"
            aria-label="Reporter actions"
          >
            <Avatar className="h-7 w-7 border border-white/20">
              <AvatarImage src={reporterEmail ? `https://avatar.vercel.sh/${reporterEmail}.png` : undefined} alt={reporterName || "User"} />
              <AvatarFallback className="bg-black text-white font-semibold flex items-center justify-center h-7 w-7 text-base shadow-inner">
                {getInitials(reporterName)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{reporterName || "Reporter"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-50 bg-black text-white border-white/10 min-w-[150px]">
          <DropdownMenuItem
            onClick={() => window.open(profileUrl, "_blank")}
          >
            <User2 className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowMessageBox((s) => !s)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {showMessageBox ? "Hide Message" : "Message"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showMessageBox && (
        <div className="mt-3 rounded border border-white/10 bg-white/5 p-2">
          <GeneralMessageThread
            conversationId={null}
            otherUserId={reporterId}
            otherUserName={reporterName}
          />
        </div>
      )}
    </div>
  );
};

export default ReporterProfileDropdown;
