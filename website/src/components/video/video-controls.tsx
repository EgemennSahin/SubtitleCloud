import {
  ShareIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { Modal } from "../modal";

export function VideoControls({
  src,
  folder,
  video_id,
  title,
}: {
  src: string;
  folder: string;
  video_id: string;
  title: string;
}) {
  const { ModalElement: CopyModal, openModal: openCopyModal } = Modal({
    text: "Video copied to clipboard!",
    color: "blue",
  });

  let name = title;
  const { ModalElement: RenameModal, openModal: openRenameModal } = Modal({
    body: {
      element: (
        <input
          type="text"
          key="rename"
          className="w-full rounded-lg border border-gray-300 p-2"
          placeholder={title}
          onChange={(e) => {
            e.preventDefault();
            name = e.target.value;
          }}
        />
      ),
      onSubmit: async () => {
        await fetch("/api/rename-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_id,
            folder,
            name,
          }),
        });
      },
    },
  });

  const { ModalElement: MoreModal, openModal: openMoreModal } = Modal({
    options: [
      {
        text: "Rename",
        onClick: openRenameModal,
      },
      {
        text: "Delete",
        onClick: async () => {
          await fetch("/api/delete-video", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              video_id,
              folder,
            }),
          });
        },
      },
    ],
  });

  async function downloadVideo() {
    const response = await fetch(src as string);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Shortzoo Captioned Video.mp4";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="flex w-1/2 justify-between gap-4">
      <CopyModal />
      <MoreModal />
      <RenameModal />
      <button
        onClick={() => {
          navigator.clipboard.writeText(src);
          openCopyModal();
        }}
        className="rounded-xl bg-white p-3 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ShareIcon className="h-6 w-6" />
      </button>{" "}
      <button
        onClick={downloadVideo}
        className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ArrowDownTrayIcon className="h-6 w-6" />
      </button>
      <button
        onClick={() => {
          openMoreModal();
        }}
        className="rounded-xl bg-white p-3 text-slate-600 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        <EllipsisVerticalIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
