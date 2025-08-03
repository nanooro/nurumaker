"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ui/articleCard";
import { EditorHeader } from "@/components/ui/editor-header";
import ArticleReadComponent from "@/components/ui/articleRead";
import { TiptapEditor } from "@/components/ui/TiptapEditor";

export default function Editor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [articleHeading, setArticleHeading] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [fullArticleContent, setFullArticleContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false); // New state for upload status
  const [articleDate, setArticleDate] = useState("");
  const [myArticles, setMyArticles] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/auth/login");
      } else {
        setUserId(data.session.user.id);
        setLoading(false);
        fetchUserArticles(data.session.user.id);
      }
    };
    checkAuth();

    const now = new Date();
    setArticleDate(
      now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );

    const saved = localStorage.getItem("savedArticle");
    if (saved) {
      const data = JSON.parse(saved);
      setArticleHeading(data.heading);
      setImgUrl(data.imgUrl);
      setArticleDate(data.date);
      setArticleContent(data.content);
      setFullArticleContent(data.fullContent || "");
      console.log("Loaded fullArticleContent from localStorage:", data.fullContent);
    }
  }, [router]);

  const fetchUserArticles = async (uid: string) => {
    const { data, error } = await supabase
      .from("Nannuru_articles_table")
      .select("*")
      .eq("user_id", uid)
      .eq("is_archived", false);
    if (!error && data) setMyArticles(data);
  };

  // New function for image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered.");
    if (!event.target.files || event.target.files.length === 0) {
      toast.error("You must select an image to upload.");
      console.log("No file selected.");
      return;
    }

    setUploading(true);
    const file = event.target.files[0];
    console.log("Selected file:", file);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    console.log("Uploading to filePath:", filePath);

    let { error: uploadError } = await supabase.storage
      .from('article-images') // Ensure you have a bucket named 'article-images' in Supabase Storage
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Error uploading image");
      console.error("Supabase upload error:", uploadError);
    } else {
      const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
      setImgUrl(data.publicUrl);
      toast.success("Image uploaded successfully!");
      console.log("Image public URL:", data.publicUrl);
    }
    setUploading(false);
  };

  const handleSaveArticleToSupabase = async () => {
    if (!articleHeading.trim()) {
      toast.error("Heading is required");
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = articleContent;
    const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';

    const { error } = await supabase.from("Nannuru_articles_table").insert({
      Heading: articleHeading,
      subHeading: plainTextContent.substring(0, 150), // Storing plain text summary
      fullContent: articleContent, // Storing rich HTML content
      imgUrl,
      date: articleDate,
      created_at: new Date().toISOString(),
      user_id: userId,
      is_archived: false,
    });

    if (error) {
      toast.error("Failed to save article");
    } else {
      toast.success("Article saved to Supabase!");
      fetchUserArticles(userId);
    }
  };
  
  const saveLocalData = () => {
    const data = {
      heading: articleHeading,
      imgUrl,
      date: articleDate,
      content: articleContent,
      fullContent: fullArticleContent,
    };
    localStorage.setItem("savedArticle", JSON.stringify(data));
    console.log("Saving to localStorage:", data);
  };

  useEffect(() => {
    saveLocalData();
  }, [articleHeading, imgUrl, articleContent, articleDate, fullArticleContent]);

  if (loading) return null;

  return (
    <>
      <Toaster richColors position="top-right" />
      <EditorHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Card className="p-4">
          <Input
            id="heading"
            type="text"
            value={articleHeading}
            onChange={(e) => setArticleHeading(e.target.value)}
            placeholder="Article Heading..."
            className="w-full px-3 py-2 text-lg bg-background border rounded focus:outline-none focus:ring-2 focus:ring-ring mb-4"
          />
          <TiptapEditor
            content={articleContent}
            onChange={(newContent: string) => {
              setArticleContent(newContent);
              setFullArticleContent(newContent);
              console.log("Article Content (HTML):", newContent);
            }}
          />
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Card Preview</h2>
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded border p-2 dark:bg-black bg-white"
          >
            <ArticleCard
              Heading={articleHeading}
              date={articleDate}
              imgUrl={imgUrl}
            />
          </motion.div>
          <h2 className="text-lg font-semibold my-4">Read Preview</h2>
          <motion.div
            key="read"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded border p-2 dark:bg-black bg-white"
          >
            <ArticleReadComponent
              heading={articleHeading}
              date={articleDate}
              imgUrl={imgUrl}
              content={fullArticleContent}
            />
          </motion.div>
        </Card>
      </div>
      <div className="p-4">
        <Button onClick={handleSaveArticleToSupabase} className="w-full mb-2">
          📤 Publish
        </Button>
        <label htmlFor="cover-image-upload" className="w-full">
          <Button asChild variant="outline" className="w-full">
            <span>🖼️ Upload Cover Image</span>
          </Button>
        </label>
        <Input
          id="cover-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {uploading && <p className="text-sm text-center mt-2">Uploading image...</p>}
        {imgUrl && <p className="text-sm text-center mt-2">Cover Image Set: <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">View Image</a></p>}
      </div>
      <Card className="p-4 space-y-4 w-full max-w-7xl mt-4">
        <h2 className="text-lg font-semibold">Your Published Articles</h2>
        {myArticles.length === 0 && (
          <p className="text-sm text-muted-foreground">No articles yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myArticles.map((a: any) => (
            <ArticleCard
              key={a.id}
              id={a.id}
              Heading={a.Heading}
              date={a.date || a.created_at}
              imgUrl={a.imgUrl}
            />
          ))}
        </div>
      </Card>

      <footer className="mt-4 text-sm text-muted-foreground text-center">
        🔗{" "}
        <a href="https://nannuru.com" className="underline" target="_blank">
          Visit Nannuru.com
        </a>
      </footer>
    </>
  );
}