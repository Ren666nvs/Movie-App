"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CarouselDemo() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const projects = [
    { src: "/image1.jpg", alt: "Project 1" },
    { src: "/image2.jpg", alt: "Project 2" },
    { src: "/image3.jpg", alt: "Project 3" },
  ];

  return (
    <main className="flex flex-col items-center justify-center p-24 h-screen">
      <div className="flex flex-col gap-10 justify-center items-center">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent>
            {projects.map((project, index) => (
              <CarouselItem key={index} className="flex w-full justify-center items-center">
                <Image src={project.src} width={500} height={500} alt={project.alt} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex gap-3">
          <Button
            onClick={() => api?.scrollTo((current - 2 + count) % count)}
            className="rounded-full"
          >
            <ArrowLeft className="size-7" />
          </Button>
          <Button
            onClick={() => api?.scrollTo(current % count)}
            className="rounded-full"
          >
            <ArrowRight className="size-7" />
          </Button>
        </div>
      </div>
    </main>
  );
}
