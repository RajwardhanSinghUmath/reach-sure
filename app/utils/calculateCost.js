/**
 * Calculate the cost of an ambulance ride based on distance and ambulance type
 * @param {number} distance - Distance in kilometers
 * @param {string} ambulanceType - Type of ambulance (BLS, ALS - with EMT, ALS - without EMT)
 * @returns {number} - Total cost in rupees
 */
export function calculateCost(distance, ambulanceType) {
  // Base prices
  const basePrices = {
    BLS: 500,
    "ALS - with EMT": 800,
    "ALS - without EMT": 650,
  }

  // Per kilometer rates
  const perKmRates = {
    BLS: 20,
    "ALS - with EMT": 30,
    "ALS - without EMT": 25,
  }

  // Get base price and per km rate based on ambulance type
  const basePrice = basePrices[ambulanceType] || 500 // Default to 500 if type not found
  const perKmRate = perKmRates[ambulanceType] || 20 // Default to 20 if type not found

  // Calculate total cost
  const distanceCost = distance * perKmRate
  const totalCost = basePrice + distanceCost

  // Round to nearest 10
  return Math.ceil(totalCost / 10) * 10
}

