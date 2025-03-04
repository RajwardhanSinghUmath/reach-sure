export default function Contact() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">Contact Us</h1>

        <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or feedback about our services? We'd love to hear from you. Fill out the form below or reach
            out to us directly using the contact information provided.
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Subject of your message"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Your message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium block">Address:</span>
                123 Emergency Lane, Medical District
                <br />
                Hyderabad, Telangana 500032
              </p>

              <p className="text-gray-600">
                <span className="font-medium block">Email:</span>
                info@reachsure.com
              </p>

              <p className="text-gray-600">
                <span className="font-medium block">Phone:</span>
                +91 1234567890 (General Inquiries)
                <br />
                +91 9876543210 (Emergency Helpline)
              </p>

              <p className="text-gray-600">
                <span className="font-medium block">Hours:</span>
                24/7 Emergency Services
                <br />
                Office Hours: 9:00 AM - 6:00 PM (Mon-Fri)
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">For Drivers</h2>
            <p className="text-gray-600 mb-4">
              Interested in joining our network of ambulance drivers? We're always looking for qualified professionals
              to join our team.
            </p>

            <a
              href="/driver/onboarding"
              className="inline-block px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Apply as a Driver
            </a>

            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-2">Driver Support</h3>
              <p className="text-gray-600">
                For existing drivers needing assistance:
                <br />
                Email: drivers@reachsure.com
                <br />
                Phone: +91 8765432109
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

