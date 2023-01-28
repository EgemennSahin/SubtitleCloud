import React from "react";
import { storage } from "@/configs/firebaseConfig";
import {
  getDownloadURL,
  listAll,
  ListResult,
  ref,
  StorageReference,
} from "firebase/storage";

const IndexPage = () => {
  const listref = ref(storage, "videos/mp4");

  listAll(listref)
    .then((res: ListResult) => {
      res.items.forEach((itemRef: StorageReference) => {
        getDownloadURL(itemRef).then((url: string) => {
          console.log(url);
        });
      });
    })
    .catch((error: any) => {
      console.log(error);
    });

  return (
    <>
      <div className="mx-auto h-screen bg-gradient-to-r from-indigo-400 to-purple-500">
        <h1 className="text-center font-normal text-2xl text-teal-800">
          Homepage
        </h1>
      </div>
    </>
  );
};

export default IndexPage;
