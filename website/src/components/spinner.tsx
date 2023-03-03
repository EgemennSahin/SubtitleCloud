export default function Spinner({
  size = "large",
}: {
  size?: "large" | "medium" | "small";
}) {
  let hw = "";
  switch (size) {
    case "small":
      hw = "h-24 w-24";
      break;
    case "medium":
      hw = "h-40 w-40";
      break;
    case "large":
      hw = "h-56 w-56";
      break;
    default:
      hw = "h-56 w-56";
      break;
  }

  return <div className={`loader ${hw}`} />;
}
