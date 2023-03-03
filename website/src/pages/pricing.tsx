import PricingPlans from "@/components/pricing-plans";

export default function PricingPage() {
  return (
    <>
      <Seo
        title="Pricing"
        description="Discover our pricing plans and choose the one that fits your needs. Subscribe now and start enjoying our premium features."
      />
      <div className="flex grow flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-5 sm:py-9">
        <h1 className="text-style-title"> Pricing</h1>
        <h2 className="text-style-subtitle">
          Our plans are designed to fit your needs and budget.
        </h2>

        <h3 className="text-style-subheader">
          Save <span className="text-teal-500">25%</span> by paying annually.{" "}
        </h3>

        <div className="flex flex-col items-center">
          <PricingPlans />
        </div>
      </div>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken, getUser } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";

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
