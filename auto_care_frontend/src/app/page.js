import { Hero } from './user/components/homepage/hero';
import { WhyAutoCare } from './user/components/homepage/whyAutoCare';
import { VehicleTypeSelector } from './user/components/homepage/vehicleTypeSlector';

export default function HomePage() {
  return (
    <>
      <Hero />
      <VehicleTypeSelector />
      <WhyAutoCare />
    </>
  );
}
