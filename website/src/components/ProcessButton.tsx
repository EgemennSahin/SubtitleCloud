import React from "react";

function MyButton() {
  const handleClick = async () => {
    console.log("Uploading video to Cloud Storage");

    // Upload video to Cloud Storage

    console.log("Invoking Cloud Function with video URL");

    const response = await fetch(
      "https://us-central1-captioning-693de.cloudfunctions.net/hello",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "TODO: Add Cloud Storage URL here",
        }),
      }
    );

    const data = await response.json();

    console.log("Cloud function invoked: ", data);
  };

  return <button onClick={handleClick}>Invoke Cloud Function</button>;
}

export default MyButton;
