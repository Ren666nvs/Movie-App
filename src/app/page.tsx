"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TMDB_IMAGE_SERVICE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || "https://image.tmdb.org/t/p";

const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

const MovieSection = ({
  title,
  movies,
  push,
}: {
  title: string;
  movies: Movie[];
  push: (path: string) => void;
}) => {
  const titleColor =
  title === "Upcoming Movies"
    ? "text-black"
    : title === "Popular Movies"
    ? "text-black"
    : "text-black";

  return (
    <div className="mb-12">
      <h2
        className={`text-2xl font-bold mb-4 ${titleColor} dark:text-white`}
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            className="cursor-pointer hover:scale-105 transition"
            onClick={() => push(`/category/${movie.id}`)}
          >
            <div className="relative w-full h-64">
              {movie.poster_path && (
               <Image
               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
               alt={movie.title}
               layout="fill"
               objectFit="cover"
               className="rounded-md"
             />
             
              )}
            </div>

            <CardContent className="flex items-center justify-start space-x-2 text-left text-yellow-400 font-medium">
              <Star className="text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)} / 10</span>
            </CardContent>

            <CardHeader className="text-lg font-semibold text-center">
              {movie.title}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { push } = useRouter();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, upcoming, topRated] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: { language: "en-US", page: 1 },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
            params: { language: "en-US", page: 1 },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
            params: { language: "en-US", page: 1 },
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }),
        ]);

        setPopularMovies(popular.data.results);
        setUpcomingMovies(upcoming.data.results);
        setTopRatedMovies(topRated.data.results);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 text-black dark:text-white relative">
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <>
          <MovieSection
            title="Upcoming Movies"
            movies={upcomingMovies}
            push={push}
          />

          <MovieSection
            title="Popular Movies"
            movies={popularMovies}
            push={push}
          />

          <MovieSection
            title="Top Rated Movies"
            movies={topRatedMovies}
            push={push}
          />
        </>
      )}
    </div>
  );
}
