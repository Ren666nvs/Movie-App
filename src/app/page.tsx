"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

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
  isExpanded,
  onToggle,
}: {
  title: string;
  movies: Movie[];
  push: (path: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const displayedMovies = isExpanded ? movies : movies.slice(0, 10); // Эхний 10 киног харуулах

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <Card
              key={movie.id}
              className="cursor-pointer hover:scale-105 transition"
              onClick={() => push(`/movies/${movie.id}`)}
            >
              <div className="relative w-full h-64">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    No Image
                  </div>
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
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No movies available
          </p>
        )}
      </div>

      {movies.length > 10 && !isExpanded && (
        <button onClick={onToggle} className="w-full text-center py-2 ">
          See More
        </button>
      )}
    </div>
  );
};

export default function Home() {
  const { push } = useRouter();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState({
    popular: false,
    upcoming: false,
    topRated: false,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      if (!TMDB_BASE_URL || !TMDB_API_TOKEN) {
        console.error("Missing TMDB environment variables.");
        setError(
          "Missing API configuration. Please check your .env.local file."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

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

        setPopularMovies(popular.data.results || []);
        setUpcomingMovies(upcoming.data.results || []);
        setTopRatedMovies(topRated.data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 text-black dark:text-white relative">
      {loading ? (
        <p className="text-center text-lg">Loading movies...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <MovieSection
            title="Upcoming Movies"
            movies={upcomingMovies}
            push={push}
            isExpanded={expanded.upcoming}
            onToggle={() =>
              setExpanded({ ...expanded, upcoming: !expanded.upcoming })
            }
          />
          <MovieSection
            title="Popular Movies"
            movies={popularMovies}
            push={push}
            isExpanded={expanded.popular}
            onToggle={() =>
              setExpanded({ ...expanded, popular: !expanded.popular })
            }
          />
          <MovieSection
            title="Top Rated Movies"
            movies={topRatedMovies}
            push={push}
            isExpanded={expanded.topRated}
            onToggle={() =>
              setExpanded({ ...expanded, topRated: !expanded.topRated })
            }
          />
        </>
      )}
    </div>
  );
}
