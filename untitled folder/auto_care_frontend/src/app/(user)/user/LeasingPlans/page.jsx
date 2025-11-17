import LeasingPlans from '../components/homepage/LeasingPlans';

export default function LeasingPlansPage() {
  return (
    <div>
      <main style={{ minHeight: '60vh', padding: '20px 0' }}>
        <LeasingPlans showAll={true} />
      </main>
    </div>
  );
}