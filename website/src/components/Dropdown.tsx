import React, { useState } from "react";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-block text-left">
      <button
        className="bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900 font-semibold text-xl py-3 px-4 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        ...
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
          <div className="rounded-md bg-white shadow-xs">
            <div className="py-1">
              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Action
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Another action
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Something else
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
