"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

type MovieType = {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
};

export default function MovieCarousel() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/upcoming?language=en-US&page=1`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  if (movies.length === 0)
    return <p className="text-center">Loading movies...</p>;

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
      {movies.map((movie, index) => (
        <Link href={`/movies/${movie.id}`} key={movie.id}>
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={`${TMDB_IMAGE_URL}/original${movie.backdrop_path}`}
              alt={movie.title}
              layout="fill"
              objectFit="cover"
              className="brightness-75"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex items-center px-10">
              <div className="text-white max-w-lg">
                <h2
                  className="text-4xl font-bold cursor-pointer"
                  onClick={() => router.push(`/movies/${movie.id}`)}
                >
                  {movie.title}
                </h2>
                <p className="mt-3 text-lg">
                  {movie.overview?.substring(0, 150)}...
                </p>
                <p className="mt-2 flex items-center text-gray-400 font-semibold">
                  <Star size={14} fill="yellow" stroke="yellow" className="mr-1" />
                  {movie.vote_average?.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <button
        onClick={() =>
          setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1))
        }
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white transition"
      >
        <ChevronLeft className="text-black" />
      </button>
      <button
        onClick={() =>
          setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1))
        }
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white transition"
      >
        <ChevronRight className="text-black" />
      </button>
    </div>
  );
}
