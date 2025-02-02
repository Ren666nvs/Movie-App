"use client";
import React, { useState } from "react";
import { Film, Search } from "lucide-react";
import { ModeToggle } from "../ModeToggle/ModeToggle"; 
// import * as Select from "@radix-ui/react-select"; 

const Header = () => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="mx-5 flex items-center justify-between my-5">
      <div className="flex gap-2 text-indigo-700">
        <Film />
        <p className="font-bold">Movie Z</p>
      </div>

      <div className="flex items-center gap-3">
      
        {/* <Select.Root>
          <Select.Trigger
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-[97px]"
            aria-haspopup="menu"
          >
            Genre
          </Select.Trigger>

          <Select.Content className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md p-5 space-y-4 w-[335px] sm:w-[577px]">
            <div className="text-foreground space-y-1">
              <h3 className="text-2xl font-semibold">Genres</h3>
              <p className="text-base">See lists of movies by genre</p>
            </div>
            <div className="shrink-0 bg-border h-[1px] w-full border-border border" />
            <Select.Viewport>
              <Select.Group>
                {/* Genre Items (as before) */}
                {/* <Select.Item
                  value="action"
                  className="inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold text-foreground rounded-full cursor-pointer hover:bg-transparent"
                  role="option"
                >
                  Action
                </Select.Item>
                {/* Add other genre items similarly */}
              {/* </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Root> */} 

     
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-muted-foreground" />
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
            placeholder="Search..."
            value={query}
            onChange={handleSearchChange}
          />
        </div>

       
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;

