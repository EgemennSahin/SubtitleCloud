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

export async function handleUpload(
  file: Blob | null,
  folder: "main" | "secondary" | "audio"
) {
  if (!file) {
    console.log("No file selected");
    return;
  }

  try {
    const type = file.type;
    const title = file.name;
    // Get the signed url from the server
    const response = await fetch("/api/upload-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, title, folder }),
    });

    const { url, file_id } = await response.json();

    // Upload to the signed url
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Length": file.size.toString(),
      },
      body: file,
    });

    return file_id;
  } catch (error: any) {
    console.log("Error uploading video: ", error.message);

    return null;
  }
}
