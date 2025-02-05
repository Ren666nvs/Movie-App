"use client";

import React, { useState } from "react";
import { Film, Search } from "lucide-react";
import { ModeToggle } from "../ModeToggle/ModeToggle";

const Header = () => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <header className="mx-5 flex items-center justify-between my-5">
      {/* Logo */}
      <div className="flex gap-2 text-indigo-700">
        <Film />
        <p className="font-bold text-lg">Movie Z</p>
      </div>

      {/* Search Bar & Theme Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-muted-foreground" />
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Search..."
            value={query}
            onChange={handleSearchChange}
          />
        </div>

        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
