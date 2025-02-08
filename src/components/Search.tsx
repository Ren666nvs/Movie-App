"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function SearchMovies() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const router = useRouter();

  const fetchMovies = async () => {
    if (!TMDB_BASE_URL || !TMDB_API_TOKEN) {
      console.error("Missing TMDB environment variables.");
      setError("Missing API configuration. Please check your .env.local file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          query: searchValue,
          language: "en-US",
          page,
        },
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
      });

      setMovies(response.data.results);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchValue) {
      fetchMovies();
    } else {
      setMovies([]);
    }
  }, [searchValue, page]);

  return (
    <div className="min-h-screen p-8 relative">
      <div className="mb-4">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300"
          placeholder="Search for movies..."
        />
      </div>

      {loading && <p className="text-center text-lg">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="cursor-pointer"
              onClick={() => router.push(`/movies/${movie.id}`)}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
                className="rounded-md"
              />
              <p className="text-center mt-2">{movie.title}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No movies found
          </p>
        )}
      </div>

      {movies.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
