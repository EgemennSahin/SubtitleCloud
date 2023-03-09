import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

function NavBarDropdown({ children }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = (event: any) => {
    setTimeout(() => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.relatedTarget as Node)
      ) {
        setIsOpen(false);
      }
    }, 0);
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      onBlur={handleBlur}
      onClick={() => setIsOpen(!isOpen)}
    >
      <button className="text-xl font-semibold ">
        {isOpen ? (
          <ChevronUpIcon className="h-7 w-7 text-slate-900" />
        ) : (
          <ChevronDownIcon className="h-7 w-7 text-slate-500" />
        )}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-12 mt-2 w-48 cursor-pointer rounded-b-md shadow-lg"
        >
          <div className="shadow-xs rounded-b-md bg-white">{children}</div>
        </div>
      )}
    </div>
  );
}

export default NavBarDropdown;
