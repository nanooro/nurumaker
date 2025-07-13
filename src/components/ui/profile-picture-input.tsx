import React, { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import { toast } from 'sonner';

interface ProfilePictureInputProps {
  currentImageUrl?: string;
  onSave: (imageUrl: string) => void;
}

export const ProfilePictureInput: React.FC<ProfilePictureInputProps> = ({
  currentImageUrl,
  onSave,
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');

  const handleSave = () => {
    if (imageUrl.trim() === '') {
      toast.error('Please enter an image URL.');
      return;
    }
    try {
      new URL(imageUrl);
      onSave(imageUrl);
    } catch (e) {
      toast.error('Invalid URL. Please enter a valid image URL.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Profile Picture</h3>
      {imageUrl && (
        <div className="flex justify-center">
          <img src={imageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
        </div>
      )}
      <Input
        placeholder="Enter image URL (e.g., from Postimages.org)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button onClick={handleSave} className="w-full">Save Profile Picture</Button>
      <p className="text-sm text-muted-foreground text-center">
        You can upload images to <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="underline">Postimages.org</a> and paste the direct link here.
      </p>
    </div>
  );
};