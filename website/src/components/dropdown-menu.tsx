import React, { useState } from "react";

export type DropdownOption = {
  id: string;
  label: string;
};

export default function Dropdown({
  options,
  onChange,
  text,
  className = "",
}: {
  options: DropdownOption[];
  onChange: (option: DropdownOption) => void;
  text?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>();

  const handleOptionSelect = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
    setSelectedOption(option);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full rounded-md border px-3 py-2.5 text-left text-gray-500 shadow-sm focus:border-indigo-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate">
          {selectedOption
            ? selectedOption.label
            : text
            ? text
            : "Choose an option"}
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={`block w-full rounded-md px-3 py-2.5 text-left hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white focus:outline-none`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
