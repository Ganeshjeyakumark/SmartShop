import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight, Store } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    owner_name: '', email: '', password: '', confirm_password: '',
    shop_name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_#cffafe,_transparent_38%),#f8fafc] px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"><Store className="h-7 w-7" /></div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Open your SmartShop</h1>
          <p className="mt-2 text-slate-500">Set up your retail workspace in minutes</p>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input type="text" name="owner_name" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="confirm_password" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input type="text" name="shop_name" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" name="phone" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" name="address" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" name="state" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input type="text" name="pincode" required onChange={handleChange} className="mt-1 block w-full" />
            </div>
          </div>
          <button type="submit" className="primary-button w-full gap-2">
            Register Shop <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
