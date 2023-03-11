// Helper function to convert time string to milliseconds
export const timeToMs = (time: string) => {
  const [hours, minutes, seconds] = time.split(":");
  const [secondsStr, millisecondsStr] = seconds.split(",");
  const ms = Number(secondsStr) * 1000 + Number(millisecondsStr);
  return Number(hours) * 3600000 + Number(minutes) * 60000 + ms;
};

// Helper function to convert milliseconds to time string
export const msToTime = (ms: number) => {
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
