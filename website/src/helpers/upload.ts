export default function uploadFunctions(setFile: (file: File) => void) {
  const checkFile = (file: File) => {
    if (!file) {
      return false;
    }

    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      return false;
    }

    if (file.size > 100 * 1024 * 1024) {
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (window.innerWidth < 768) {
      // Close the hamburger menu on mobile
      const menu = document.querySelector(".navbar-collapse");

      if (menu) {
        menu.classList.add("hidden");
      }
    }
    const file = e.dataTransfer.files[0];
    if (!checkFile(file)) {
      return;
    }
    setFile(file);
  };

  const handleChooseFile = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = false;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files![0];
      if (!checkFile(file)) {
        return;
      }
      // handle dropped files
      setFile(file);
    };
    input.click();
  };

  return {
    handleDrop,
    handleChooseFile,
  };
}
