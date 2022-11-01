import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const { locale } = router;

  const videoEl = useRef<HTMLVideoElement>(null);

  const attemptPlay = () => {
    videoEl?.current?.play().catch((error) => {
      console.error("Error attempting to play", error);
    });
  };

  useEffect(() => {
    attemptPlay();
  });

  return (
    <div className="relative">
      <video
        ref={videoEl}
        autoPlay
        controls
        width={700}
        height={700}
        className="w-screen h-screen"
      >
        <source src="/videos/rickrolled.mp4" type="video/mp4" />
        Sorry, your browser does not support videos.
      </video>
      <Link href="/ready">
        <a className="px-8 py-4 rounded-lg text-2xl border  border-opacity-70 border-white  bg-black bg-opacity-90 text-white font-bold absolute bottom-16 right-4">
          Skip
        </a>
      </Link>
    </div>
  );
}
