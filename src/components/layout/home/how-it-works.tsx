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
    <div className="bg-muted">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 px-3 py-10 md:py-20">
        {/* Image */}
        <div className=" flex justify-center items-center mx-auto my-auto relative aspect-[4/3] md:aspect-auto">
          <Image
            src={Champion}
            alt="Hero image"
            height={300}
            width={300}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col md:ml-5">
          <p className="text-2xl md:text-4xl font-bold">How it works</p>
          <div className="mt-10 relative flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-5">

            {/* Dotted Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-gray-300 z-0"></div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-start text-left md:items-center md:text-center w-full md:w-1/3"
              >
                <div className="bg-white p-3 rounded-full shadow-md mb-3">
                  {step.icon}
                </div>
                <h4 className="text-lg font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
