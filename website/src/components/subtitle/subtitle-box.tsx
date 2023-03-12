import { timeToMs, msToTime } from "@/helpers/subtitle";
import {
  MinusCircleIcon,
  PlayIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

type SubtitleBoxProps = {
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
  setEditingSubtitle: (index: number) => void;
};

export default function SubtitleBox({
  index,
  startTime,
  endTime,
  text,
  checkStartTime,
  checkEndTime,
  onSubtitleChange,
  setEditingSubtitle,
}: SubtitleBoxProps) {
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
    <button
      onClick={() => setEditingSubtitle(index)}
      className="rounded-lg bg-blue-600 px-3 py-2 text-center text-white hover:bg-blue-700"
    >
      {text}
    </button>

    // <div className="grid grid-cols-12 gap-2">
    //   <span className="place-self-center text-sm text-slate-500">
    //     {index + 1}
    //   </span>
    //   <button
    //     className="place-self-end"
    //     onClick={() => adjustStartTime(false, 50)}
    //   >
    //     <MinusCircleIcon className="h-6 w-6 text-blue-600" />
    //   </button>
    //   <input
    //     className="col-span-2 text-center"
    //     type="text"
    //     pattern="\d{2},\d{3}"
    //     value={start}
    //     onChange={(e) => {
    //       // Format it to HH:MM:SS,MMM
    //       const [seconds, milliseconds] = e.target.value.split(",");
    //       const newTime = `00:00:${seconds},${milliseconds}`;

    //       handleUpdateTime("start", newTime);
    //     }}
    //   />
    //   <button
    //     className="place-self-start"
    //     onClick={() => adjustStartTime(true, 50)}
    //   >
    //     <PlusCircleIcon className="h-6 w-6 text-blue-600" />
    //   </button>
    //   <input
    //     className="col-span-2 text-center"
    //     type="text"
    //     value={updatedText}
    //     onChange={handleTextChange}
    //   />

    //   <button
    //     className="place-self-end"
    //     onClick={() => adjustEndTime(false, 50)}
    //   >
    //     <MinusCircleIcon className="h-6 w-6 text-blue-600" />
    //   </button>
    //   <input
    //     className="col-span-2 text-center"
    //     type="text"
    //     pattern="\d{2},\d{3}"
    //     value={end}
    //     onChange={(e) => {
    //       // Format it to HH:MM:SS,MMM
    //       const [seconds, milliseconds] = e.target.value.split(",");
    //       const newTime = `00:00:${seconds},${milliseconds}`;

    //       handleUpdateTime("end", newTime);
    //     }}
    //   />
    //   <button
    //     className="place-self-start"
    //     onClick={() => adjustEndTime(true, 50)}
    //   >
    //     <PlusCircleIcon className="h-6 w-6 text-blue-600" />
    //   </button>
    // </div>
  );
}
