export default function AnimateBlob({
  color,
  position,
}: {
  color: string;
  position: string;
}) {
  let c = "bg-teal-100";
  switch (color) {
    case "teal":
      c = "bg-teal-100";
      break;
    case "blue":
      c = "bg-blue-100";
      break;
    case "red":
      c = "bg-red-100";
      break;
    case "yellow":
      c = "bg-yellow-100";
      break;
    case "green":
      c = "bg-green-100";
      break;
    case "sky":
      c = "bg-sky-100";
      break;

    case "purple":
      c = "bg-purple-100";
      break;
    case "pink":
      c = "bg-pink-100";
      break;
    case "gray":
      c = "bg-gray-100";
      break;
    default:
      c = "bg-teal-100";
  }

  return (
    <div
      className={`animate-blob absolute ${position} h-72 w-72 rounded-full ${c} opacity-70 mix-blend-multiply blur-xl filter`}
    ></div>
  );
}
