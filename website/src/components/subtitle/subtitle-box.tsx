import { Subtitle } from "./subtitle-editor";

type SubtitleBoxProps = {
  subtitle: Subtitle;
  editingSubtitle: number | null;
  setEditingSubtitle: (index: number | null) => void;
};

export default function SubtitleBox({
  subtitle,
  editingSubtitle,
  setEditingSubtitle,
}: SubtitleBoxProps) {
  function handleClick() {
    if (editingSubtitle == subtitle.index - 1) {
      setEditingSubtitle(null);
    } else {
      setEditingSubtitle(subtitle.index - 1);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`rounded-lg p-2 text-center text-lg ${
        editingSubtitle == subtitle.index - 1
          ? "bg-teal-600 text-white hover:bg-teal-700"
          : "text-slate-800 hover:text-slate-500 hover:underline"
      } ${
        /^\s*$/.test(subtitle.text) &&
        "w-2 animate-pulse border-2 border-red-500"
      }`}
    >
      {subtitle.text}
    </button>
  );
}
