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

    // Check if file is less than 3 minutes
    if (folder === "main" || folder === "secondary") {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      const duration = await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video.duration);
        };
      });
      console.log("Duration: ", duration);

      if ((duration as number) > 180) {
        console.log("Video is too long");
        return null;
      }
    }

    // Get the signed url from the server
    const response = await fetch("/api/upload-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, title, folder }),
    });

    const { url, file_id } = await response.json();

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": type,
        "x-goog-content-length-range": `0,${100 * 1024 * 1024}`,
        "x-goog-meta-title": title,
      },

      body: file,
    });

    return file_id;
  } catch (error: any) {
    console.log("Error uploading video: ", error.message);

    return null;
  }
}
