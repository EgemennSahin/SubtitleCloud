import { premiumStorage } from "@/config/firebase";
import { getDownloadURL, getMetadata, ref, list } from "firebase/storage";

export async function getVideos({
  uid,
  folder,
  pageToken,
}: {
  uid: string;
  folder: "main" | "secondary" | "output";
  pageToken?: string;
}) {
  const storageRef = ref(premiumStorage, `${folder}/${uid}`);

  let options = {};
  if (folder == "output") {
    options = {
      maxResults: 3,
      pageToken: pageToken || null,
    };
  }
  const res = await list(storageRef, options); // Wait for listAll to resolve
  const promises = res.items.map(async (item) => {
    const downloadURL = await getDownloadURL(item); // Wait for getDownloadURL to resolve
    const metadata = await getMetadata(item); // Get the metadata for the item
    const title = metadata.customMetadata?.title || null; // Get the title from the metadata
    const video_id = item.name; // Get the uid from the path
    return { title, url: downloadURL, video_id: video_id }; // Return an object with the uid and url
  });

  const videoData = await Promise.all(promises); // Wait for all promises to resolve

  return { videoData, nextPageToken: res.nextPageToken };
}

export function createPath(folder: string, uid: string, video_id: string) {
  return `${folder}/${uid}/${video_id}`;
}

export async function renameVideo(
  video_id: string,
  folder: string,
  name: string
) {
  if (!video_id || !name) return;

  const response = await fetch("/api/rename-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_id, folder, name }),
  });

  return await response.json();
}
