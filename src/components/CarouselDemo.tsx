"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

const CarouselDemo = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [movies, setMovies] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`, {
          params: { language: "en-US", page: 1 },
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        });

        setMovies(response.data.results); 
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (loading) {
    return <div>Loading movies...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center p-24 h-screen">
      <div className="flex flex-col gap-10 justify-center items-center">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent>
            {movies.map((movie, index) => (
              <CarouselItem
                key={index}
                className="flex w-full justify-center items-center"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-md"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex gap-3 mt-5">
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
};

export default CarouselDemo;
