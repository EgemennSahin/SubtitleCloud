import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

function Dropdown({ children }: any) {
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
      className="inline-block text-left"
      onBlur={handleBlur}
      onClick={() => setIsOpen(!isOpen)}
    >
      <button className="py-3 px-6 text-xl font-semibold text-blue-500">
        {isOpen ? (
          <ChevronUpIcon className="h-7 w-7" />
        ) : (
          <ChevronDownIcon className="h-7 w-7" />
        )}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg"
        >
          <div className="shadow-xs rounded-md bg-slate-50">{children}</div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
