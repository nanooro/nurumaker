import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@ui/card";

export default function SocialCard({ linkUrl, imgUrl, name }) {
  return (
    <>
      <Head>
        <meta property="og:title" content={name} />
        <meta
          property="og:description"
          content={`Check out ${name} on this page.`}
        />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:url" content={linkUrl} />
      </Head>

      <Link href={linkUrl} target="_blank">
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 px-4 py-4 rounded-xl shadow-sm outline outline-slate-200 dark:outline-neutral-700 transition-all w-fit">
          <div className="relative min-w-6 w-8 min-h-6 h-8">
            <Image src={imgUrl} alt={name} fill className="object-contain" />
          </div>
          <span className="font-medium text-sm text-black dark:text-white">
            {name}
          </span>
        </div>
      </Link>
    </>
  );
}
