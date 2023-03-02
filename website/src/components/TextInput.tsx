import { useEffect, useState } from "react";
import TextButton from "./text-button";

export default function SubtitleInput({
  downloadUrl,
  uploadUrl,
  uid,
}: {
  downloadUrl: string;
  uploadUrl: string;
  uid: string;
}) {
  const [srtContent, setSrtContent] = useState("");
  const [uploaded, setUploaded] = useState(false);

  // upload the edited srtContent to the uploadUrl
  async function handleUpload() {
    // Create a new Blob object from the srtContent string
    const file = new File([srtContent], uid, { type: "text/plain" });

    // Create a new FormData object and append the Blob to it
    const formData = new FormData();
    formData.append("subtitle", file, uid);
    try {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: file,
      });

      setUploaded(true);
    } catch (error) {
      console.error(error);
      setUploaded(false);
    }
  }

  useEffect(() => {
    async function handleDownload() {
      try {
        const response = await fetch(downloadUrl);
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
    <>
      {srtContent && (
        <div className="flex items-center">
          <textarea
            value={srtContent}
            className="mt-4 w-full rounded-md border border-gray-300 py-2 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            rows={13}
            onChange={(e) => setSrtContent(e.target.value)}
          />
          <TextButton
            color="secondary"
            size="medium"
            onClick={handleUpload}
            text={"Submit"}
          />
          {uploaded && <p>uploaded</p>}
        </div>
      )}
    </>
  );
}
