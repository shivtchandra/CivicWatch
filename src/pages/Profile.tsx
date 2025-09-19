// src/pages/Profile.tsx
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

interface UpdatePayload {
  full_name?: string;
  phone?: string;
  city?: string;
}

const ProfilePage: React.FC = () => {
  // AuthContext exposes `profile` and `loading` (and other helpers).
  const { profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<{
    full_name: string;
    phone: string;
    city: string;
  }>({
    full_name: '',
    phone: '',
    city: '',
  });
  

  useEffect(() => {
    if (profile) {
      // adapt to whichever shape your backend returns; we use common keys
      setFormData({
        full_name: (profile as any).full_name ?? (profile as any).name ?? '',
        phone: (profile as any).phone ?? '',
        city: (profile as any).city ?? ''
      });
    } else {
      setFormData({ full_name: '', phone: '', city: '' });
    }
  }, [profile]);

  // Local updateProfile implementation — calls your backend.
  // Adjust the endpoint if your backend uses a different path (e.g. /api/users/me).
  const updateProfile = async (payload: {
    full_name: string;
    phone: string;
    city: string;
  }) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody?.message ?? `Server returned ${res.status}`;
        return { error: { message } };
      }
  
      await refreshProfile();
      return { error: null };
    } catch (err: any) {
      return { error: { message: err?.message ?? 'Network error' } };
    } finally {
      setSaving(false);
    }
  };
  
  const handleSave = async () => {
    // form validation (simple)
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      toast.error('Please enter a valid name.');
      return;
    }

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
      toast.error(`Failed to update profile: ${err?.message ?? String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: (profile as any).full_name ?? (profile as any).name ?? '',
        phone: (profile as any).phone ?? '',
        city: (profile as any).city ?? ''
      });
    } else {
      setFormData({ full_name: '', phone: '', city: '' });
    }
    setEditing(false);
  };

  // Loading state: wait for auth context
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-silver">Loading profile...</div>
      </div>
    );
  }

  // Not signed in
  if (!profile) {
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

  // Signed in — show profile UI (keeps your original layout)
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

        <ProfileInfoCard
          user={profile} // many existing components expect `user` shape; pass profile
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
      </div>
    </div>
  );
};

export default ProfilePage;
