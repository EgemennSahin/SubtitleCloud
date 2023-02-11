import React from "react";

function MyButton() {
  const handleClick = async () => {
    const response = await fetch(
      "https://us-central1-captioning-693de.cloudfunctions.net/process-video-public"
    );

    const data = await response.json();

    console.log("Cloud function invoked: ", data);
  };

  return <button onClick={handleClick}>Invoke Cloud Function</button>;
}

export default MyButton;
