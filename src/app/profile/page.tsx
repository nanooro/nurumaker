"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { ProfilePictureInput } from "@/components/ui/profile-picture-input";
import { updateProfilePicture } from "@/lib/accountManager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | null>(null);
  const [tempUserName, setTempUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/auth/login");
      else {
        setUserId(data.session.user.id);
        setLoading(false);
        fetchProfilePicture(data.session.user.id);
        fetchUserName(data.session.user.id);
      }
    };
    checkAuth();
  }, [router]);

  const fetchUserName = async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', uid)
      .single();

    if (error) {
      console.error('Error fetching user name:', error);
    } else if (data) {
      setUserName(data.full_name);
      setTempUserName(data.full_name || "");
    }
  };

  const handleSaveName = async () => {
    if (!userId || !tempUserName.trim()) return;

    setLoading(true);
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ full_name: tempUserName.trim() })
      .eq('id', userId);

    if (updateProfileError) {
      toast.error("Failed to update username: " + updateProfileError.message);
      setLoading(false);
      return;
    }

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: { full_name: tempUserName.trim() },
      display_name: tempUserName.trim(),
    });

    if (updateUserError) {
      toast.error("Failed to update user metadata: " + updateUserError.message);
      setLoading(false);
      return;
    }

    setUserName(tempUserName.trim());
    setIsEditingName(false);
    toast.success("Username updated successfully!");
    setLoading(false);
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen p-2">
        <Card className="p-4 space-y-4 w-full max-w-md">
          <h2 className="text-lg font-semibold">Profile Settings</h2>

          <ProfilePictureInput currentImageUrl={profileImageUrl} onSave={handleSaveProfilePicture} />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">User Name</h3>
            {isEditingName ? (
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder="Your Name"
                />
                <Button onClick={handleSaveName} disabled={loading}>
                  {loading ? "Saving..." : "Save Name"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditingName(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p>{userName || "Not set"}</p>
                <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}