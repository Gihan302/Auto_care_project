import { Hero } from './user/components/homepage/hero';
import { WhyAutoCare } from './user/components/homepage/whyAutoCare';
import { VehicleTypeSelector } from './user/components/homepage/vehicleTypeSlector';
import FeaturedTools from './user/components/homepage/featuredTools';
import BuyingPowerCal from './user/components/homepage/buyingPowerCal';

export default function HomePage() {
  return (
    <>
      <Hero />
      <VehicleTypeSelector />
      <WhyAutoCare />
      <BuyingPowerCal />
      <FeaturedTools />
      <SignUpForm />
    </>
  );
}
