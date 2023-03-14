import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
import React from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { DashboardPage } from "@/components/navigation/dashboard-page";
import NavigationButton from "@/components/navigation/navigation-button";

export default function Settings() {
  const buttons = [
    {
      link: "/profile",
      Icon: UserIcon,
      text: "Profile & Preferences",
    },
  ];

  return (
    <>
      <Seo
        title="Dashboard"
        description="Access your generated videos on our short video subtitling solution. Generate subtitles for your videos in a few minutes."
      />

      <DashboardPage title="Your dashboard">
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

    return {
      props: {
        uid: token.uid,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}
