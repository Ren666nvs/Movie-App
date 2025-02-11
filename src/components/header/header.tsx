"use client";
import React, { useEffect, useState } from "react";
import { Clapperboard, Search } from "lucide-react";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface Genre {
  id: number;
  name: string;
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const Header = () => {
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?language=en-US`, {
          headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      push(`/search?query=${query}`);
    }
  };

  const handleGenreSelect = (genreId: number) => {
    push(`/genres?genreIds=${genreId}`);
  };

  return (
    <div className="px-6 py-4 bg-white shadow-md dark:bg-gray-900 flex items-center justify-between rounded-xl">
      {/* Logo */}
      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 cursor-pointer" onClick={() => push("/")}>
        <Clapperboard className="w-6 h-6" />
        <p className="text-xl font-bold">Movie Z</p>
      </div>

      {/* Search & Genre Dropdown */}
      <div className="flex items-center gap-4">
        {/* Genre Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-4 py-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
              Genres
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            {genres.map((genre) => (
              <DropdownMenuItem 
                key={genre.id} 
                onClick={() => handleGenreSelect(genre.id)}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {genre.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Search movies..."
            value={query}
            onChange={handleSearchChange}
          />
        </form>

        {/* Dark Mode Toggle */}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
