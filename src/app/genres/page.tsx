"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import GenreFilter from "@/components/GenreFilter";
import Image from "next/image";
import { Star } from "lucide-react";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
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
          `${TMDB_BASE_URL}/discover/movie?language=en-US&page=${page}&with_genres=${genreIds}`,
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
    let pages = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (page <= 4) {
        pages = [1, 2, 3, 4, "...", totalPages - 1, totalPages];
      } else if (page >= totalPages - 3) {
        pages = [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
      }
    }
    return pages;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Filter</h1>

      <GenreFilter />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {loading ? (
          <p className="text-center col-span-full">Loading...</p>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
             
            >
              <Image
                src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
                alt={movie.title}
                width={250}
                height={375}
                className="object-cover"

              />
              <div className="p-2">
                <h2 className="text-sm font-semibold">{movie.title}</h2>
                <p className="text-yellow-500 text-xs flex items-center gap-1">
                  <Star size={14} fill="yellow" stroke="yellow" />
                  {movie.vote_average.toFixed(1)}/10
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        {renderPageNumbers().map((num, index) =>
          typeof num === "number" ? (
            <button
              key={index}
              className={`px-3 py-1 border rounded-md ${
                num === page ? "bg-blue-500 text-white font-bold" : "bg-gray-200"
              }`}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-gray-500">
              {num}
            </span>
          )
        )}

        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
