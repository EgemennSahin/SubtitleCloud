import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ToggleButton from "./toggle-button";
import TextButton from "./text-button";
import { handleCheckout } from "@/helpers/stripe";

export function PlanBox({
  title,
  price,
  features,
  selected,
  onClick,
  style,
}: {
  title: string;
  price: string;
  features: any[];
  selected: boolean;
  onClick: any;
  style?: "dark" | "light";
}) {
  let titleColor =
    "bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent";
  let priceColor = "text-slate-200";
  let textColor = "text-slate-100";
  let bgColor = "bg-slate-800";

  switch (style) {
    case "dark":
      titleColor =
        "bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent";
      priceColor = "text-slate-300";
      textColor = "text-slate-200";
      bgColor = "bg-gradient-to-b from-slate-700 to-slate-900";
      break;
    case "light":
      titleColor =
        "bg-gradient-to-r from-slate-500 to-slate-900 bg-clip-text text-transparent";
      priceColor = "text-slate-500";
      textColor = "text-slate-700";
      bgColor = "bg-gradient-to-b from-slate-50 to-slate-200";
      break;
    default:
      titleColor =
        "bg-gradient-to-r from-slate-500 to-slate-900 bg-clip-text text-transparent";
      priceColor = "text-slate-500";
      textColor = "text-slate-700";
      bgColor = "bg-gradient-to-b from-slate-50 to-slate-200";
  }

  return (
    <div
      onClick={() => onClick()}
      className={
        "flex cursor-pointer rounded-xl bg-gradient-to-br from-slate-300 via-slate-400 to-blue-400 p-1 drop-shadow-xl duration-200 hover:opacity-100 " +
        (selected ? "opacity-100 shadow-lg" : "opacity-80 shadow")
      }
    >
      <div
        className={
          "relative flex flex-col rounded-lg px-12 pt-4 pb-8 text-center " +
          bgColor
        }
      >
        {selected && (
          <div className="absolute top-2 left-2 drop-shadow-lg">
            <CheckCircleIcon className="h-16 w-16 text-teal-500 " />
          </div>
        )}
        <h2
          className={
            "text-3xl font-semibold tracking-tight text-transparent " +
            titleColor
          }
        >
          {title}
        </h2>

        <h3 className={"mt-3 text-xl font-bold " + priceColor}>{price}</h3>
        <div
          className={
            "mt-5 space-y-3 text-start text-2xl font-medium md:text-lg " +
            textColor
          }
        >
          {features}
        </div>
      </div>
    </div>
  );
}

export default function PricingPlans({ uid }: { uid?: string }) {
  const router = useRouter();
  const [isMonthly, setIsMonthly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("premium");

  return (
    <div className="flex flex-col">
      <ToggleButton
        state={isMonthly}
        setState={setIsMonthly}
        textTrue={"Monthly"}
        textFalse={"Annual"}
      />

      <div className="mt-3 flex flex-col justify-between gap-8 sm:flex-row">
        <PlanBox
          title="Premium"
          price={isMonthly ? "26.99/year" : "2.99/month"}
          features={[
            <p key="videos">20 Videos per month</p>,
            <p key="duration">Video duration up to 3 minutes</p>,
            <div
              key="publishing"
              className="flex flex-nowrap items-center gap-2"
            >
              <p className="whitespace-nowrap">Automatically publish to</p>
              {["youtube", "instagram", "tiktok"].map((platform) => (
                <div key="logo" className="w-6 drop-shadow">
                  <Image
                    src={`/logos/${platform}.svg`}
                    alt={platform}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-6 w-6"
                  />
                </div>
              ))}
            </div>,
          ]}
          selected={selectedPlan === "premium"}
          onClick={() => setSelectedPlan("premium")}
          style="light"
        />

        <PlanBox
          title="Business"
          price="Custom Plan"
          features={[
            <p key="videos">Unlimited videos</p>,
            <p key="duration">Unlimited video duration</p>,
            <div
              key="publishing"
              className="flex flex-nowrap items-center gap-2"
            >
              <p className="whitespace-nowrap">Automatically publish to</p>
              {["youtube", "instagram", "tiktok"].map((platform) => (
                <div key="logo" className="w-6 drop-shadow">
                  <Image
                    src={`/logos/${platform}.svg`}
                    alt={platform}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-6 w-6"
                  />
                </div>
              ))}
            </div>,
          ]}
          selected={selectedPlan === "business"}
          onClick={() => setSelectedPlan("business")}
          style="dark"
        />
      </div>
      <TextButton
        size="small"
        text={selectedPlan == "premium" ? "Checkout" : "Customize"}
        style="mt-8"
        onClick={async () => {
          if (!uid) {
            router.push("/signup");
            return;
          }

          await handleCheckout({
            uid,
            selectedPlan,
            isMonthly,
          });
        }}
      />
    </div>
  );
}
