"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ui/articleCard";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { EditorHeader } from "@/components/ui/editor-header";
import ArticleReadComponent from "@/components/ui/articleRead";

export default function Editor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [articleHeadingInput, setArticleHeadingInput] = useState("");
  const [articleHeading, setArticleHeading] = useState("");
  const [imgUrlInput, setImgUrlInput] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgUrlError, setImgUrlError] = useState("");
  const [articleDate, setArticleDate] = useState("");
  const [tab, setTab] = useState("card");
  const [articleContentInput, setArticleContentInput] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [tabValue, setTabValue] = useState("file");
  const [myArticles, setMyArticles] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/auth/login");
      else {
        setUserId(data.session.user.id);
        setLoading(false);
        fetchUserArticles(data.session.user.id);
        

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImgUrlSet = () => {
    if (validateUrl(imgUrlInput)) {
      setImgUrl(imgUrlInput);
      setImgUrlError("");
      toast.success("Image URL set!");
    } else {
      setImgUrlError("Invalid URL");
      toast.error("Invalid image URL");
    }
  };

  

  const handleSaveArticleToSupabase = async () => {
    if (!articleHeading.trim()) {
      toast.error("Heading is required");
      return;
    }

    const { error } = await supabase.from("Nannuru_articles_table").insert({
      Heading: articleHeading,
      subHeading: articleContent,
      imgUrl,
      created_at: new Date().toISOString(),
      user_id: userId,
      is_archived: false,
    });

    if (error) toast.error("Failed to save");
    else {
      toast.success("Saved to Supabase!");
      fetchUserArticles(userId);
    }
  };

  if (loading) return null;

  return (
    <>
      <Toaster richColors position="top-right" />
      <EditorHeader />
      <div className="flex flex-col p-2 gap-4 items-center w-full min-h-screen">

        <Card className="p-4 space-y-4 w-full max-w-3xl">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full justify-center">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <TabsContent value="card">
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border p-2 dark:bg-black bg-white">
                <ArticleCard Heading={articleHeading} date={articleDate} imgUrl={imgUrl} />
              </motion.div>
            </TabsContent>

            <TabsContent value="read">
              <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded border p-2 dark:bg-black bg-white">
                <ArticleReadComponent heading={articleHeading} date={articleDate} imgUrl={imgUrl} content={articleContent} />
              </motion.div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div className="relative">
              <input
                id="heading"
                type="text"
                value={articleHeadingInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 100) {
                    setArticleHeadingInput(val);
                    setArticleHeading(val);
                  }
                }}
                className="peer w-full px-3 pt-5 pb-2 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder=" "
              />
              <label htmlFor="heading" className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                Heading (max 100 chars)
              </label>
            </div>

            <div className="relative">
              <textarea
                id="content"
                value={articleContentInput}
                onChange={(e) => {
                  setArticleContentInput(e.target.value);
                  setArticleContent(e.target.value);
                }}
                rows={5}
                placeholder=" "
                className="peer w-full px-3 pt-5 pb-2 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-ring"
              ></textarea>
              <label htmlFor="content" className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
                Content
              </label>
            </div>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full">🖼️ Add Image</Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>Select Image Type</DrawerTitle>
              </DrawerHeader>
              <div className="flex justify-center items-center gap-2 min-h-[200px] p-4">
                <Input value={imgUrlInput} onChange={(e) => setImgUrlInput(e.target.value)} placeholder="Image URL..." />
                <Button onClick={handleImgUrlSet}>Set</Button>
              </div>
              {imgUrlError && <p className="text-sm text-red-500 w-full -mt-12 text-center">{imgUrlError}</p>}
              <p className="text-sm text-muted-foreground mt-4 text-center">You can upload images to <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="underline">Postimages.org</a> and paste the direct link here.</p>
            </DrawerContent>
          </Drawer>

          <Button onClick={handleSaveArticleToSupabase} className="w-full">📤 Publish</Button>

          
        </Card>

        <Card className="p-4 space-y-4 w-full max-w-3xl mt-4">
          <h2 className="text-lg font-semibold">Your Published Articles</h2>
          {myArticles.length === 0 && <p className="text-sm text-muted-foreground">No articles yet.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myArticles.map((a: any) => (
              <ArticleCard key={a.id} id={a.id} Heading={a.Heading} date={a.date || a.created_at} imgUrl={a.imgUrl} />
            ))}
          </div>
        </Card>

        <footer className="mt-4 text-sm text-muted-foreground">
          🔗 <a href="https://nannuru.com" className="underline" target="_blank">Visit Nannuru.com</a>
        </footer>
      </div>
    </>
  );
}