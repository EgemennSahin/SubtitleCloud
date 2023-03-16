import {
  checkEndTime,
  checkStartTime,
  listToSrt,
  srtToList,
} from "@/helpers/subtitle";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import EditSubtitle from "./edit-subtitle";
import SubtitleBox from "./subtitle-box";

export type Subtitle = {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
};

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

  useEffect(() => {
    setSubtitles(srtToList(srt));
  }, []);

  useEffect(() => {
    setSrt(listToSrt(subtitles));
  }, [subtitles]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const subtitlesPerPage = 10;

  // Get the start and end index of the current page
  const startIndex = Math.max((currentPage - 1) * subtitlesPerPage, 0);
  const endIndex = Math.min(currentPage * subtitlesPerPage, subtitles?.length!);

  // Switch page if the time is greater than the end time of the last subtitle on the page
  useEffect(() => {
    const lastSubtitle = subtitles[subtitlesPerPage * currentPage - 1];

    if (!lastSubtitle) {
      return;
    }

    if (time > lastSubtitle.endMs) {
      setCurrentPage(currentPage + 1);
    }
  }, [time]);

  // Editing mode
  const [editingSubtitle, setEditingSubtitle] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <span className="text-2xl text-slate-600">
          {currentPage} / {Math.ceil(subtitles?.length! / subtitlesPerPage)}
        </span>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (currentPage <= 1) {
                return;
              }
              setCurrentPage(currentPage - 1);
            }}
          >
            <ArrowLeftIcon className="h-8 w-8 hover:text-blue-600" />
          </button>
          <button
            onClick={() => {
              if (currentPage > subtitles.length / subtitlesPerPage) {
                return;
              }
              setCurrentPage(currentPage + 1);
            }}
          >
            <ArrowRightIcon className="h-8 w-8 hover:text-blue-600" />
          </button>
        </div>

        <div className="w-screen overflow-x-auto pb-4 lg:w-full">
          <div className="flex gap-2 ">
            {subtitles.slice(startIndex, endIndex).map((subtitle, index) => {
              return (
                <SubtitleBox
                  key={`${subtitle.index}-${subtitle.text}`}
                  subtitle={subtitle}
                  setEditingSubtitle={setEditingSubtitle}
                />
              );
            })}
          </div>
        </div>

        {editingSubtitle != null && (
          <EditSubtitle
            key={subtitles[editingSubtitle].index}
            subtitle={subtitles[editingSubtitle]}
            subtitles={subtitles}
            setSubtitles={setSubtitles}
          />
        )}
      </div>
    </>
  );
}
