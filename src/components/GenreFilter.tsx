"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

interface Genre {
  id: number;
  name: string;
}

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  useEffect(() => {
    const genreIdsFromURL = searchParams.get("genreIds");
    if (genreIdsFromURL) {
      setSelectedGenres(genreIdsFromURL.split(",").map(Number));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${TMDB_BASE_URL}/genre/movie/list?language=en-US`,
          {
            headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
          }
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (genreId: number) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];

    setSelectedGenres(updatedGenres);

    const queryParams = new URLSearchParams();
    if (updatedGenres.length > 0) {
      queryParams.set("genreIds", updatedGenres.join(","));
    }

    router.push(`/genres?${queryParams.toString()}`, { scroll: false });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-md w-full">
      <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">
        Genres
      </h2>
      <p className="text-sm text-black dark:text-gray-300 mb-4">
        See lists of movies by genre
      </p>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Badge
            key={genre.id}
            variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleGenreChange(genre.id)}
          >
            {genre.name}
          </Badge>
        ))}
      </div>
    </div>
  );
  
}
  