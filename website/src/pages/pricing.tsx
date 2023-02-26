// Create a default react page
import Head from "next/head";
import PricingPlans from "@/components/pricing-plans";

export default function Pricing() {
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
