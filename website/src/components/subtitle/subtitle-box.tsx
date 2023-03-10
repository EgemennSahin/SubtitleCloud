import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type SubtitleBoxProps = {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
  onSubtitleChange: (
    index: number,
    startTime: string,
    endTime: string,
    text: string
  ) => void;
};

export default function SubtitleBox({
  index,
  startTime,
  endTime,
  text,
  onSubtitleChange,
}: SubtitleBoxProps) {
  const [updatedStart, setUpdatedStart] = useState(startTime);
  const [updatedEnd, setUpdatedEnd] = useState(endTime);
  const [updatedText, setUpdatedText] = useState(text);

  // Helper function to convert time string to milliseconds
  const timeToMs = (time: string) => {
    const [hours, minutes, seconds] = time.split(":");
    const [secondsStr, millisecondsStr] = seconds.split(",");
    const ms = Number(secondsStr) * 1000 + Number(millisecondsStr);
    return Number(hours) * 3600000 + Number(minutes) * 60000 + ms;
  };

  // Helper function to convert milliseconds to time string
  const msToTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds
      .toString()
      .padStart(3, "0")}`;
  };

  // Increase or decrease the start time by 0.1 seconds
  const adjustStartTime = (increment: boolean) => {
    const ms = timeToMs(updatedStart);
    const newMs = increment ? ms + 100 : ms - 100;
    if (newMs < 0) return;
    setUpdatedStart(msToTime(newMs));
    onSubtitleChange(index, msToTime(newMs), endTime, text);
  };

  const setStartTime = (time: string) => {
    setUpdatedStart(time);
    onSubtitleChange(index, time, endTime, text);
  };

  const setEndTime = (time: string) => {
    setUpdatedEnd(time);
    onSubtitleChange(index, startTime, time, text);
  };

  // Increase or decrease the end time by 0.1 seconds
  const adjustEndTime = (increment: boolean) => {
    const ms = timeToMs(updatedEnd);
    const newMs = increment ? ms + 100 : ms - 100;
    if (newMs < 0) return;
    setUpdatedEnd(msToTime(newMs));
    onSubtitleChange(index, updatedStart, msToTime(newMs), text);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setUpdatedText(newText);
    onSubtitleChange(index, updatedStart, updatedEnd, newText);
  };

  // Only show the seconds and milliseconds
  const start = startTime.split(":").slice(2);
  const end = endTime.split(":").slice(2);

  return (
    <div className="grid grid-cols-12 gap-2">
      <span className="place-self-center text-sm text-slate-500">
        {index + 1}
      </span>
      <button className="place-self-end" onClick={() => adjustStartTime(false)}>
        <MinusCircleIcon className="h-6 w-6 text-blue-600" />
      </button>
      <input
        className="col-span-2 text-center"
        type="text"
        pattern="\d{2},\d{3}"
        value={start}
        onChange={(e) => {
          // Format it to HH:MM:SS,MMM
          const [seconds, milliseconds] = e.target.value.split(",");
          const newTime = `00:00:${seconds},${milliseconds}`;

          setStartTime(newTime);
        }}
      />
      <button
        className="place-self-start"
        onClick={() => adjustStartTime(true)}
      >
        <PlusCircleIcon className="h-6 w-6 text-blue-600" />
      </button>
      <input
        className="col-span-2 text-center"
        type="text"
        value={updatedText}
        onChange={handleTextChange}
      />

      <button className="place-self-end" onClick={() => adjustEndTime(false)}>
        <MinusCircleIcon className="h-6 w-6 text-blue-600" />
      </button>
      <input
        className="col-span-2 text-center"
        type="text"
        pattern="\d{2},\d{3}"
        value={end}
        onChange={(e) => {
          // Format it to HH:MM:SS,MMM
          const [seconds, milliseconds] = e.target.value.split(",");
          const newTime = `00:00:${seconds},${milliseconds}`;

          setEndTime(newTime);
        }}
      />
      <button className="place-self-start" onClick={() => adjustEndTime(true)}>
        <PlusCircleIcon className="h-6 w-6 text-blue-600" />
      </button>
    </div>
  );
}
