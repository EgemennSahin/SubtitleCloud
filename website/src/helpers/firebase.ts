import {
  listAll,
  getDownloadURL,
  StorageReference,
  getMetadata,
} from "firebase/storage";

export const getVideos = async (storageRef: StorageReference) => {
  const res = await listAll(storageRef); // Wait for listAll to resolve
  const promises = res.items.map(async (item) => {
    const downloadURL = await getDownloadURL(item); // Wait for getDownloadURL to resolve
    const metadata = await getMetadata(item); // Get the metadata for the item
    const title = metadata.customMetadata?.title; // Get the title from the metadata
    const uid = item.name; // Get the uid from the path
    return { title, url: downloadURL, uid: uid }; // Return an object with the uid and url
  });
  const videoData = await Promise.all(promises); // Wait for all promises to resolve
  return videoData;
};
