
import { useEffect } from "react";

interface Profile {
  email?: string;
  phone?: string;
}

export function useSyncContactFields({
  user,
  profile,
  formData,
  setFormData,
  reportType,
}: {
  user: { email?: string } | null;
  profile: { phone?: string } | null;
  formData: any;
  setFormData: (v: any) => void;
  reportType: string;
}) {
  useEffect(() => {
    // Only prefill if not already set
    if ((!formData.gmail || formData.gmail === "") && user?.email) {
      setFormData({ ...formData, gmail: user.email });
    }
    // Only prefill phone if not set
    if ((!formData.contactInfo || formData.contactInfo === "") && profile?.phone) {
      setFormData((prev: any) => ({
        ...prev,
        contactInfo: profile.phone,
      }));
    }
    // Reset gmail if user changes (e.g. on logout/login)
    // Reset phone if profile changes
    // Reset contactInfo if reportType changes to a type that doesn't allow it.
  }, [user?.email, profile?.phone, reportType]);
}
