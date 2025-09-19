// src/components/ReportIssueForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ReportTypeToggle from '@/components/ReportTypeToggle';
import CountryNotice from '@/components/CountryNotice';
import ReportForm from '@/components/ReportForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createReport } from '@/lib/api';

interface ReportIssueFormProps {
  onSuccess?: () => void;
}

const ReportIssueForm: React.FC<ReportIssueFormProps> = ({ onSuccess }) => {
  const [reportType, setReportType] = useState<'missing' | 'lostfound' | 'safety' | 'civic'>('missing');

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    contactInfo: '',
    gmail: '',
  });

  // keep image in state but we are not uploading it yet
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const country = profile?.city || '';

  // Auto-sync gmail/phone from profile when profile becomes available
  useEffect(() => {
    if (!profile) return;
    setFormData((prev) => ({
      ...prev,
      gmail: profile.email ?? prev.gmail,
      contactInfo: (profile as any).phone ?? prev.contactInfo,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic normalization
    const title = (formData.title || '').trim();
    const description = (formData.description || '').trim();
    const location = (formData.location || '').trim();
    const phone = (formData.contactInfo || '').trim();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to report issues',
        variant: 'destructive',
      });
      return;
    }

    // Require phone number in profile OR entered by user for non-civic
    if (reportType !== 'civic' && (!phone || phone.length < 7)) {
      toast({
        title: 'Phone Number Required',
        description: 'Please add a valid phone number to your profile or in the Contact Information field before submitting a report.',
        variant: 'destructive',
      });
      return;
    }

    // Field length checks
    if (title.length < 5 || title.length > 100) {
      toast({
        title: 'Invalid Title',
        description: 'Title must be 5-100 characters.',
        variant: 'destructive',
      });
      return;
    }
    if (description.length < 10 || description.length > 1000) {
      toast({
        title: 'Invalid Description',
        description: 'Description must be 10-1000 characters.',
        variant: 'destructive',
      });
      return;
    }
    if (location.length < 3 || location.length > 200) {
      toast({
        title: 'Invalid Location',
        description: 'Location must be 3-200 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!profile || !profile.city || !country) {
      toast({
        title: 'Profile Incomplete',
        description: 'You must set your city/location in your profile before submitting a report.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // We are not performing image upload here. Keep image in state for future upload support.
      if (image) {
        toast({
          title: 'Image not uploaded',
          description: 'Image upload is not enabled yet — the report will be submitted without the photo. You can add image support later.',
        });
      }

      // Build category value for backend
      let category = 'general';
      if (reportType === 'missing') category = 'missing_person';
      else if (reportType === 'lostfound') category = 'lost_found';
      else if (reportType === 'safety') category = formData.type?.trim() || 'safety_alert';
      else if (reportType === 'civic') category = formData.type?.trim() || 'civic';

      // Prepare payload. Backend expects at least title, description, category.
      const payload: any = {
        title,
        description,
        category,
        location,
        city: country,
        priority: formData.priority,
        contact_info: formData.contactInfo || null,
      };

      toast({
        title: 'Submitting report...',
        description: 'Your report is being sent to the community.',
      });

      // createReport calls /api/reports
      await createReport(payload);

      toast({
        title: 'Report Submitted',
        description: `Your report has been submitted for ${country}.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Failed to create report', err);
      toast({
        title: 'Failed to submit report',
        description: err?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" /> Back
        </Button>
      </div>

      <CountryNotice country={country} />

      <ReportTypeToggle reportType={reportType} setReportType={setReportType} />

      <ReportForm
        reportType={reportType}
        formData={formData}
        setFormData={(updater) =>
          // allow both object or updater function
          typeof updater === 'function' ? setFormData(updater as any) : setFormData(updater)
        }
        image={image}
        setImage={setImage}
        loading={loading}
        country={country}
        onSubmit={handleSubmit}
        gmail={formData.gmail}
        phone={formData.contactInfo}
        setPhone={(phone: string) =>
          setFormData((prev) => ({ ...prev, contactInfo: phone }))
        }
      />
    </div>
  );
};

export default ReportIssueForm;
