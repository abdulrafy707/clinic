import { Container } from "@/components/ui/container";
import { Clock, Mic, Shield } from "lucide-react";

export function MainFeatures() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-plus text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Key Features
          </h2>
          <p className="text-xl text-gray-600">
            HIPAA compliant AI technology that automates medical notes and
            clinical documentation in seconds.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Mic className="w-6 h-6 text-blue-600" />}
            title="Voice Recognition"
            description="Advanced AI-powered voice recognition for accurate transcription of medical conversations."
            tag="AI-Powered"
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            title="Time-Saving"
            description="Automatically generate SOAP notes, saving hours of documentation time for healthcare professionals."
            tag="Efficiency"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-blue-600" />}
            title="HIPAA Compliant"
            description="Ensure patient data security and privacy with our HIPAA-compliant platform and encryption."
            tag="Security"
          />
        </div>
      </Container>
    </section>
  )
}

function FeatureCard({ icon, title, description, tag }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 -rotate-1 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 shadow-xl transition-all duration-300 group-hover:scale-105"></div>
      <div className="absolute inset-0 rotate-1 rounded-2xl bg-gradient-to-tr from-blue-50 to-blue-100 shadow-xl transition-all duration-300 group-hover:scale-105"></div>
      <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 group-hover:shadow-2xl">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="font-plus text-2xl font-medium text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          {tag}
        </span>
      </div>
    </div>
  )
}