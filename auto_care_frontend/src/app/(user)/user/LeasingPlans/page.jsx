import LeasingPlans from '../components/homepage/LeasingPlans';
import InsurancePlans from '../components/homepage/InsurancePlans'; // Import the new component

export default function LeasingPlansPage() {
  return (
    <div>
      <main style={{ minHeight: '60vh', padding: '20px 0' }}>
        <LeasingPlans showAll={true} />
        {/* Separator or styling might be needed */}
        <div style={{ margin: '40px 0' }}></div> {/* Add some space between sections */}
        <InsurancePlans showAll={true} />
      </main>
    </div>
  );
}