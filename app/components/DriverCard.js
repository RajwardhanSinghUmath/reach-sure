import { FaUser, FaPhone, FaAmbulance } from "react-icons/fa"

const DriverCard = ({ driver }) => {
  if (!driver) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
          <FaUser size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{driver.name}</h3>
          <p className="text-gray-600 flex items-center">
            <FaPhone className="mr-1" size={14} /> {driver.phone}
          </p>
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="flex items-center text-gray-700 mb-1">
          <FaAmbulance className="mr-2" /> {driver.ambulanceType}
        </p>
        <p className="text-gray-700">
          Vehicle: <span className="font-medium">{driver.ambulanceNumber}</span>
        </p>
        <div className="mt-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              driver.status === "online"
                ? "bg-green-100 text-green-800"
                : driver.status === "busy"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DriverCard

