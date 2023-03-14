import React from "react";
import BottomBar from "./bottom-bar";
import Sidebar from "./side-bar";
export function DashboardPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden bg-white">
      <Sidebar />
      <BottomBar />

      <div className="relative mx-auto grid auto-rows-min grid-cols-2 place-items-center items-start gap-2 gap-y-12 pt-8 pb-24 lg:gap-y-4 lg:pb-8">
        <div className="col-span-2 mx-auto mb-8">
          <h1 className="text-center text-4xl text-slate-600">{title}</h1>
          <h2 className="mt-4 text-xl">{subtitle}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
