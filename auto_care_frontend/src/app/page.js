import styles from '@/styles/theme/page.module.css'

export default function Home() {
  return (
    <div className="bg-[#fbe8df] text-gray-800">
      {/* Navbar */}
      <header className="w-full py-4 px-6 flex to-black justify-between items-center shadow">
        <div className="text-2xl font-bold text-blue-800">AUTO CARE</div>
        <nav className="space-x-4 hidden md:flex">
          <a href="#">Vehicles</a>
          <a href="#">Leasing</a>
          <a href="#">Sell Your Car</a>
          <a href="#">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <select className="border rounded px-2 py-1 text-sm">
            <option>EN</option>
            <option>DE</option>
          </select>
          <button className="text-sm underline">Sign In</button>
          <button className="text-sm underline">Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center px-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Your Dream Vehicle Awaits!</h1>
            <button className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">Browse Listings Today</button>
          </div>
        </div>
      </section>

      {/* Vehicle Type */}
      <section className="py-10 text-center">
        <h2 className="text-2xl font-semibold mb-6">Select Your Vehicle Type</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['Sedan', 'SUV', 'Truck', 'Van', 'Bus', 'Luxury'].map(type => (
            <button key={type} className="bg-white shadow px-4 py-2 rounded hover:bg-gray-200">{type}</button>
          ))}
        </div>
      </section>

      {/* Why Auto Care */}
      <section className="py-12 bg-black text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
          <div className="bg-[#fcd9c1] p-6 rounded text-black">
            <h3 className="font-bold text-lg mb-2">Boost Your Car’s Resale Value</h3>
            <p>Get insights and tips to get the best return.</p>
          </div>
          <div className="bg-[#fcd9c1] p-6 rounded text-black">
            <h3 className="font-bold text-lg mb-2">Lease with Confidence</h3>
            <p>Flexible plans that suit your needs.</p>
          </div>
          <div className="bg-[#fcd9c1] p-6 rounded text-black">
            <h3 className="font-bold text-lg mb-2">Drive Now, Worry Less</h3>
            <p>Insurance options built into your budget.</p>
          </div>
        </div>
      </section>

      {/* Buying Power */}
      <section className="py-10 text-center">
        <h2 className="text-xl font-semibold mb-4">Know Your Buying Power ?</h2>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="/car.png" alt="car" className="w-40 md:w-60" />
          <div>
            <h3 className="text-2xl font-bold text-orange-500">Rs. 7,200,000/=</h3>
            <p className="text-sm text-gray-500 mt-1">Based on your income & loan term</p>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-12 bg-gray-100">
        <h2 className="text-2xl text-center font-semibold mb-8">Featured Tools</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-4">
          {['Find Your Fit', 'Shop Your Budget', 'Arrange A Finance', 'Sell Your Car'].map(tool => (
            <div key={tool} className="bg-white p-4 rounded shadow text-center">
              <div className="h-32 bg-gray-200 mb-4" /> {/* Placeholder image */}
              <h4 className="font-semibold">{tool}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center text-sm py-6 border-t mt-10">
        <p>© 2025 Auto Care. All rights reserved.</p>
      </footer>
    </div>
  )
}
