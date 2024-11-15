import Hero from '@/components/Hero'
import Navigation from '@/components/Navigation'
import StatsAndFeatures from '@/components/StatsAndFeatures'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import FeaturesSection from '@/components/FeaturesSection'

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <AnnouncementBanner />
      <Navigation />
      <Hero />
      <StatsAndFeatures />
      <FeaturesSection />
    </div>
  )
}