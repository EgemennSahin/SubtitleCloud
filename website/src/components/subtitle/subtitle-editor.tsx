import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import SubtitleBox from "./subtitle-box";

interface Subtitle {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
}

export default function SubtitleInput({
  srt,
  setState,
}: {
  srt: string;
  setState: any;
}) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const subtitlesPerPage = 15;

  // Get each Subtitle object from the subtitles
  useEffect(() => {
    const lines = srt.trim().split("\n");

    const parsedSubtitles = [];

    for (let i = 0; i < lines.length; i += 4) {
      const index = parseInt(lines[i]);
      const [startTime, endTime] = lines[i + 1].split(" --> ");
      const text = lines[i + 2];
      parsedSubtitles.push({ index, startTime, endTime, text });
    }

    setSubtitles(parsedSubtitles);
  }, [srt]);

  // Edit the srtContent when a subtitle is changed
  function editSrtContent(
    index: number,
    updatedStart: string,
    updatedEnd: string,
    newText: string
  ) {
    const lines = srt.trim().split("\n");

    lines[index * 4 + 1] = `${updatedStart} --> ${updatedEnd}`;
    lines[index * 4 + 2] = newText;

    const newSrtContent = lines.join("\n");

    setState(newSrtContent);
  }

  // Get the start and end index of the current page
  const startIndex = Math.max((currentPage - 1) * subtitlesPerPage, 0);
  const endIndex = Math.min(currentPage * subtitlesPerPage, subtitles?.length!);

  return (
    <>
      {srt && (
        <div className="flex flex-col items-center space-y-2">
          {subtitles.slice(startIndex, endIndex).map((subtitle) => {
            return (
              <SubtitleBox
                key={subtitle.index - 1}
                index={subtitle.index - 1}
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
                }}
              />
            );
          })}
          <span className="text-2xl text-slate-600">
            {currentPage} / {Math.ceil(subtitles?.length! / subtitlesPerPage)}
          </span>
          <div className="mb-2 flex gap-3">
            <button
              className="btn-primary"
              onClick={() => {
                if (currentPage <= 1) {
                  return;
                }
                setCurrentPage(currentPage - 1);
              }}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                if (currentPage > subtitles.length / subtitlesPerPage) {
                  return;
                }
                setCurrentPage(currentPage + 1);
              }}
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
