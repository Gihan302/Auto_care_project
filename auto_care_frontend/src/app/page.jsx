import { Hero } from './(user)/user/components/homepage/hero';
import { WhyAutoCare } from './(user)/user/components/homepage/whyAutoCare';
import { VehicleTypeSelector } from './(user)/user/components/homepage/vehicleTypeSlector';
import FeaturedTools from './(user)/user/components/homepage/featuredTools';
import BuyingPowerCal from './(user)/user/components/homepage/buyingPowerCal';
import { SignUpForm } from '../components/Login/SignUpForm';

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
