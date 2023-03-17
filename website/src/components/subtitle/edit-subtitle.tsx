import {
  timeToMs,
  msToTime,
  checkStartTime,
  checkEndTime,
  deleteSubtitle,
  createSubtitle,
} from "@/helpers/subtitle";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Subtitle } from "./subtitle-editor";

type EditSubtitleProps = {
  subtitle: Subtitle;
  subtitles: Subtitle[];
  setSubtitles: (subtitles: Subtitle[]) => void;
};

export default function EditSubtitle({
  subtitle,
  subtitles,
  setSubtitles,
}: EditSubtitleProps) {
  const [updatedStart, setUpdatedStart] = useState(subtitle.startMs);
  const [updatedEnd, setUpdatedEnd] = useState(subtitle.endMs);
  const [updatedText, setUpdatedText] = useState(subtitle.text);

  function handleUpdateSubtitle() {
    const newSubtitle: Subtitle = {
      index: subtitle.index,
      startMs: updatedStart,
      endMs: updatedEnd,
      text: updatedText,
    };
    // Change subtitles[subtitle.index - 1] to newSubtitle
    const newSubtitles = subtitles.map((sub) => {
      if (sub.index === newSubtitle.index) {
        return newSubtitle;
      }
      return sub;
    });
    setSubtitles(newSubtitles);
  }

  useEffect(() => {
    handleUpdateSubtitle();
  }, [updatedStart, updatedEnd, updatedText]);

  function handleUpdateStartTime(newMs: number) {
    if (!checkStartTime(newMs, subtitle, subtitles)) {
      return;
    }
    setUpdatedStart(newMs);
  }

  function handleUpdateEndTime(newMs: number) {
    if (!checkEndTime(newMs, subtitle, subtitles)) {
      return;
    }
    setUpdatedEnd(newMs);
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value.toUpperCase();
    setUpdatedText(newText);
  };

  // Increase or decrease the start time by 0.1 seconds
  const adjustStartTime = (direction: boolean, increment: number) => {
    const newMs = direction
      ? updatedStart + increment
      : updatedStart - increment;
    if (newMs < 0) return;
    handleUpdateStartTime(newMs);
  };

  // Increase or decrease the end time by 0.1 seconds
  const adjustEndTime = (direction: boolean, increment: number) => {
    const newMs = direction ? updatedEnd + increment : updatedEnd - increment;
    if (newMs < 0) return;
    handleUpdateEndTime(newMs);
  };

  // Only show the seconds and milliseconds
  const start = msToTime(updatedStart).split(":").slice(2);
  const end = msToTime(updatedEnd).split(":").slice(2);

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-200 p-4">
      <div className="mb-2 flex gap-8">
        <button
          className="flex flex-col items-center gap-2"
          onClick={() => createSubtitle(subtitle, subtitles, setSubtitles)}
        >
          <p className="font-bold text-slate-700">Add</p>

          <PlusCircleIcon className="h-14 w-14 text-green-600 hover:text-green-700 lg:h-10 lg:w-10" />
        </button>
        <button
          className="flex flex-col items-center gap-2"
          onClick={() => deleteSubtitle(subtitle, subtitles, setSubtitles)}
        >
          <p className="font-bold text-slate-700">Delete</p>
          <TrashIcon className="h-14 w-14 text-red-600 hover:text-red-700 lg:h-10 lg:w-10" />
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col-reverse items-center justify-center gap-2 lg:flex-row">
          <button onClick={() => adjustStartTime(false, 50)}>
            <ArrowDownCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
          <input
            className="w-16 bg-transparent text-center"
            type="text"
            pattern="\d{2},\d{3}"
            value={start}
            onChange={(e) => {
              // Format it to HH:MM:SS,MMM
              const [seconds, milliseconds] = e.target.value.split(",");
              const newTime = `00:00:${seconds},${milliseconds}`;
              handleUpdateStartTime(timeToMs(newTime));
            }}
          />
          <button onClick={() => adjustStartTime(true, 50)}>
            <ArrowUpCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
        </div>

        <input
          className="w-48 rounded-lg bg-transparent text-center text-xl lg:text-lg"
          type="text"
          placeholder="Subtitle text"
          value={updatedText.toUpperCase()}
          onChange={handleTextChange}
        />

        <div className="rounded-lgp-2 flex flex-col-reverse items-center justify-center gap-2 lg:flex-row">
          <button onClick={() => adjustEndTime(false, 50)}>
            <ArrowDownCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
          <input
            className="w-16 bg-transparent text-center"
            type="text"
            pattern="\d{2},\d{3}"
            value={end}
            onChange={(e) => {
              // Format it to HH:MM:SS,MMM
              const [seconds, milliseconds] = e.target.value.split(",");
              const newTime = `00:00:${seconds},${milliseconds}`;
              handleUpdateEndTime(timeToMs(newTime));
            }}
          />
          <button onClick={() => adjustEndTime(true, 50)}>
            <ArrowUpCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
