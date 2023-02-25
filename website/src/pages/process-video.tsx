import FileInput from "@/components/file-input";
import React, { useEffect } from "react";
import TextButton from "@/components/text-button";
import {
  getMetadata,
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { tempStorage } from "@/config/firebase";
import { uuidv4 } from "@firebase/util";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/router";
import Head from "next/head";

const ProcessVideo = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedVideo, setUploadedVideo] = React.useState<string | null>();
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [processedVideo, setProcessedVideo] = React.useState<string | null>();

  const [token, setToken] = React.useState<string | null>();
  const [gettingToken, setGettingToken] = React.useState(false);
  const router = useRouter();
  const [notificationPermission, setNotificationPermission] =
    React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Set notification permission to true if user has granted permission
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    if (!isMobile && "Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationPermission(true);
      }
    }
  }, [isMobile]);

  // Process video if it is uploaded and token is received
  useEffect(() => {
    // Process video
    async function handleVideoProcessing() {
      if (!uploadedVideo || !token) {
        console.log("Wrong parameters");
        return;
      }

      console.log("Starting video processing...");

      // Check if video is uploaded to the google cloud storage bucket
      const videoRef = ref(tempStorage, "uploads/" + uploadedVideo);

      const videoExists = await getMetadata(videoRef);

      if (!videoExists) {
        console.log("Error getting video");
        return;
      }

      try {
        setProcessingVideo(true);

        const response_video_processing = await fetch(
          "https://public-process-api-gateway-6dipdkfs.uc.gateway.dev/subtitle?key=AIzaSyA8gNrXERBjLwY8MlAGNYawoQgfzbhdRYY",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              video_id: uploadedVideo,
              token: token,
            }),
          }
        );

        const data = await response_video_processing.json();
        console.log("Cloud function invoked: ", data);

        if (data.url) {
          setProcessedVideo(data.url);
        } else {
          setProcessedVideo(null);
        }

        setUploadedVideo(null);
        setProcessingVideo(false);

        return true;
      } catch (error: any) {
        console.log("Error processing video: ", error.message);

        setProcessingVideo(false);
        return false;
      }
    }

    if (uploadedVideo != null && token != null) {
      handleVideoProcessing();
    }
  }, [uploadedVideo, token]);

  // Redirect to video page if video is processed
  useEffect(() => {
    if (processedVideo != null) {
      console.log("Redirecting to video page: ", processedVideo);

      if (!isMobile && "Notification" in window && notificationPermission) {
        // Show notification
        const notification = new Notification("Process finished!", {
          body: "Your video has been processed.",
        });

        notification.onclick = () => {
          window.focus();
        };
      }

      router.push({
        pathname: `/content/${uploadedVideo}`,
        query: { video_url: processedVideo },
      });
    }
  }, [processedVideo, isMobile, notificationPermission, router, uploadedVideo]);

  async function handleFileUpload() {
    if (!file) {
      console.log("No file selected");
      return;
    } else {
      setUploading(true);

      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          return;
        }
        setGettingToken(true);

        const uid = uuidv4();
        const storageRef = ref(tempStorage, "uploads/" + uid);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot: UploadTaskSnapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload progress: " + progress + "%");
          },
          (error: StorageError) => {
            console.log("Error uploading file: " + error.message);
            setUploading(false);
          },
          () => {
            console.log("Upload complete");
            setUploadedVideo(uid);
            setProcessingVideo(true);
            setUploading(false);
            return;
          }
        );
      };
    }
  }

  return (
    <>
      <Head>
        <title>Process Video - Shortzoo</title>
        <meta
          name="description"
          content="Upload your video to be processed in our cloud servers. Be notified when your video is ready. Quickly and securely process your video files."
        />
      </Head>

      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-200 to-slate-400 py-5 sm:py-9">
        {processingVideo || uploading ? (
          <div className="flex h-fit w-fit flex-col items-center justify-start px-5">
            <h2 className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text px-4 text-center text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
              Your video is being processed.
            </h2>

            <div className="loader mb-16 h-56 w-56" />

            <h3 className="text-md linear-wipe mb-8 px-4 text-center sm:hidden ">
              This may take a few minutes. Please do not close the window or
              navigate away from this page.
            </h3>

            <h3 className="text-md linear-wipe mb-8 hidden px-4 text-center sm:block ">
              This may take a few minutes.
            </h3>

            {!notificationPermission && (
              <TextButton
                size="small"
                onClick={async () => {
                  const permission = await Notification.requestPermission();

                  if (permission === "granted") {
                    setNotificationPermission(true);
                  }
                }}
                color="bg-teal-500"
                hover="hover:bg-teal-600"
                text="Notify me when finished"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="mb-8 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text pr-1 text-4xl font-bold leading-relaxed tracking-tighter text-transparent">
              Upload your video
            </h2>

            <FileInput
              onFile={(file: File) => {
                setFile(file);
              }}
              disabled={processingVideo || uploading}
            />

            <h3 className="text-md mt-7 text-center text-xl font-normal tracking-wide text-slate-900 sm:mt-12">
              Video duration must be less than 3 minutes.
            </h3>

            <div className="mt-6 flex items-center justify-center">
              <TextButton
                size="medium"
                onClick={async () => {
                  // Notify user
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(
                    navigator.userAgent
                  );
                  if (!isMobile && "Notification" in window) {
                    if (Notification.permission !== "granted") {
                      Notification.requestPermission();
                    }
                  }

                  await handleFileUpload();
                }}
                text={"Submit"}
                disabled={!file || processingVideo || uploading}
              />
            </div>
          </div>
        )}

        {gettingToken && (
          <div style={{ position: "fixed", bottom: 0, right: 0 }}>
            <Turnstile
              className="mt-7"
              siteKey="0x4AAAAAAACiGkz1x1wcw2J9"
              scriptOptions={{ async: true, defer: true, appendTo: "head" }}
              onSuccess={(token: string) => {
                setToken(token);

                setTimeout(() => {
                  setGettingToken(false);
                }, 1000);
              }}
              options={{
                size: "compact",
                theme: "light",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProcessVideo;

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import { isPaidUser } from "@/helpers/stripe";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getIdToken({ context });

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (!isPaidUser({ token })) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    const user = await getUser({ uid: token.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
