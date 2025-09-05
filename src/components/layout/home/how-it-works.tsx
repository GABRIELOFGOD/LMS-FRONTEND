'use client';

import Champion from "@/assets/chapion.png";
import Image from "next/image";
import { BookA, CheckCircle, ListCheck } from "lucide-react";

const steps = [
  {
    title: "Sign Up",
    description: "Create your account in just a few steps.",
    icon: <CheckCircle className="text-primary w-6 h-6" />,
  },
  {
    title: "Choose a Course",
    description: "Pick a plan that suits your needs.",
    icon: <BookA className="text-primary w-6 h-6" />,
  },
  {
    title: "Get Certified",
    description: "Access all features and grow faster.",
    icon: <ListCheck className="text-primary w-6 h-6" />,
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-muted/40">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-5 px-3 py-10 md:py-20">
        {/* Image */}
        <div className="flex justify-center items-center mx-auto my-auto relative aspect-square md:aspect-auto order-2 md:order-1">
          <Image
            src={Champion}
            alt="Hero image"
            height={250}
            width={250}
            className="md:h-[300px] md:w-[300px]"
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col md:ml-5 order-1 md:order-2">
          <p className="text-xl md:text-2xl lg:text-4xl font-bold text-center md:text-left">How it works</p>
          <div className="mt-6 md:mt-10 relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-5">

            {/* Dotted Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-gray-300 z-0"></div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3"
              >
                <div className="bg-white p-3 rounded-full shadow-md mb-3 flex items-center justify-center">
                  {step.icon}
                </div>
                <h4 className="text-base md:text-lg font-semibold">{step.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
