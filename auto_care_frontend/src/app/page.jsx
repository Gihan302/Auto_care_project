<<<<<<< HEAD:auto_care_frontend/src/app/page.js
import { Hero } from './(user)/user/components/homepage/hero';
import { WhyAutoCare } from './(user)/user/components/homepage/whyAutoCare';
import { VehicleTypeSelector } from './(user)/user/components/homepage/vehicleTypeSlector';
import FeaturedTools from './(user)/user/components/homepage/featuredTools';
import BuyingPowerCal from './(user)/user/components/homepage/buyingPowerCal';
=======
import { Hero } from './user/components/homepage/hero';
import { WhyAutoCare } from './user/components/homepage/whyAutoCare';
import { VehicleTypeSelector } from './user/components/homepage/vehicleTypeSlector';
import FeaturedTools from './user/components/homepage/featuredTools';
import BuyingPowerCal from './user/components/homepage/buyingPowerCal';
import { SignUpForm } from '../components/Login/SignUpForm';
>>>>>>> Rangana-1st-frontend:auto_care_frontend/src/app/page.jsx

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
