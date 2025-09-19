
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';


interface ProfileInfoCardProps {
  user: any;
  profile: any;
  formData: { full_name: string; phone: string; city: string };
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  setFormData: React.Dispatch<React.SetStateAction<{ full_name: string; phone: string; city: string }>>;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  user,
  profile,
  formData,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
  setFormData,
}) => {
  return (
    <Card className="dark-glass-card">
      <CardHeader className="bg-black/80 rounded-t-lg border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription className="text-silver">
              Manage your personal information and account settings
            </CardDescription>
          </div>
          {!editing && (
            <Button onClick={onEdit} variant="secondary" className="bg-white/10 text-silver hover:bg-white/20">
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email (Read-only) */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-silver">
            <Mail className="h-4 w-4" />
            <span>Email Address</span>
          </Label>
          <Input
            value={user?.email || ''}
            disabled
            className="bg-white/10 text-silver border-white/20"
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>
        {/* Full Name */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-silver">
            <User className="h-4 w-4" />
            <span>Full Name</span>
          </Label>
          {editing ? (
            <Input
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter your full name"
              className="border-white/20 focus:border-silver bg-black/70 text-white"
            />
          ) : (
            <Input
              value={formData.full_name || 'Not provided'}
              disabled
              className="bg-white/10 text-silver border-white/20"
            />
          )}
        </div>
        {/* Phone */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-silver">
            <Phone className="h-4 w-4" />
            <span>Phone Number</span>
          </Label>
          {editing ? (
            <Input
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              type="tel"
              className="border-white/20 focus:border-silver bg-black/70 text-white"
            />
          ) : (
            <Input
              value={formData.phone || 'Not provided'}
              disabled
              className="bg-white/10 text-silver border-white/20"
            />
          )}
        </div>
        {/* Country/City */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-silver">
            <MapPin className="h-4 w-4" />
            <span>Country</span>
          </Label>
         
           : (
            <Input
              value={formData.city || 'Not provided'}
              disabled
              className="bg-white/10 text-silver border-white/20"
            />
          )
        </div>
        {/* Account Created */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-silver">
            <Calendar className="h-4 w-4" />
            <span>Member Since</span>
          </Label>
          <Input
            value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            disabled
            className="bg-white/10 text-silver border-white/20"
          />
        </div>
        {/* Action Buttons */}
        {editing && (
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onSave}
              disabled={saving}
              className="flex-1 bg-white/10 hover:bg-white/20 text-silver"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 border-white/20 text-silver hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;

