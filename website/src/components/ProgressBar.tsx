import { useEffect, useState } from "react";

function ProgressBar({ progress }: { progress: number }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setBarWidth(progress);
  }, [progress]);

  return (
    <div className="bg-gray-300 h-4 w-1/4">
      <div className="bg-blue-500 h-full" style={{ width: `${barWidth}%` }} />
    </div>
  );
}

export default ProgressBar;
