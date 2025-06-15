import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ReportFormProps {
  reportType: "missing" | "lostfound" | "safety" | "civic";
  formData: {
    type: string;
    title: string;
    description: string;
    location: string;
    priority: string;
    contactInfo: string;
    gmail?: string;
  };
  setFormData: (v: any) => void;
  image: File | null;
  setImage: (f: File | null) => void;
  loading: boolean;
  country: string;
  onSubmit: (e: React.FormEvent) => void;
  gmail: string;
  phone: string;
  setPhone: (phone: string) => void;
}

const safetyTypes = [
  { value: 'missing_person', label: 'Missing Person' },
  { value: 'lost_found', label: 'Lost & Found' },
  { value: 'safety_alert', label: 'Safety Alert' },
  { value: 'suspicious_activity', label: 'Suspicious Activity' }
];

const civicTypes = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'public_services', label: 'Public Services' },
  { value: 'environment', label: 'Environment' },
  { value: 'transportation', label: 'Transportation' }
];

const detailedSafetyTypeDescriptions = {
  missing_person: "Report cases of missing persons in your community. Please provide as much detail as possible to assist with finding them.",
  lost_found: "Report lost or found items or people. Help reunite lost property or individuals with their rightful owners or families.",
  safety_alert: "Report immediate safety concerns, hazardous conditions, or dangerous situations that pose a risk to community members. This includes broken streetlights, unsafe road conditions, or security threats.",
  suspicious_activity: "Report unusual behavior, potential criminal activity, or observations that could indicate threats to public safety."
};

const detailedCivicTypeDescriptions = {
  infrastructure: "Report problems with roads, bridges, sidewalks, drainage systems, public buildings, or any physical infrastructure that needs repair or maintenance.",
  public_services: "Report issues with garbage collection, public transportation, water supply, electricity, internet services, or other essential public utilities and services.",
  environment: "Report environmental concerns such as pollution, illegal dumping, water contamination, air quality issues, or damage to public green spaces and natural areas.",
  transportation: "Report traffic problems, damaged signals, missing road signs, public transport issues, parking problems, or any transportation-related concerns affecting community mobility."
};

const ReportForm: React.FC<ReportFormProps> = ({
  reportType, formData, setFormData, image, setImage, loading, country, onSubmit, gmail, phone, setPhone
}) => {
  // Filter out irrelevant options for the new types
  let filteredSafetyTypes = safetyTypes;
  if (reportType === "missing") {
    filteredSafetyTypes = safetyTypes.filter(t => t.value === "missing_person");
  } else if (reportType === "lostfound") {
    filteredSafetyTypes = safetyTypes.filter(t => t.value === "lost_found");
  } else if (reportType === "safety") {
    filteredSafetyTypes = safetyTypes.filter(t => t.value === "safety_alert" || t.value === "suspicious_activity");
  }

  // Choose the dynamic description for main type
  let mainDescription = {
    missing: 'Help keep the community safe by reporting missing persons.',
    lostfound: 'Report lost items or found people to help reunite them.',
    safety: 'Help keep the community safe by reporting safety concerns, hazardous conditions, or suspicious activities that might endanger community members. Examples: unsafe location or road, hazardous material, broken lights, criminal or threatening activity.',
    civic: 'Report issues affecting local governance, community infrastructure, essential public services, or the environment. Your input helps cities address problems and improve public welfare.'
  }[reportType];

  // For safety/civic, add type-specific description under the selector if selected
  const specificSafetyDescription = (reportType === "safety" && formData.type && detailedSafetyTypeDescriptions[formData.type as keyof typeof detailedSafetyTypeDescriptions])
    ? detailedSafetyTypeDescriptions[formData.type as keyof typeof detailedSafetyTypeDescriptions]
    : "";
  const specificCivicDescription = (reportType === "civic" && formData.type && detailedCivicTypeDescriptions[formData.type as keyof typeof detailedCivicTypeDescriptions])
    ? detailedCivicTypeDescriptions[formData.type as keyof typeof detailedCivicTypeDescriptions]
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {{
            missing: 'Report Missing Person',
            lostfound: 'Report Lost & Found',
            safety: 'Report Safety Issue',
            civic: 'Report Civic Issue'
          }[reportType]}
        </CardTitle>
        <CardDescription>
          {mainDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              readOnly
              className="bg-black cursor-not-allowed"
            />
          </div>
          {/* Show type selector only for "safety" or "civic" */}
          {(reportType === "safety" || reportType === "civic") && (
            <div className="space-y-2">
              <Label htmlFor="type">
                Issue Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
              {/* Show type-specific description below the issue type selector */}
              {(specificSafetyDescription || specificCivicDescription) && (
                <div className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded mt-1">
                  {specificSafetyDescription || specificCivicDescription}
                </div>
              )}
            </div>
          )}
          {/* Pre-set hidden type for "missing" and "lostfound" */}
          {(reportType === "missing" || reportType === "lostfound") && (
            <input type="hidden" name="type" value={filteredSafetyTypes[0]?.value} />
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
              placeholder="Provide detailed information about the issue..."
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
              required
            />
          </div>
          {/* Show Gmail (readonly, black bg) and Contact Info (phone) for non-civic */}
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
                  placeholder="Your Gmail"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information (Phone Number)</Label>
                <Input
                  id="contactInfo"
                  type="tel"
                  placeholder="Phone number for urgent contact"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  pattern="^[0-9+\-\s()]{7,}$"
                  minLength={7}
                  required
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Low Priority
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Medium Priority
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    High Priority
                  </div>
                </SelectItem>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
