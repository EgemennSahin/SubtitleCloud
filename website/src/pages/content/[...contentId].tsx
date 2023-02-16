// Pass in a URL to this page as a prop, which will be the video rendered
import { useRouter } from "next/router";

const VideoPage = () => {
  const router = useRouter();

  // Get the video ID from the URL
  const { contentId } = router.query;

  return <p>VideoPage: {contentId}</p>;
};

export default VideoPage;
