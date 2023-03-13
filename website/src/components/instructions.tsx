import React from "react";
export default function Instructions({
  title,
  instructions,
}: {
  title: string;
  instructions: string[];
}) {
  return (
    <div className="text-slate-700">
      <p className="font-semibold">{title}</p>
      <ol>
        {instructions.map((instruction, index) => (
          <li key={index}>
            {index + 1}. {instruction}
          </li>
        ))}
      </ol>
    </div>
  );
}
