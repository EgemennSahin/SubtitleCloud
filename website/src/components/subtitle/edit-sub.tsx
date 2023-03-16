import { timeToMs, msToTime } from "@/helpers/subtitle";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
  MinusCircleIcon,
  PlayCircleIcon,
  PlayIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

type EditSubtitleProps = {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
  checkStartTime: (
    startTime: string,
    endTime: string,
    index: number
  ) => boolean;
  checkEndTime: (startTime: string, endTime: string, index: number) => boolean;
  onSubtitleChange: (
    index: number,
    startTime: string,
    endTime: string,
    text: string
  ) => void;
  onDelete: (index: number) => void;
  onCreate: (index: number) => void;
};

export default function EditSubtitle({
  index,
  startTime,
  endTime,
  text,
  checkStartTime,
  checkEndTime,
  onSubtitleChange,
  onDelete,
  onCreate
}: EditSubtitleProps) {
  const [updatedStart, setUpdatedStart] = useState(startTime);
  const [updatedEnd, setUpdatedEnd] = useState(endTime);
  const [updatedText, setUpdatedText] = useState(text);

  const handleUpdateTime = (type: "start" | "end", time: string) => {
    if (type === "start") {
      if (checkStartTime(time, updatedEnd, index)) {
        setUpdatedStart(time);
        onSubtitleChange(index, time, updatedEnd, text);
      }
    } else {
      if (checkEndTime(updatedStart, time, index)) {
        setUpdatedEnd(time);
        onSubtitleChange(index, updatedStart, time, text);
      }
    }
  };

  // Increase or decrease the start time by 0.1 seconds
  const adjustStartTime = (direction: boolean, increment: number) => {
    const ms = timeToMs(updatedStart);
    const newMs = direction ? ms + increment : ms - increment;
    if (newMs < 0) return;
    handleUpdateTime("start", msToTime(newMs));
  };

  // Increase or decrease the end time by 0.1 seconds
  const adjustEndTime = (direction: boolean, increment: number) => {
    const ms = timeToMs(updatedEnd);
    const newMs = direction ? ms + increment : ms - increment;
    if (newMs < 0) return;
    handleUpdateTime("end", msToTime(newMs));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setUpdatedText(newText);
    onSubtitleChange(index, updatedStart, updatedEnd, newText);
  };

  // Only show the seconds and milliseconds
  const start = updatedStart.split(":").slice(2);
  const end = updatedEnd.split(":").slice(2);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="mb-2 flex gap-8">
        <button onClick={() => onCreate(index)}>
          <PlusCircleIcon className="h-16 w-16 text-green-600 hover:text-green-700 lg:h-8 lg:w-8" />
        </button>
        <button onClick={() => onDelete(index)}>
          <TrashIcon className="h-16 w-16 text-red-600 hover:text-red-700 lg:h-8 lg:w-8" />
        </button>
      </div>

      <div className="flex">
        <div className="flex flex-col-reverse items-center justify-center gap-2 lg:flex-row lg:gap-0">
          <button onClick={() => adjustStartTime(false, 50)}>
            <ArrowDownCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
          <input
            className="w-16 text-center"
            type="text"
            pattern="\d{2},\d{3}"
            value={start}
            onChange={(e) => {
              // Format it to HH:MM:SS,MMM
              const [seconds, milliseconds] = e.target.value.split(",");
              const newTime = `00:00:${seconds},${milliseconds}`;

              handleUpdateTime("start", newTime);
            }}
          />
          <button onClick={() => adjustStartTime(true, 50)}>
            <ArrowUpCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
        </div>

        <input
          className="whitespace-normal text-center text-xl lg:text-lg"
          type="text"
          placeholder="Subtitle text"
          value={updatedText}
          onChange={handleTextChange}
        />
        <div className="flex flex-col-reverse items-center justify-center gap-2 lg:flex-row lg:gap-0">
          <button onClick={() => adjustEndTime(false, 50)}>
            <ArrowDownCircleIcon className="h-12 w-12 text-blue-600 lg:h-6 lg:w-6" />
          </button>
          <input
            className="w-16 text-center"
            type="text"
            pattern="\d{2},\d{3}"
            value={end}
            onChange={(e) => {
              // Format it to HH:MM:SS,MMM
              const [seconds, milliseconds] = e.target.value.split(",");
              const newTime = `00:00:${seconds},${milliseconds}`;

              handleUpdateTime("end", newTime);
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
