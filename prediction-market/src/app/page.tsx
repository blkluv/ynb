import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
    </Layout>
  );
}
