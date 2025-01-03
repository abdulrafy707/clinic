"use client";

import { useState } from "react";
import { Mic, Cloud, Search, Shield, Clock, Stethoscope } from 'lucide-react';
import { Container } from "@/components/ui/container";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "voice-recognition",
    icon: <Mic className="w-6 h-6 text-blue-500" />,
    title: "Advanced Voice Recognition",
    description:
      "Effortlessly capture detailed veterinary notes using our state-of-the-art voice recognition technology, tailored for animal healthcare terminology.",
    image: "/1.png",
  },
  {
    id: "ai-powered",
    icon: <Cloud className="w-6 h-6 text-blue-500" />,
    title: "AI-Powered SOAP Generation",
    description:
      "Our advanced AI instantly transforms your voice notes into comprehensive, structured SOAP reports, saving you valuable time in your veterinary practice.",
    image: "/2.png",
  },
  {
    id: "smart-templates",
    icon: <Search className="w-6 h-6 text-blue-500" />,
    title: "Smart Templates & Quick Search",
    description:
      "Access a wide range of veterinary-specific templates and quickly retrieve patient information with our intelligent search functionality.",
    image: "/3.png",
  },
];

const smallFeatures = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "HIPAA Compliant Security",
    description:
      "Rest easy knowing your veterinary records are protected with industry-leading, HIPAA-compliant encryption and security measures.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Time-Saving Efficiency",
    description:
      "Dramatically reduce documentation time, allowing you to focus more on patient care and less on paperwork.",
  },
  {
    icon: <Stethoscope className="w-5 h-5" />,
    title: "Veterinary-Specific Design",
    description:
      "Tailored specifically for veterinary practices, ensuring accurate and relevant documentation for animal healthcare.",
  },
];

const alternatingFeatures = [
  {
    title: "Intuitive Veterinary Interface",
    description: "Tailor Scriba's interface to your veterinary workflow, ensuring a seamless and efficient note-taking experience for all animal patients.",
    items: [
      "Species-specific templates",
      "Customizable SOAP sections",
      "Integration with practice management software",
      "Personalized quick-entry fields"
    ],
    image: "/dashboard-screenshot.png",
    imagePosition: "left"
  },
  {
    title: "Collaborative Veterinary Care",
    description: "Enhance team communication and patient care with real-time collaboration features designed for busy veterinary practices.",
    items: [
      "Simultaneous chart access",
      "Instant updates across devices",
      "Integrated task assignment",
      "Role-based access control"
    ],
    image: "/dashboard-screenshot.png",
    imagePosition: "right"
  }
];


export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-500 mb-4">
            Features
          </span>
          <h2 className="font-plus text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Revolutionize Your Veterinary Practice
          </h2>
          <p className="text-xl text-gray-600">
            Scriba's AI-powered SOAP note generator streamlines your veterinary documentation,
            allowing you to provide better care for your animal patients.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 flex-none flex-nowrap h-min w-full overflow-hidden px-0 py-6 relative">
          <div className="flex flex-col items-center justify-center gap-3 flex-none flex-nowrap h-min w-full overflow-hidden p-0 relative">
            <div className="flex-none h-auto w-full relative">
              <div
                className="flex flex-row items-center justify-center flex-nowrap gap-0 h-min w-full overflow-hidden p-0 relative will-change-transform  bg-[rgb(245,245,245)] rounded-[26px] opacity-100 border border-solid border-[rgb(229,229,229)]"
                style={{
                  "--border-bottom-width": "1px",
                  "--border-color": "rgb(229, 229, 229)",
                  "--border-left-width": "1px",
                  "--border-right-width": "1px",
                  "--border-style": "solid",
                  "--border-top-width": "1px",
                }}
              >
                {/* Left Column - Features */}
                <div className="flex flex-col flex-[1_0_0px] items-center justify-center gap-0 h-min w-px overflow-visible p-0 relative opacity-100">
                  {/* Main Features */}
                  {features.map((feature) => (
                    <FeatureBox
                      key={feature.id}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      isActive={activeFeature === feature.id}
                      onClick={() => setActiveFeature(feature.id)}
                    />
                  ))}
                </div>
                <div className="self-stretch flex-none h-auto w-px relative">
                  <div className="bg-[rgb(229,229,229)] h-full w-full opacity-100 overflow-hidden relative"></div>
                </div>
                {/* Right Column - Dashboard Preview */}
                <div className="flex flex-row flex-[1_0_0px] items-start self-stretch justify-start gap-12 h-auto w-px overflow-visible p-0 relative rounded-[20px] opacity-100">
                  <div className="flex flex-row flex-[1_0_0px] items-center justify-center gap-2.5 h-[366px] w-px overflow-visible p-1.5 relative opacity-100">
                    <div className="flex flex-row flex-[1_0_0px] items-start justify-start gap-2.5 h-full w-px overflow-hidden p-12 relative z-10 opacity-100 bg-white rounded-[20px] shadow-[0px_1px_3px_rgba(99,99,99,0.07),0px_5px_5px_rgba(99,99,99,0.06),0px_12px_7px_rgba(99,99,99,0.03),0px_21px_8px_rgba(99,99,99,0.01),0px_33px_9px_rgba(99,99,99,0)] custom-border">
                      <div className="flex-none h-[390px] w-[520px] overflow-visible relative rounded-[8px] opacity-100">
                        {features.map((feature) => (
                          <div
                            key={feature.id}
                            className={cn(
                              "transition-opacity duration-300 absolute inset-0 rounded-none",
                              activeFeature === feature.id
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0"
                            )}
                          >
                            <Image
                              src={feature.image}
                              alt={feature.title}
                              width={600}
                              height={400}
                              className="block w-full h-full rounded-none object-left-top object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-none h-px w-full relative">
            <div className="bg-[rgb(229,229,229)] h-full w-full opacity-100 overflow-hidden relative"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 pt-8">
            {smallFeatures.map((feature, index) => (
              <SmallFeature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>

        <div className="mt-24 space-y-24">
          {alternatingFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center gap-12">
              {feature.imagePosition === "left" ? (
                <>
                  <FeatureImage image={feature.image} title={feature.title} />
                  <FeatureContent {...feature} />
                </>
              ) : (
                <>
                  <FeatureContent {...feature} />
                  <FeatureImage image={feature.image} title={feature.title} />
                </>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureBox({ icon, title, description, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left transition-all duration-200 transform-none origin-center flex-none h-auto relative",
        isActive
          ? "bg-white shadow-md rounded-2xl p-6"
          : "p-4 hover:bg-gray-50/50 rounded-xl"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center",
            !isActive && "w-10 h-10"
          )}
        >
          {icon}
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
      </div>

      {isActive && (
        <div className="mt-4 space-y-3">
          <p className="text-gray-600">{description}</p>
          <span className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium">
            Learn more
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      )}
    </button>
  );
}

function SmallFeature({ icon, title, description }) {
  return (
    <div className="flex flex-col items-start content-start gap-3 h-min justify-start overflow-hidden p-0 relative">
      <div className="flex items-center content-center gap-2 h-min justify-start overflow-visible p-0 relative w-full">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
          {icon}
        </div>
        <h4 className="text-base text-black font-medium mb-2">{title}</h4>
      </div>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  );
}

function FeatureImage({ image, title }) {
  return (
    <div className="flex items-center content-center bg-[#f5f5f5] rounded-[26px] flex-1 flex-col flex-nowrap gap-12 h-[400px] justify-center overflow-visible p-[6px] relative w-[1px]">
      <div className="flex items-end content-end bg-[#ffffff] rounded-[20px] flex-1 flex-col flex-nowrap gap-[10px] h-[1px] justify-start overflow-hidden p-[48px] relative w-full will-change-[transform] border-[1px] border-solid border-[#e5e5e5] custom-border">
        <div className="rounded-[8px] flex-none h-[381px] overflow-hidden relative w-[579px] will-change-[transform]">
          <div className="absolute inset-0 rounded-none">
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              className="block w-full h-full rounded-none object-cover object-right-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureContent({ title, description, items }) {
  return (
    <div className="w-full lg:w-1/2">
      <h3 className="text-2xl sm:text-4xl font-medium mb-4">
        {title}
      </h3>
      <p className="text-base text-gray-600 mb-8">
        {description}
      </p>
      <ul className="space-y-3">
        {items.map((item, itemIndex) => (
          <li key={itemIndex} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}