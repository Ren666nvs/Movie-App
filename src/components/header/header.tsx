import React from "react";
import { Film, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ModeToggle/ModeToggle";

const Header = () => {
  return (
    <div className="mx-5 flex items-center justify-between my-5">
      <div className="flex gap-2 text-indigo-700">
        <Film />
        <p className="font-bold">Movie Z</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="w-9 h-9">
          <Search />
        </Button>
        <div className="flex gap-3">
          <ModeToggle />
        </div>
      </div>
    </div>
   
  );
};

export default Header;
