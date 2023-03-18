import Hero from "@/components/content/hero";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Navbar from "@/components/navigation/nav-bar";
import Seo from "@/components/seo";
import ContentRows from "@/components/content/content-rows";
import ContentGrids from "../components/content/content-grids";
import ContentLarge from "@/components/content/content-large";
import Footer from "@/components/navigation/footer";
import {
  ChatBubbleBottomCenterTextIcon,
  FaceSmileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

export default function NewPage({ uid }: { uid: string }) {
  const heroBody = (
    <>
      Shortzoo gives you access to premium AI models that
      <span className="font-bold text-teal-500"> caption </span> your videos.
      You can also add{" "}
      <span className="font-bold text-teal-500"> secondary content </span>
      to increase viewer engagement.
    </>
  );

  const rowBody = [
    {
      title: "Captions made easy",
      paragraph:
        "Adding captions to videos can be time-consuming and frustrating. But with Shortzoo, you don't have to worry about that. Our platform provides accurate captions quickly, so you can spend more time creating great videos.",
    },
    {
      title: "Engage your audience",
      paragraph:
        "When you add secondary content to your videos, you can make your videos more interactive and engaging. With Shortzoo, it's easy to add gameplay to your videos and increase viewer engagement.",
    },
    {
      title: "Built by video creators, for video creators",
      paragraph:
        "We know how frustrating it can be to caption our videos and add secondary content. That's why we built our platform to save time and effort with easy to use tools. Try Shortzoo today and join the community of happy video creators.",
    },
  ];

  const gridBody = [
    {
      title: "Free forever",
      icon: <FaceSmileIcon className="h-8 w-8" />,
      body: "With Shortzoo, you can create up to 15 videos for free every month. Plus, our platform will always be free!",
    },
    {
      title: "Secure storage",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      body: "At Shortzoo, we take the security and privacy of your data very seriously. We use secure servers to ensure that your information is always protected.",
    },
    {
      title: "Word level captions",
      icon: <ChatBubbleBottomCenterTextIcon className="h-8 w-8" />,
      body: "Shortzoo uses premium AI models to provide accurate and automated captions for your videos to provide captions of the highest quality.",
    },
  ];

  return (
    <>
      <Seo
        title="Home"
        description="Home page for Shortzoo, your hands off video-editing and subtitling solution."
      />

      <Navbar uid={uid} />

      <Hero
        title="Platform for short video creators"
        header="Enhance your videos"
        body={heroBody}
        image="/images/illustration.png"
      />

      <ContentRows
        title="Boost Your Video's Reach with Shortzoo's AI-powered Captions"
        header="Elevate Your Video Content"
        main={rowBody}
      />

      <ContentGrids grids={gridBody} />

      <ContentLarge
        title="Start a new way of creation with Shortzoo. Unleash your creativity."
        body="Create videos that captivate"
        link="/dashboard"
        linkText="Get started for free with Shortzoo"
      />

      <Footer />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });

    return {
      props: {
        uid: token?.uid || null,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
