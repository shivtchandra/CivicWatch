import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ReportTypeToggle from '@/components/ReportTypeToggle';
import CountryNotice from '@/components/CountryNotice';
import ReportForm from '@/components/ReportForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
// Import hook
import { useSyncContactFields } from './hooks/useSyncContactFields';

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
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const country = profile?.city || "";

  // Auto-sync gmail and phone from profile/user
  useSyncContactFields({ user, profile, formData, setFormData, reportType });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CLIENT-SIDE INPUT VALIDATION
    const title = formData.title.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const phone = formData.contactInfo?.trim() || "";

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report issues",
        variant: "destructive"
      });
      return;
    }

    // Require phone number in profile OR entered by user for non-civic
    if (reportType !== "civic" && (!phone || phone.length < 7)) {
      toast({
        title: "Phone Number Required",
        description: "Please add a valid phone number to your profile or in the Contact Information field before submitting a report.",
        variant: "destructive"
      });
      return;
    }

    // Field length checks to prevent overflows
    if (title.length < 5 || title.length > 100) {
      toast({
        title: "Invalid Title",
        description: "Title must be 5-100 characters.",
        variant: "destructive"
      });
      return;
    }
    if (description.length < 10 || description.length > 1000) {
      toast({
        title: "Invalid Description",
        description: "Description must be 10-1000 characters.",
        variant: "destructive"
      });
      return;
    }
    if (location.length < 3 || location.length > 200) {
      toast({
        title: "Invalid Location",
        description: "Location must be 3-200 characters.",
        variant: "destructive"
      });
      return;
    }

    if (!profile || !profile.city || !country) {
      toast({
        title: "Profile Incomplete",
        description: "You must set your city/location in your profile before submitting a report.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      if (image) {
        toast({
          title: "Uploading image...",
          description: "Please wait while your photo is being uploaded.",
        });
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('reports')
          .upload(fileName, image);

        if (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: "Image upload failed",
            description: uploadError.message || "Unable to upload the image. Report will be submitted without a photo.",
            variant: "destructive",
          });
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('reports')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
          console.log("Image uploaded. URL:", imageUrl);
        }
      }

      if (
        ((reportType === "missing" || reportType === "lostfound" || reportType === "safety") && (!formData.title || !formData.description || !formData.location)) ||
        (reportType === "civic" && (!formData.type || !formData.title || !formData.description || !formData.location))
      ) {
        toast({
          title: "Form Incomplete",
          description: "Please fill in all mandatory fields before submitting.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      let tableName: "safety_alerts" | "civic_reports";
      let insertData: any = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        priority: formData.priority,
        city: country,
        image_url: imageUrl,
      };

      if (reportType === "missing") {
        tableName = "safety_alerts";
        insertData = {
          ...insertData,
          type: "missing_person",
          contact_info: formData.contactInfo,
        };
      } else if (reportType === "lostfound") {
        tableName = "safety_alerts";
        insertData = {
          ...insertData,
          type: "lost_found",
          contact_info: formData.contactInfo,
        };
      } else if (reportType === "safety") {
        tableName = "safety_alerts";
        insertData = {
          ...insertData,
          type: formData.type,
          contact_info: formData.contactInfo,
        };
      } else {
        tableName = "civic_reports";
        insertData = {
          ...insertData,
          type: formData.type,
        };
      }

      toast({
        title: "Submitting report...",
        description: "Your report is being sent to the community.",
      });

      const { error, data } = await supabase
        .from(tableName)
        .insert(insertData);

      if (error) {
        console.error('Report submission failed:', error);
        if (error.code === "42501" || error.message?.includes("row-level security")) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to submit this report. Please make sure your profile is complete and you are signed in.",
            variant: "destructive",
          });
        } else if (error.message?.includes("storage")) {
          toast({
            title: "Storage Error",
            description: "Error uploading or accessing image file. Try submitting without an image.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to submit report",
            description: error.message || "There was an error creating your report.",
            variant: "destructive",
          });
        }
        setLoading(false);
        return;
      } else {
        console.log("Report submitted successfully:", data);
      }

      toast({
        title: "Report Submitted",
        description: `Your report has been submitted for ${country}. The community will be notified.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Unexpected error during report creation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CountryNotice country={country} />
      <ReportTypeToggle reportType={reportType} setReportType={setReportType} />
      <ReportForm
        reportType={reportType}
        formData={formData}
        setFormData={setFormData}
        image={image}
        setImage={setImage}
        loading={loading}
        country={country}
        onSubmit={handleSubmit}
        gmail={formData.gmail}
        phone={formData.contactInfo}
        setPhone={(phone: string) => setFormData({ ...formData, contactInfo: phone })}
      />
    </>
  );
};

export default ReportIssueForm;
