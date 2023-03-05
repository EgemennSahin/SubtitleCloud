import Hero from "@/components/hero";

export default function NewPage({ uid }: { uid: string }) {
  return (
    <>
      <Navbar uid={uid} />

      <Hero />
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Navbar from "@/components/nav-bar";

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
