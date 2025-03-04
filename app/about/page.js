export default function About() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">About ReachSure</h1>

        <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            ReachSure is dedicated to revolutionizing emergency medical transportation by connecting patients with
            ambulances quickly and efficiently during critical moments.
          </p>
          <p className="text-gray-600">
            Our platform aims to reduce response times, improve access to emergency medical services, and ultimately
            save lives by leveraging technology to streamline the ambulance booking process.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-4">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Share Your Location</h3>
                <p className="text-gray-600">Allow the app to access your current location or enter it manually.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-4">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Select a Hospital</h3>
                <p className="text-gray-600">Choose from nearby hospitals displayed on the map.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-4">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Choose Ambulance Type</h3>
                <p className="text-gray-600">Select the appropriate ambulance based on your medical needs.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-4">
                <span className="text-red-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Track in Real-Time</h3>
                <p className="text-gray-600">Monitor the ambulance's location as it approaches you.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Basic Life Support (BLS)</h3>
              <p className="text-gray-600">Equipped with essential medical supplies for non-critical patients.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Advanced Life Support with EMT</h3>
              <p className="text-gray-600">Fully equipped with advanced medical equipment and trained EMT personnel.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Advanced Life Support without EMT</h3>
              <p className="text-gray-600">Advanced equipment for critical situations with standard medical staff.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Emergency services available round the clock, every day of the year.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

