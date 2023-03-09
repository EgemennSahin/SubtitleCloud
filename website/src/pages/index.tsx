import Hero from "@/components/hero";
import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Navbar from "@/components/nav-bar";
import Seo from "@/components/seo";
import ContentRows from "@/components/content/content-rows";
import ContentGrids from "../components/content/content-grids";
import ContentLarge from "@/components/content/content-large";
import Footer from "@/components/footer";
import {
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";

export default function NewPage({ uid }: { uid: string }) {
  return (
    <>
      <Seo title="Home" description="Home page" />

      <Navbar uid={uid} />
      <Hero />
      <ContentRows
        title="Boost Your Video's Reach with Shortzoo's AI-powered Captions"
        header="Elevate Your Video Content"
        main={[
          {
            title: "Captions made easy",
            paragraph:
              "Adding captions to videos can be time-consuming and frustrating. But with Shortzoo, you don't have to worry about that. Our platform provides accurate captions quickly, so you can spend more time creating great videos.",
          },
          {
            title: "Engage your audience",
            paragraph:
              "When you add secondary content to your videos, like bottom videos, you can make your videos more interactive and engaging. With Shortzoo, it's easy to add gameplay to your videos and increase viewer engagement.",
          },
          {
            title: "Built by video creators, for video creators",
            paragraph:
              "We know how frustrating it can be to caption our videos and add secondary content. That's why we built our platform to save time and effort with easy to use tools. Try Shortzoo today and join the community of happy video creators.",
          },
        ]}
      />

      <ContentGrids
        grids={[
          {
            title: "Caption 15 videos for free every month",
            icon: <VideoCameraIcon className="h-8 w-8 text-blue-500" />,
            body: "With Shortzoo, you can create up to 15 videos for free every month. Our platform will always be free!",
          },
          {
            title: "Secure storage for your videos and data",
            icon: <ShieldCheckIcon className="h-8 w-8 text-blue-500" />,
            body: "At Shortzoo, we take the security and privacy of your videos and data very seriously. We use advanced encryption and secure servers to ensure that your information is always protected.",
          },
          {
            title: "Accurate and automated captions for each word",
            icon: (
              <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-blue-500" />
            ),
            body: "Shortzoo uses premium AI models to provide accurate and automated captions for your videos. This saves you time and effort, and ensures that your captions are always of high quality.",
          },
        ]}
      />

      <ContentLarge
        title="Start a new way of creation with Shortzoo. Unleash your creativity."
        body="Create videos that captivate"
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
