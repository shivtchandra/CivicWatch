
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";

const ProfileSetup = () => {
  const { user, profile, updateProfile } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Open modal if user is logged in and no country set
  useEffect(() => {
    if (user && (!profile?.city || profile.city.trim() === '')) {
      setShowModal(true);
      setSelectedCountry('');
    } else {
      setShowModal(false);
    }
  }, [user, profile]);

  // Save country and immediately close modal
  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country);
    setSaving(true);
    setShowModal(false); // Instantly close modal
    try {
      const { error } = await updateProfile({ city: country });
      if (error) {
        toast.error(`Failed to save country: ${error.message || 'Unknown error'}`);
      } else {
        toast.success(`Country set to ${country}!`);
      }
    } catch (err: any) {
      toast.error(`Failed to save country: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (!showModal) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CivicWatch!</DialogTitle>
          <DialogDescription>
            To show you relevant local issues and reports, please select your country.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
         
        </div>
        <div className="mt-4 flex items-center justify-center min-h-[24px]">
          {saving && (
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving your country...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetup;

