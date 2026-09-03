import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  
  const initialForm = {
    name: '', category_id: '', sku: '', barcode: '',
    selling_price: '', purchase_price: '', stock_quantity: 0,
    low_stock_threshold: 5, unit: 'pcs', is_active: true
  };
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products?search=${search}`),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        selling_price: parseFloat(formData.selling_price),
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category_id: product.category_id || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      selling_price: product.selling_price,
      purchase_price: product.purchase_price || '',
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      unit: product.unit,
      is_active: product.is_active
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (loading) return <div className="h-40 animate-pulse rounded-2xl bg-white shadow-sm" />;

  return (
    <div className="page-card">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center md:p-6">
        <div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Inventory</p><h2 className="mt-1 text-xl font-bold text-slate-900">Products</h2></div>
        
        <div className="flex w-full sm:w-auto gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 sm:w-64"
            />
          </div>
          <button 
            onClick={() => { setShowForm(true); setEditingId(null); setFormData(initialForm); }}
            className="primary-button whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="border-b border-slate-100 bg-slate-50 p-5 md:p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block">Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Selling Price *</label>
              <input type="number" step="0.01" required value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Purchase Price</label>
              <input type="number" step="0.01" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock Quantity</label>
              <input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Low Stock Threshold</label>
              <input type="number" value={formData.low_stock_threshold} onChange={e => setFormData({...formData, low_stock_threshold: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium">Barcode</label>
              <input type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{editingId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
              <tr>
              <th className="p-4 font-medium text-gray-600">Product</th>
              <th className="p-4 font-medium text-gray-600">Price</th>
              <th className="p-4 font-medium text-gray-600">Stock</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{categories.find(c => c.id === p.category_id)?.name || 'No category'}</div>
                </td>
                <td className="p-4">₹{p.selling_price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.stock_quantity <= p.low_stock_threshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {p.stock_quantity === 0 ? 'Out of stock' : p.stock_quantity <= p.low_stock_threshold ? 'Low stock' : 'In stock'} · {p.stock_quantity} {p.unit}
                  </span>
                </td>
                <td className="p-4">{p.is_active ? 'Active' : 'Inactive'}</td>
                <td className="p-4 flex space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-500"><Package className="mx-auto mb-2 h-8 w-8 text-blue-200" />No products yet. Add your first product to manage inventory.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
