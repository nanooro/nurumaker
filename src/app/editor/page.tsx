"use client";
import { supabase } from "@/lib/supabaseClient.ts";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArticleCard from "@/components/ui/articleCard";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
const MotionButton = motion(Button);


import { useRouter } from "next/navigation";
export default function Editor() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  
  const [articleHeadingInput, setArticleHeadingInput] = useState("");
  const [articleHeading, setArticleHeading] = useState("");
  const [imgUrlInput, setImgUrlInput] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgUrlError, setImgUrlError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [articleDate, setArticleDate] = useState("");
  const [tab, setTab] = useState("card");
  const [articleContentInput, setArticleContentInput] = useState("");
  const [articleContent, setArticleContent] = useState("");

  useEffect(() => {
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
    }
  }, []);

  const handleHeadingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleHeadingInput(e.target.value);
  };

  const handleSetHeading = () => {
    setArticleHeading(articleHeadingInput);
    toast.success("Heading set!");
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImgUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgUrlInput(e.target.value);
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgUrl(reader.result as string);
        toast.success("Image uploaded!");
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleSaveArticle = () => {
    const article = {
      heading: articleHeading,
      imgUrl,
      date: articleDate,
    };
    localStorage.setItem("savedArticle", JSON.stringify(article));
    toast.success("Article saved locally!");
  };

  const tabAnim = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  const handleSaveArticleToSupabase = async () => {
    const { error } = await supabase.from("Nannuru_articles_table").insert({
      Heading: articleHeading,
      subHeading: articleContent,
      imgUrl,
      created_at: new Date().toISOString(),
    });
  
    if (error) {
      toast.error("Failed to save to Supabase");
      console.error(error);
    } else {
      toast.success("Saved to Supabase!");
    }
  };
  const [tabValue, setTabValue] = useState("link");
  
  if (loading) return null;
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col p-2 gap-4 justify-center items-center w-full min-h-screen">
        <Card className="p-4 space-y-4 w-full max-w-3xl mx-auto">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full justify-center mb-2">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              {tab === "card" && (
                <TabsContent value="card" forceMount>
                  <motion.div key="card" {...tabAnim}>
                    <Card className="relative p-4 border border-border rounded shadow-sm w-full max-w-3xl mx-auto">
                      <div className="absolute -top-3 left-3 bg-white dark:bg-background px-2 text-sm text-muted-foreground">
                        Card
                      </div>
                      <div className="border border-dashed border-muted rounded p-2">
                        <ArticleCard
                          Heading={articleHeading}
                          date={articleDate}
                          imgUrl={imgUrl}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}
              {tab === "read" && (
                <TabsContent value="read" forceMount>
                  <motion.div key="read" {...tabAnim}>
                    <Card className="relative p-4 border border-border rounded shadow-sm w-full max-w-3xl mx-auto">
                      <div className="absolute -top-3 left-3 bg-white dark:bg-background px-2 text-sm text-muted-foreground">
                        Read
                      </div>
                      <div className="border border-dashed border-muted rounded p-2">
                        <ArticleReadComponent
                          imgUrl={imgUrl}
                          heading={articleHeading}
                          date={articleDate}
                          content={articleContent}
                        />
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>

          <fieldset className="relative border border-border rounded px-2 pt-4 p-4">
            <legend className="absolute -top-3 left-3 bg-white dark:bg-background px-1 text-lg text-muted-foreground">
              Heading
            </legend>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Article heading..."
                onChange={handleHeadingInputChange}
              />
              <MotionButton
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handleSetHeading}
              >
                Set
              </MotionButton>
            </div>
          </fieldset>

          <fieldset className="relative border border-border rounded px-2 pt-4 p-4">
            <legend className="absolute -top-3 left-3 bg-white dark:bg-background px-1 text-lg text-muted-foreground">
              Content
            </legend>
            <div className="flex flex-col gap-2">
              <textarea
                rows={5}
                value={articleContentInput}
                onChange={(e) => setArticleContentInput(e.target.value)}
                className="w-full p-2 rounded border bg-background text-foreground"
                placeholder="Type article content here..."
              />
              <MotionButton
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                  setArticleContent(articleContentInput);
                  toast.success("Content set!");
                }}
              >
                Set
              </MotionButton>
            </div>
          </fieldset>

          <Drawer>
            <DrawerTrigger asChild>
              <MotionButton
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300 }}
                variant="outline"
                className="w-full"
              >
                🖼️ Add Image
              </MotionButton>
              
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Select Image Type</DrawerTitle>
              </DrawerHeader>

              <Tabs
                value={tabValue}
                onValueChange={setTabValue}
                className="w-full px-4"
              >
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="link">Custom Link</TabsTrigger>
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {tabValue === "link" && (
                    <motion.div
                      key="link"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <TabsContent value="link">
                        <motion.div layout>
                          <div className="flex gap-2 mb-2">
                            <Input
                              type="text"
                              placeholder="Article image URL..."
                              value={imgUrlInput}
                              onChange={handleImgUrlInputChange}
                            />
                            <Button onClick={handleImgUrlSet}>Set</Button>
                          </div>
                          {imgUrlError && (
                            <p className="text-sm text-red-500">
                              {imgUrlError}
                            </p>
                          )}
                          <div className="mb-12" />
                        </motion.div>
                      </TabsContent>
                    </motion.div>
                  )}

                  {tabValue === "file" && (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <TabsContent value="file">
                        <motion.div layout className="mb-6 space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                            id="hidden-file-input"
                          />
                          <label
                            htmlFor="hidden-file-input"
                            className="w-full mb-1 block text-sm border border-border rounded px-3 py-2 cursor-pointer hover:bg-accent"
                          >
                            {selectedFile
                              ? selectedFile.name
                              : "Click to choose file"}
                          </label>
                          <Button
                            className="w-full text-lg"
                            onClick={() => {
                              if (selectedFile) toast.success("File added!");
                              else toast.error("No file selected");
                            }}
                          >
                            ↑ Add File
                          </Button>
                          {imgUrl && (
                            <div className="mt-2 max-h-64 overflow-auto border rounded w-full">
                              <img
                                src={imgUrl}
                                alt="preview"
                                className="w-full object-contain"
                              />
                            </div>
                          )}
                        </motion.div>
                      </TabsContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Tabs>
            </DrawerContent>{" "}
          </Drawer>
          <Button onClick={handleSaveArticleToSupabase}>
            📤 Publish to Nannuru
          </Button>

        </Card>

        <footer className="mt-4">
          <a
            href="https://nannuru.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-semibold text-sm"
          >
            🔗 Visit Nannuru.com — Your creative space 🌐
          </a>
        </footer>
      </div>
    </>
  );
}
// "use client";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/ui/header";
import Share from "@/components/ui/share";
import SocialCard from "@/components/ui/socialCard";
// import ArticleCard from "@/components/ui/articleCard";

// export default function ArticleReadComponent() {
function ArticleReadComponent({
  imgUrl,
  heading,
  subHeading,
  date,
  content,
}: {
  imgUrl?: string;
  heading?: string;
  subHeading?: string;
  date?: string;
  content?: string;
}) {
  const { setTheme, theme } = useTheme();
  const { id } = useParams();

  const placeholder = {
    imgUrl: "https://via.placeholder.com/800x400.png?text=Article+Image",
    Heading: "Article Title Placeholder",
    // subHeading: "Subheading placeholder",
    date: "Date placeholder",
    content: "Article content will appear here...",
  };

  return (
    <>
      <Head>
        <meta property="og:image" content={imgUrl || placeholder.imgUrl} />
        <link rel="image_src" href={imgUrl || placeholder.imgUrl} />
      </Head>

      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">{heading || placeholder.Heading}</h1>
        <div className="flex items-center justify-between my-2">
          <p className="text-sm text-muted-foreground">
            {date || placeholder.date}
          </p>
          <Share id={id} />
        </div>

        <Image
          src={imgUrl || placeholder.imgUrl}
          alt="Article Image"
          width={800}
          height={400}
          className="my-4 w-full rounded"
        />

        <p className="mb-4">{subHeading || placeholder.subHeading}</p>
        <p className="whitespace-pre-line">{content || placeholder.content}</p>

        <div className="my-8 text-center text-muted-foreground">End</div>

        <div className="my-12">
          <fieldset>
            <legend className="text-2xl font-bold mb-2">
              Share this article ❤️
            </legend>
            <div className="flex gap-2 justify-center flex-wrap">
              <SocialCard
                linkUrl="#"
                imgUrl="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                name="facebook"
              />
              <SocialCard
                linkUrl="#"
                imgUrl="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                name="whatsapp"
              />
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}
