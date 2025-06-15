
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  title?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title = "My Profile" }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-black/80 backdrop-blur-sm shadow-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="hover:bg-white/10 text-silver"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;

