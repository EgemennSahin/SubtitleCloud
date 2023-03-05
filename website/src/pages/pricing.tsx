import PricingPlans from "@/components/pricing-plans";

export default function PricingPage({ uid }: { uid: string }) {
  return (
    <>
      <Seo
        title="Pricing"
        description="Discover our pricing plans and choose the one that fits your needs. Subscribe now and start enjoying our premium features."
      />
      <Navbar uid={uid} />
      <section>
        <div className="relative mx-auto w-full max-w-7xl items-center py-24 md:px-12 lg:px-16">
          <div className="flex w-full items-start justify-center gap-4 px-5 lg:px-0">
            <div className="w-full md:text-center lg:w-2/6 lg:text-left xl:w-1/3">
              <div className="flex flex-col p-8 lg:p-0">
                <strong className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
                  Safe payments with Stripe
                </strong>
                <span className="tracking-relaxed mb-8 text-2xl font-bold text-neutral-600 lg:text-5xl">
                  Pricing
                </span>
                <p className="mb-4 text-xl font-light text-gray-500 text-opacity-70 lg:pr-10">
                  Choose the plan that fits your needs.
                </p>
                <p className="mb-2 text-xl font-light text-gray-500 text-opacity-70 lg:pr-10">
                  Get the business plan and get personalized support.
                </p>
              </div>
            </div>
            <PricingPlans />
          </div>
        </div>
      </section>
    </>
  );
}

import { GetServerSidePropsContext } from "next";
import { getToken } from "@/helpers/user";
import { handleError } from "@/helpers/error";
import Seo from "@/components/seo";
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
