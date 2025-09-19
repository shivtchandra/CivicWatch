// src/components/ReportForm.tsx
import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { createReport } from '@/lib/api';

interface ReportFormProps {
  reportType: 'missing' | 'lostfound' | 'safety' | 'civic';
  gmail: string;
  country: string;
  phone: string;
  setPhone: (phone: string) => void;
}

const safetyTypes = [
  { value: 'missing_person', label: 'Missing Person' },
  { value: 'lost_found', label: 'Lost & Found' },
  { value: 'safety_alert', label: 'Safety Alert' },
  { value: 'suspicious_activity', label: 'Suspicious Activity' },
];

const civicTypes = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'public_services', label: 'Public Services' },
  { value: 'environment', label: 'Environment' },
  { value: 'transportation', label: 'Transportation' },
];

const ReportForm: React.FC<ReportFormProps> = ({
  reportType,
  gmail,
  country,
  phone,
  setPhone,
}) => {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    priority: 'low',
    contactInfo: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const category =
        reportType === 'civic' || reportType === 'safety'
          ? formData.type || reportType
          : reportType;

      await createReport({
        title: formData.title,
        description: formData.description,
        category,
        // We don’t have lat/lng in form, keep null for now
        lat: null,
        lng: null,
      });

      alert('Report submitted successfully!');
      setFormData({
        type: '',
        title: '',
        description: '',
        location: '',
        priority: 'low',
        contactInfo: '',
      });
      setImage(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  }

  let filteredSafetyTypes = safetyTypes;
  if (reportType === 'missing') {
    filteredSafetyTypes = safetyTypes.filter((t) => t.value === 'missing_person');
  } else if (reportType === 'lostfound') {
    filteredSafetyTypes = safetyTypes.filter((t) => t.value === 'lost_found');
  } else if (reportType === 'safety') {
    filteredSafetyTypes = safetyTypes.filter(
      (t) => t.value === 'safety_alert' || t.value === 'suspicious_activity'
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {{
            missing: 'Report Missing Person',
            lostfound: 'Report Lost & Found',
            safety: 'Report Safety Issue',
            civic: 'Report Civic Issue',
          }[reportType]}
        </CardTitle>
        <CardDescription>
          Fill out the details below to submit a new report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={country} readOnly className="bg-black cursor-not-allowed" />
          </div>

          {(reportType === 'safety' || reportType === 'civic') && (
            <div className="space-y-2">
              <Label htmlFor="type">Issue Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {(reportType === 'safety' ? filteredSafetyTypes : civicTypes).map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief, descriptive title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Street address or landmark"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {reportType !== 'civic' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="gmail">Gmail</Label>
                <Input
                  id="gmail"
                  type="email"
                  value={gmail}
                  readOnly
                  className="bg-black cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Phone</Label>
                <Input
                  id="contactInfo"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Add Photo (Optional)</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Camera className="h-5 w-5 text-gray-400" />
            </div>
            {image && (
              <Badge variant="outline" className="mt-2">
                Image selected: {image.name}
              </Badge>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
