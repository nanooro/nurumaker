"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { ProfilePictureInput } from "@/components/ui/profile-picture-input";
import { updateProfilePicture } from "@/lib/accountManager";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/auth/login");
      else {
        setUserId(data.session.user.id);
        setLoading(false);
        fetchProfilePicture(data.session.user.id);
      }
    };
    checkAuth();
  }, [router]);

  const fetchProfilePicture = async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', uid)
      .single();

    if (error) {
      console.error('Error fetching profile picture:', error);
    } else if (data) {
      setProfileImageUrl(data.avatar_url);
    }
  };

  const handleSaveProfilePicture = async (imageUrl: string) => {
    if (userId) {
      const { success } = await updateProfilePicture(userId, imageUrl);
      if (success) {
        toast.success('Profile picture updated!');
        setProfileImageUrl(imageUrl);
      } else {
        toast.error('Failed to update profile picture.');
      }
    }
  };

  if (loading) return null;

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col p-2 gap-4 items-center w-full min-h-screen">
        <Card className="p-4 space-y-4 w-full max-w-3xl">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          <ProfilePictureInput currentImageUrl={profileImageUrl} onSave={handleSaveProfilePicture} />
        </Card>
      </div>
    </>
  );
}