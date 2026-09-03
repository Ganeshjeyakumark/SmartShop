import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setShowForm(false);
      setFormData({ name: '', phone: '', email: '', address: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      alert('Error saving customer');
    }
  };

  const handleEdit = (customer) => {
    setFormData({ name: customer.name, phone: customer.phone, email: customer.email || '', address: customer.address || '' });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      alert('Error deleting customer');
    }
  };

  if (loading) return <div>Loading customers...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customers</h2>
        <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({name: '', phone: '', email: '', address: ''}); }} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b bg-gray-50">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium">Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone *</label>
              <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{editingId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">ID</th>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Contact</th>
              <th className="p-4 font-medium text-gray-600">Address</th>
              <th className="p-4 font-medium text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4">#{c.id}</td>
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-sm text-gray-600"><div>{c.phone}</div><div>{c.email}</div></td>
                <td className="p-4">{c.address || '-'}</td>
                <td className="p-4 flex space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
