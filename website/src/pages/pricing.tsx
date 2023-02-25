// Create a default react page
import Head from "next/head";
import { useState } from "react";
import PricingPlans from "@/components/pricing-plans";
import { useRouter } from "next/router";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const toggle = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <>
      <Head>
        <title>Pricing - Shortzoo</title>
        <meta
          name="description"
          content="Discover our pricing plans and choose the one that fits your needs. Subscribe now and start enjoying our premium features."
        />
      </Head>
      <div className="relative grow bg-gradient-to-b from-slate-50 to-slate-200 px-6 py-5 sm:py-9 md:px-8 lg:px-20">
        <h1 className="mb-3 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text pr-1 text-center text-6xl font-bold leading-tight tracking-tighter text-transparent ">
          Pricing
        </h1>
        <h2 className="mb-8 bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text pr-1 text-center text-3xl font-semibold tracking-tight text-transparent sm:mb-4">
          Our plans are designed to fit your needs and budget.
        </h2>

        <PricingPlans
          isAnnual={isAnnual}
          toggle={toggle}
          onClick={() => router.push("/premium")}
        />
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getIdToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = await getIdToken({ context });

    const user = await getUser({ uid: token?.uid });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error);
  }
}
