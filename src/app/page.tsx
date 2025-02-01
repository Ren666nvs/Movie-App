"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_SERVICE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_API_TOKEN = "YOUR_API_TOKEN_HERE";

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
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            className="cursor-pointer hover:scale-105 transition"
            onClick={() => push(`/category/${movie.id}`)}
          >
            <CardHeader className="text-lg font-semibold">
              {movie.title}
            </CardHeader>
            <div className="relative w-full h-64">
              {movie.poster_path && (
                <Image
                  src={`${TMDB_IMAGE_SERVICE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              )}
            </div>
            <CardContent className="text-center text-yellow-400 font-medium">
              Rate: {movie.vote_average.toFixed(1)}
            </CardContent>
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
    <div className="min-h-screen p-8 pb-20 sm:p-20 text-white relative">
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <>
          <h3 className="text-foreground text-2xl font-semibold">Upcoming</h3>
          <MovieSection
            title="UpComingMovies"
            movies={upcomingMovies}
            push={push}
          />
          <h3 className="text-foreground text-2xl font-semibold">Popular</h3>
          <MovieSection
            title="PopularMovies"
            movies={popularMovies}
            push={push}
          />
          <h3 className="text-foreground text-2xl font-semibold">Top Rated</h3>
          <MovieSection
            title="TopRatedMovies"
            movies={topRatedMovies}
            push={push}
          />
        </>
      )}
    </div>
  );
}
