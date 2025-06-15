import { Button } from "@ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="mt-12 " id="heroTextWrapper">
      <h1 className="text-5xl">
        News and{" "}
        <span className="inline-block">
          <span className="bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">
            entertainment
          </span>
          <span className="block h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mt-1"></span>
        </span>
      </h1>{" "}
      <div className="fixed -mt-24 w-screen h-screen bg-[radial-gradient(circle_at_bottom_right,_rgba(255,0,128,0.3),_transparent_70%)] flex flex-col justify-center items-center">
        <Link href="/articles">
          <Button className="px-8 py-4 h-[60px] text-base">
            Read articles!
          </Button>
        </Link>
      </div>{" "}
    </div>
  );
}
