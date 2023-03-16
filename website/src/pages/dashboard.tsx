import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import React from "react";
import {
  ArrowUpTrayIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";
import { dashboardRoute } from "@/helpers/routing";
import { DashboardPage } from "@/components/navigation/dashboard-page";
import NavigationButton from "@/components/navigation/navigation-button";

export default function Dashboard({ user }: { user: any }) {
  const buttons = [
    {
      link: "/upload-video",
      Icon: ArrowUpTrayIcon,
      text: "Upload a video",
    },
    {
      link: "/videos",
      Icon: FolderIcon,
      text: "See your videos",
    },
    {
      link: "/extras",
      Icon: CircleStackIcon,
      text: "See your extras",
    },
    {
      link: "/settings",
      Icon: Cog6ToothIcon,
      text: "Account settings",
    },
  ];

  return (
    <>
      <Seo
        title="Dashboard"
        description="Access your generated videos on our short video subtitling solution. Generate subtitles for your videos in a few minutes."
      />
      <DashboardPage
        title="Your dashboard"
        subtitle={`You have ${user.video_credit || 0} credits left this month.`}
      >
        <section className="col-span-2 grid grid-cols-1 gap-8 self-start lg:grid-cols-3">
          {buttons.map((button, index) => {
            return (
              <NavigationButton
                key={index}
                link={button.link}
                Icon={button.Icon}
                text={button.text}
              />
            );
          })}
        </section>
      </DashboardPage>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getToken({ context });
    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const reroute = dashboardRoute(token);

    if (reroute) {
      return reroute;
    }

    const user = await getUser({ uid: token.uid });

    return {
      props: {
        user: user?.data() || {},
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
