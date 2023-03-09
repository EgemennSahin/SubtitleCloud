import { useEffect, useState } from "react";
import SubtitleBox from "./subtitle-box";

interface Subtitle {
  startTime: string;
  endTime: string;
  text: string;
}

export default function SubtitleInput({
  srt,
  uploadUrl,
  uid,
}: {
  srt: string;
  uploadUrl: string;
  uid: string;
}) {
  const [srtContent, setSrtContent] = useState(srt);
  const [uploaded, setUploaded] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>();

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

  // Get each Subtitle object from the subtitles
  useEffect(() => {
    const lines = srtContent.trim().split("\n");

    const parsedSubtitles = [];

    for (let i = 0; i < lines.length; i += 4) {
      const [startTime, endTime] = lines[i + 1].split(" --> ");
      const text = lines[i + 2];
      parsedSubtitles.push({ startTime, endTime, text });
    }

    setSubtitles(parsedSubtitles);
  }, [srtContent]);

  // Edit the srtContent when a subtitle is changed
  function editSrtContent(
    index: number,
    updatedStart: string,
    updatedEnd: string,
    newText: string
  ) {
    const lines = srtContent.trim().split("\n");

    lines[index * 4 + 1] = `${updatedStart} --> ${updatedEnd}`;
    lines[index * 4 + 2] = newText;

    const newSrtContent = lines.join("\n");

    setSrtContent(newSrtContent);
  }

  return (
    <>
      {srtContent && (
        <div className="flex flex-col items-center">
          {subtitles?.map((subtitle, index) => {
            return (
              <SubtitleBox
                key={index}
                index={index}
                startTime={subtitle.startTime}
                endTime={subtitle.endTime}
                text={subtitle.text}
                onSubtitleChange={(
                  index,
                  updatedStart,
                  updatedEnd,
                  newText
                ) => {
                  // Update the srtContent when a subtitle is changed
                  // const subtitleRegex = /(\d+)\n([\d:,]+) --> ([\d:,]+)\n(.+)/gs;

                  editSrtContent(index, updatedStart, updatedEnd, newText);
                  console.log("SRT: ", srtContent);
                }}
              />
            );
          })}

          <button className="btn-secondary" onClick={handleUpload}>
            Confirm changes
          </button>
        </div>
      )}
    </>
  );
}
