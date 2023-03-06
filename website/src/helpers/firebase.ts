import { premiumStorage } from "@/config/firebase";
import {
  listAll,
  getDownloadURL,
  StorageReference,
  getMetadata,
  ref,
} from "firebase/storage";

export async function getVideos({
  uid,
  folder,
}: {
  uid: string;
  folder: "main" | "secondary" | "output";
}) {
  const storageRef = ref(premiumStorage, `${folder}/${uid}`);
  const res = await listAll(storageRef); // Wait for listAll to resolve
  const promises = res.items.map(async (item) => {
    const downloadURL = await getDownloadURL(item); // Wait for getDownloadURL to resolve
    const metadata = await getMetadata(item); // Get the metadata for the item
    const title = metadata.customMetadata?.title || null; // Get the title from the metadata
    const video_id = item.name; // Get the uid from the path
    return { title, url: downloadURL, video_id: video_id }; // Return an object with the uid and url
  });
  const videoData = await Promise.all(promises); // Wait for all promises to resolve
  return videoData;
}
