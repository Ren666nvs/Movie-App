"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import GenreFilter from "@/components/GenreFilter";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL ?? "https://image.tmdb.org/t/p";

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
}

export default function GenresPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const genreIds = searchParams.get("genreIds") || "";
        const pageParam = searchParams.get("page") || "1";
        setPage(Number(pageParam));

        const response = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?language=en-US&page=${pageParam}&with_genres=${genreIds}`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        );

        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set("page", newPage.toString());
    router.push(`/genres?${queryParams.toString()}`, { scroll: false });
  };

  const renderPageNumbers = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (page <= 4) {
      pages = [1, 2, 3, 4, "...", totalPages - 1, totalPages];
    } else if (page >= totalPages - 3) {
      pages = [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
    }

    return pages;
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Search Filter</h1>
      <GenreFilter />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {loading ? (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-300">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="text-center col-span-full text-red-500">No movies found for selected genre(s).</p>
        ) : (
          movies.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
                {movie.backdrop_path ? (
                  <Image
                    src={`${TMDB_IMAGE_BASE_URL}/w780${movie.backdrop_path}`}
                    alt={movie.title}
                    width={320}
                    height={180}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold truncate text-black dark:text-white">
                    {movie.title}
                  </h2>
                  <p className="text-yellow-500 text-sm flex items-center gap-1 mt-1">
                    <Star size={16} fill="yellow" stroke="yellow" />
                    {movie.vote_average.toFixed(1)}/10
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {renderPageNumbers().map((num, index) =>
            typeof num === "number" ? (
              <button
                key={index}
                aria-label={`Go to page ${num}`}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition duration-300 ${
                  num === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ) : (
              <span key={index} className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                {num}
              </span>
            )
          )}

          <button
            className="px-5 py-2 border rounded-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
