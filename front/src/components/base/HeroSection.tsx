import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="w-full h-screen flex justify-center flex-col">
      <div className="flex justify-center items-center ">
        <Image src="/banner_img.svg" width={600} height={600} alt="img" />
      </div>
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Discover the better choice, together.
        </p>
        <Link href="/login">
          <Button className=" mt-4 text-lg">Start free</Button>
        </Link>
      </div>
    </div>
  );
}
