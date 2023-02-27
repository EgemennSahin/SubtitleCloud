export default function Spinner({
  size = "large",
}: {
  size?: "large" | "medium" | "small";
}) {
  if (size === "large") {
    return <div className="loader h-56 w-56" />;
  } else if (size === "medium") {
    return <div className="loader h-40 w-40" />;
  } else {
    return <div className="loader h-24 w-24" />;
  }
}
