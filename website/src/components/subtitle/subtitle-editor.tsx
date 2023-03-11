import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import SubtitleBox from "./subtitle-box";

interface Subtitle {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
}

export default function SubtitleEditor({
  srt,
  setSrt,
  time,
}: {
  srt: string;
  setSrt: any;
  time: number;
}) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const subtitlesPerPage = 15;

  // Switch page if the time is greater than the end time of the last subtitle on the page
  useEffect(() => {
    const lastSubtitle = subtitles[subtitlesPerPage * currentPage - 1];

    if (!lastSubtitle) {
      return;
    }

    const [lastEndSeconds, lastEndMilliseconds] = lastSubtitle.endTime
      .replaceAll(":", "")
      .split(",");

    console.log(lastEndSeconds, lastEndMilliseconds);
    const lastEndSecondsInt = parseInt(lastEndSeconds);
    const lastEndMillisecondsInt = parseInt(lastEndMilliseconds);

    console.log(lastEndSecondsInt, lastEndMillisecondsInt);

    if (time > lastEndSecondsInt * 1000 + lastEndMillisecondsInt) {
      setCurrentPage(currentPage + 1);
    }
  }, [time]);

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

  function checkStartTime(startTime: string, endTime: string, index: number) {
    const [startSeconds, startMilliseconds] = startTime
      .replaceAll(":", "")
      .split(",");
    const [endSeconds, endMilliseconds] = endTime
      .replaceAll(":", "")
      .split(",");

    const startSecondsInt = parseInt(startSeconds);
    const startMillisecondsInt = parseInt(startMilliseconds);
    const endSecondsInt = parseInt(endSeconds);
    const endMillisecondsInt = parseInt(endMilliseconds);

    // if the start time is greater than the end time
    if (
      startSecondsInt > endSecondsInt ||
      (startSecondsInt === endSecondsInt &&
        startMillisecondsInt > endMillisecondsInt)
    ) {
      return false;
    }

    // if the start time is less than the previous subtitle's end time
    const previousSubtitle = subtitles[index - 1];

    if (!previousSubtitle) {
      return true;
    }

    const [previousEndSeconds, previousEndMilliseconds] =
      previousSubtitle.endTime.replaceAll(":", "").split(",");

    const previousEndSecondsInt = parseInt(previousEndSeconds);
    const previousEndMillisecondsInt = parseInt(previousEndMilliseconds);

    if (
      startSecondsInt < previousEndSecondsInt ||
      (startSecondsInt === previousEndSecondsInt &&
        startMillisecondsInt < previousEndMillisecondsInt)
    ) {
      return false;
    }

    return true;
  }

  function checkEndTime(startTime: string, endTime: string, index: number) {
    const [endSeconds, endMilliseconds] = endTime
      .replaceAll(":", "")
      .split(",");
    const endSecondsInt = parseInt(endSeconds);
    const endMillisecondsInt = parseInt(endMilliseconds);

    const [startSeconds, startMilliseconds] = startTime
      .replaceAll(":", "")
      .split(",");
    const startSecondsInt = parseInt(startSeconds);
    const startMillisecondsInt = parseInt(startMilliseconds);

    // if the end time is less than the start time
    if (
      endSecondsInt < startSecondsInt ||
      (endSecondsInt === startSecondsInt &&
        endMillisecondsInt < startMillisecondsInt)
    ) {
      return false;
    }

    const nextSubtitle = subtitles[index + 1];

    if (!nextSubtitle) {
      return true;
    }

    const [nextStartSeconds, nextStartMilliseconds] = nextSubtitle.startTime
      .replaceAll(":", "")
      .split(",");
    const nextStartSecondsInt = parseInt(nextStartSeconds);
    const nextStartMillisecondsInt = parseInt(nextStartMilliseconds);

    if (
      endSecondsInt > nextStartSecondsInt ||
      (endSecondsInt === nextStartSecondsInt &&
        endMillisecondsInt > nextStartMillisecondsInt)
    ) {
      return false;
    }

    return true;
  }

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

    setSrt(newSrtContent);
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
                checkStartTime={checkStartTime}
                checkEndTime={checkEndTime}
                onSubtitleChange={(
                  index,
                  updatedStart,
                  updatedEnd,
                  newText
                ) => {
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
