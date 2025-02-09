"use client";
import React, { useState } from "react";
import { Film, Search } from "lucide-react";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import { useRouter } from "next/navigation";

const Header = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <div className="mx-5 flex items-center justify-between my-5">
      <div className="flex gap-2 text-indigo-700 cursor-pointer" onClick={() => router.push("/")}>
        <Film />
        <p className="font-bold">Movie Z</p>
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3 text-muted-foreground" />
          <input
            type="text"
            className="h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Search..."
            value={query}
            onChange={handleSearchChange}
          />
        </form>

        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
