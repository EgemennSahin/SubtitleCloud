import { useEffect, useState } from "react";

export default function SubtitleInput({ url }: { url: string }) {
  const [srtContent, setSrtContent] = useState("");

  useEffect(() => {
    async function handleDownload() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to download .srt file: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.text();
        setSrtContent(data);
      } catch (error) {
        console.error(error);
      }
    }
    handleDownload();
  }, []);

  return (
    <div className="flex items-center">
      {srtContent && (
        <textarea
          value={srtContent}
          className="mt-4 w-full rounded-md border border-gray-300 py-2 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          rows={10}
          readOnly
        />
      )}
    </div>
  );
}
