
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import ProfileActivityStats from '@/components/profile/ProfileActivityStats';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// All color classes updated for black bg

const Profile = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        city: profile.city || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error(`Failed to update profile: ${error.message}`);
      } else {
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err: any) {
      toast.error(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        city: profile.city || ''
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-silver">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/70 dark-glass-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto text-silver mb-4" />
              <p className="text-silver mb-4">Please sign in to view your profile</p>
              <Button onClick={() => navigate('/auth')} className="bg-white/10 hover:bg-white/20 text-silver">Sign In</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <ProfileHeader />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-4 flex gap-4 border-b border-white/10">
          <button
            className="pb-2 px-3 font-semibold text-silver border-b-2 border-blue-400"
          >
            Profile
          </button>
        </div>
        <>
          <ProfileInfoCard
            user={user}
            profile={profile}
            formData={formData}
            editing={editing}
            saving={saving}
            onEdit={() => setEditing(true)}
            onCancel={handleCancel}
            onSave={handleSave}
            setFormData={setFormData}
          />
          <ProfileActivityStats />
        </>
      </div>
    </div>
  );
};

export default Profile;

