import { Subtitle } from "@/components/subtitle/subtitle-editor";

// Helper function to convert time string to milliseconds
export const timeToMs = (time: string) => {
  const [hours, minutes, seconds] = time.split(":");
  const [secondsStr, millisecondsStr] = seconds.split(",");
  const ms = Number(secondsStr) * 1000 + Number(millisecondsStr);
  return Number(minutes) * 60000 + ms;
};

// Helper function to convert milliseconds to time string
export const msToTime = (ms: number) => {
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor(ms % 1000);
  return `00:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`;
};

// Convert srt file to json
export const srtToList = (srt: string) => {
  const lines = srt.trim().split("\n");
  const subtitles = [];
  let i = 0;
  while (i < lines.length) {
    const index = lines[i++];
    const time = lines[i++].split(" --> ");
    const text = lines[i++];
    i++; // Blank line
    const subtitle = {
      index: parseInt(index),
      startMs: timeToMs(time[0]),
      endMs: timeToMs(time[1]),
      text: text,
    };
    subtitles.push(subtitle);
  }
  return subtitles;
};

// Convert json to srt file
export const listToSrt = (subtitles: Subtitle[]) => {
  let srt = "";
  subtitles.forEach((subtitle, index) => {
    srt += `${index + 1}\n`;
    srt += `${msToTime(subtitle.startMs)} --> ${msToTime(subtitle.endMs)}\n`;
    srt += `${subtitle.text || " "}\n\n`;
  });
  return srt;
};

// Check if the subtitle's start time is valid
export function parseStartTime(
  newStartMs: number,
  subtitle: Subtitle,
  subtitles: Subtitle[]
) {
  // if the start time is greater than the end time
  if (newStartMs > subtitle.endMs) {
    return subtitle.endMs;
  }

  // if the start time is less than the previous subtitle's end time
  const previousSubtitle = subtitles[subtitle.index - 2];

  if (!previousSubtitle || previousSubtitle.endMs <= newStartMs) {
    return newStartMs;
  }

  return previousSubtitle.endMs;
}

// Check if the subtitle's end time is valid
export function parseEndTime(
  newEndMs: number,
  subtitle: Subtitle,
  subtitles: Subtitle[]
) {
  // if the end time is less than the start time
  if (newEndMs < subtitle.startMs) {
    return subtitle.startMs;
  }

  const nextSubtitle = subtitles[subtitle.index];

  if (!nextSubtitle || nextSubtitle.startMs >= newEndMs) {
    return newEndMs;
  }

  return nextSubtitle.startMs;
}

export function deleteSubtitle(
  subtitle: Subtitle,
  subtitles: Subtitle[],
  setSubtitles: (subtitles: Subtitle[]) => void
) {
  subtitles.splice(subtitle.index - 1, 1);
  subtitles.slice(subtitle.index - 1).forEach((subtitle) => {
    subtitle.index = subtitle.index - 1;
  });
  setSubtitles([...subtitles]);
}

export function createSubtitle(
  subtitle: Subtitle,
  subtitles: Subtitle[],
  setSubtitles: (subtitles: Subtitle[]) => void
) {
  const newSubtitle = {
    index: subtitle.index - 1,
    startMs: subtitles[subtitle.index - 2].endMs || subtitle.startMs - 1000,
    endMs: subtitles[subtitle.index - 1].startMs || subtitle.endMs + 1000,
    text: "",
  };
  subtitles.splice(subtitle.index - 1, 0, newSubtitle);
  subtitles.slice(subtitle.index - 1).forEach((subtitle) => {
    subtitle.index = subtitle.index + 1;
  });
  setSubtitles([...subtitles]);
}
