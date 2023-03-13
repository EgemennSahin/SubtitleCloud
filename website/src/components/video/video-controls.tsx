import {
  ShareIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React from "react";
import { Modal } from "../modal";

export function VideoControls({
  src,
  folder,
  video_id,
}: {
  src: string;
  folder: string;
  video_id: string;
}) {
  const { ModalElement: CopyModal, openModal: openCopyModal } = Modal(
    "Video copied to clipboard!",
    "blue"
  );
  const { ModalElement: DeleteModal, openModal: openDeleteModal } = Modal(
    "Video deleted.",
    "red"
  );

  const router = useRouter();

  async function downloadVideo() {
    const response = await fetch(src as string);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Shortzoo Captioned Video.mp4";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(src);
  };

  return (
    <>
      <div className="mt-4 flex gap-4">
        <CopyModal />
        <button
          onClick={() => {
            copyLinkToClipboard();
            openCopyModal();
          }}
          className="btn-secondary"
        >
          <ShareIcon className="h-6 w-6" />
        </button>
        <button
          onClick={downloadVideo}
          className="focus:ring-offset-2; block transform items-center rounded-xl bg-blue-600 px-10 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ArrowDownTrayIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <DeleteModal />
        <button
          onClick={async () => {
            openDeleteModal();
            await fetch("/api/delete-video", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                folder,
                video_id,
              }),
            });
            router.reload();
          }}
          className="focus:ring-offset-2; block transform items-center rounded-xl bg-red-600 px-10 py-3 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
