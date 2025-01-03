"use client";

import { Container } from "@/components/ui/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Scriba's AI SOAP note generator?",
    answer:
      "Scriba is an advanced AI-powered platform designed specifically for veterinary professionals to automatically generate accurate SOAP notes. It uses state-of-the-art voice recognition technology to transcribe your observations and create structured, comprehensive medical documentation in real-time.",
  },
  {
    question:
      "How accurate is the voice recognition for veterinary terminology?",
    answer:
      "Our AI is trained on extensive veterinary medical vocabulary and achieves over 98% accuracy with species-specific terminology. It recognizes breed names, medical conditions, medications, and technical terms commonly used in veterinary practice. The system continuously learns and improves with use.",
  },
  {
    question: "Can I customize the SOAP note templates?",
    answer:
      "Yes! Scriba offers fully customizable templates for different species, specialties, and practice types. You can modify sections, add custom fields, and save your preferred formats. Templates can be shared across your practice while maintaining individual preferences.",
  },
  {
    question:
      "Is Scriba compliant with veterinary medical record requirements?",
    answer:
      "Absolutely. Scriba is designed to meet all veterinary medical record-keeping requirements and standards. Our platform ensures comprehensive documentation, including all necessary fields for proper medical records, and maintains secure, HIPAA-compliant storage of all patient data.",
  },
  {
    question:
      "How does the integration with practice management software work?",
    answer:
      "Scriba seamlessly integrates with major veterinary practice management systems. Notes are automatically synchronized with patient records, and you can directly import patient information, medical history, and lab results. We support bi-directional data flow for efficient workflow management.",
  },
  {
    question: "What happens if I lose internet connection while using Scriba?",
    answer:
      "Scriba includes offline functionality that allows you to continue recording and generating notes even without internet connection. Once connectivity is restored, all data automatically syncs to the cloud and your practice management system.",
  },
];

export function FaqSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(220,252,231,0.3)_0%,rgba(255,255,255,0)_100%)]" />
      </div>

      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-green-50 text-green-600 rounded-full mb-4">
            FAQs
          </span>
          <h2 className="font-plus text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Answers to your questions
          </h2>
          <p className="text-xl text-gray-600">
            After reading this section, if you still have questions, feel free
            to contact however you want.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#F7F7F7] rounded-2xl border-none overflow-hidden"
              >
                <AccordionTrigger
                  className="group flex w-full items-center justify-between px-6 py-5 text-lg font-medium hover:no-underline [&>svg]:hidden"
                  data-state="closed"
                >
                  <span className="text-left">{faq.question}</span>
                  <div className="h-8 w-8 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center flex-none">
                    <svg
                      className="transition-transform duration-300 ease-in-out"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        transform: "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M7 0V14M0 7H14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 pt-1 text-base text-[#666666]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <style jsx>{`
          [data-state="open"] svg {
            transform: rotate(45deg);
          }
        `}</style>
      </Container>
    </section>
  );
}
