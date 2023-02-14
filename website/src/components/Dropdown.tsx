import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";

type DropdownProps = {
  Options: { name: string; onClick: () => void }[];
};
function Dropdown({ Options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-block text-left">
      <button
        className="py-3 px-6 text-xl font-semibold text-blue-700 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bars3Icon className="h-7 w-7" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg">
          <div className="shadow-xs rounded-md bg-white">
            <div className="py-1">
              {
                /* Add options here */
                Options.map((option) => (
                  <a
                    key={option.name}
                    onClick={() => option.onClick()}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {option.name}
                  </a>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
