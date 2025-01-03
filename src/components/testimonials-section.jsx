"use client";

import { Container } from "@/components/ui/container";
import { Star } from "lucide-react";

const metrics = [
  {
    value: "50,000+",
    label: "Veterinarians",
  },
  {
    value: "1,000+",
    label: "Clinics",
  },
  {
    value: "99%",
    label: "Satisfaction rate",
  },
  {
    value: "10M+",
    label: "SOAP notes generated",
  },
];

const testimonials = [
  {
    name: "Dr. Emily Johnson",
    role: "Veterinary Practice Owner",
    image: "/avatars/emily.png",
    content:
      "Scriba has revolutionized our practice workflow. The AI-powered SOAP notes are incredibly accurate and save us hours each day. It's transformed how we document patient care.",
  },
  {
    name: "Dr. Jason Rodriguez",
    role: "Emergency Veterinarian",
    image: "/avatars/jason.png",
    content:
      "In emergency medicine, speed is crucial. Scriba helps me document cases quickly and accurately, allowing me to focus more on patient care during critical moments.",
  },
  {
    name: "Dr. Sarah Turner",
    role: "Senior Veterinarian",
    image: "/avatars/sarah.png",
    content:
      "The species-specific templates and voice recognition accuracy are outstanding. It understands veterinary terminology perfectly and creates comprehensive SOAP notes.",
  },
  {
    name: "Dr. Michael Chen",
    role: "Veterinary Director",
    image: "/avatars/michael.png",
    content:
      "Managing a large practice became much easier with Scriba. The collaborative features ensure seamless communication between our veterinary teams.",
  },
  {
    name: "Dr. Sophia Patel",
    role: "Exotic Animal Specialist",
    image: "/avatars/sophia.png",
    content:
      "The customizable templates work great for exotic animals. Scriba adapts perfectly to the unique requirements of treating non-traditional pets.",
  },
  {
    name: "Dr. David Brown",
    role: "Mobile Veterinarian",
    image: "/avatars/david.png",
    content:
      "As a mobile vet, having cloud-based SOAP notes that I can access anywhere is invaluable. Scriba's mobile app is intuitive and reliable.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(255,237,213,0.2)_0%,rgba(255,255,255,0)_100%)]" />
      </div>
      <Container>
        <div className="flex items-center justify-center flex-col gap-12 overflow-hidden p-0 relative w-full">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-500 mb-4">
              Customers
            </span>
            <h2 className="font-plus text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
              The users we are proud of
            </h2>
            <p className="text-xl text-gray-600">
              Scriba integrates seamlessly with your veterinary practice
              management software, allowing you to streamline your workflow from
              anywhere.
            </p>
          </div>
          <div className="flex items-center justify-center content-center bg-[#f5f5f5] rounded-[26px] flex-none flex-row flex-nowrap gap-[6px] h-min overflow-hidden p-[6px] relative w-full will-change-transform">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex flex-col flex-nowrap items-center justify-center content-center bg-white rounded-[20px] flex-grow-[1] gap-[12px] h-min overflow-hidden p-[24px_48px] relative w-[1px] will-change-transform border border-solid border-[#e5e5e5] custom-border"
              >
                <div className="text-3xl font-medium mb-1">{metric.value}</div>
                <div className="text-gray-500 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-300 rounded-[20px] opacity-100 w-full flex flex-col items-start justify-start gap-6 overflow-hidden p-6 h-min relative will-change-transform custom-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-blue-500 text-blue-500"
                    />
                  ))}
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
