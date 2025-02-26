'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ambulanceType: 'BLS',
    licenseNumber: '',
    location: { lat: 0, lng: 0 },
    fixedPrice: 500,
    variablePrice: 20,
    ambulanceNumber: '',
    status: 'offline',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/drivers/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to onboard driver');
      }

      const data = await response.json();
      console.log('Driver onboarded:', data);
      router.push('/driver/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Driver Onboarding</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ambulance Type</label>
          <select
            name="ambulanceType"
            value={formData.ambulanceType}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="BLS">BLS</option>
            <option value="ALS - with EMT">ALS - with EMT</option>
            <option value="ALS - without EMT">ALS - without EMT</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ambulance Number</label>
          <input
            type="text"
            name="ambulanceNumber"
            value={formData.ambulanceNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Fixed Price</label>
          <input
            type="number"
            name="fixedPrice"
            value={formData.fixedPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Variable Price (per km)</label>
          <input
            type="number"
            name="variablePrice"
            value={formData.variablePrice}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}