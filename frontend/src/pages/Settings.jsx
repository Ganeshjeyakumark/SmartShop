import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { shop, login } = useAuth();
  const [formData, setFormData] = useState({
    shop_name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', gst_number: '', invoice_prefix: ''
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (shop) {
      setFormData({
        shop_name: shop.shop_name || '',
        phone: shop.phone || '',
        email: shop.email || '',
        address: shop.address || '',
        city: shop.city || '',
        state: shop.state || '',
        pincode: shop.pincode || '',
        gst_number: shop.gst_number || '',
        invoice_prefix: shop.invoice_prefix || ''
      });
    }
  }, [shop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/shop/profile', formData);
      setSuccess('Settings updated successfully');
      // Trigger a re-render of shop name in sidebar by fetching new me
      const authData = await api.get('/auth/me');
      login(localStorage.getItem('access_token'), authData.data, res.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update settings');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow max-w-3xl">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Shop Settings</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {success && <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Shop Name</label>
            <input type="text" required value={formData.shop_name} onChange={e => setFormData({...formData, shop_name: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">GST Number</label>
            <input type="text" value={formData.gst_number} onChange={e => setFormData({...formData, gst_number: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Address</label>
            <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Pincode</label>
            <input type="text" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Invoice Prefix</label>
            <input type="text" value={formData.invoice_prefix} onChange={e => setFormData({...formData, invoice_prefix: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <div className="pt-4 border-t">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
