import { Subtitle } from "./subtitle-editor";

type SubtitleBoxProps = {
  subtitle: Subtitle;
  setEditingSubtitle: (index: number) => void;
};

export default function SubtitleBox({
  subtitle,
  setEditingSubtitle,
}: SubtitleBoxProps) {
  return (
    <button
      onClick={() => setEditingSubtitle(subtitle.index - 1)}
      className="rounded-lg bg-blue-600 px-3 py-2 text-center text-white hover:bg-blue-700"
    >
      {subtitle.text}
    </button>
  );
}
