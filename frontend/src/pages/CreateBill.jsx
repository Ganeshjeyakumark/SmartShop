import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, Search, ShoppingCart, CreditCard } from 'lucide-react';

export default function CreateBill() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  
  // Bill State
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');

  // Manual Item Form
  const [showManual, setShowManual] = useState(false);
  const [manualItem, setManualItem] = useState({ name: '', price: '', qty: 1 });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          api.get('/products?is_active=true'),
          api.get('/customers') // Future proofing
        ]);
        setProducts(prodRes.data.filter(p => p.is_active));
        setCustomers(custRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitial();
  }, []);

  const addExistingProduct = (product) => {
    const existing = items.find(i => i.product_id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        alert('Cannot add more than available stock!');
        return;
      }
      setItems(items.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      if (product.stock_quantity < 1) {
        alert('Product out of stock!');
        return;
      }
      setItems([...items, {
        product_id: product.id,
        product_name: product.name,
        unit_price: product.selling_price,
        quantity: 1,
        stock_quantity: product.stock_quantity
      }]);
    }
    setSearch('');
  };

  const addManualItem = (e) => {
    e.preventDefault();
    setItems([...items, {
      product_id: null,
      product_name: manualItem.name,
      unit_price: parseFloat(manualItem.price),
      quantity: parseInt(manualItem.qty),
      stock_quantity: Infinity
    }]);
    setManualItem({ name: '', price: '', qty: 1 });
    setShowManual(false);
  };

  const updateQuantity = (index, delta) => {
    const newItems = [...items];
    const item = newItems[index];
    const newQty = item.quantity + delta;
    
    if (newQty < 1) return;
    if (item.product_id && newQty > item.stock_quantity) {
       alert('Exceeds available stock');
       return;
    }
    item.quantity = newQty;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
  const total = subtotal - parseFloat(discount || 0) + parseFloat(tax || 0);

  const handleSubmit = async () => {
    if (items.length === 0) return alert('Please add items to bill');
    if (total < 0) return alert('Total cannot be negative');

    try {
      const payload = {
        customer_id: selectedCustomer ? parseInt(selectedCustomer) : null,
        discount: parseFloat(discount || 0),
        tax: parseFloat(tax || 0),
        payment_method: paymentMethod,
        notes: notes,
        items: items.map(i => ({
          product_id: i.product_id,
          product_name: i.product_name,
          quantity: i.quantity,
          unit_price: i.unit_price
        }))
      };

      const res = await api.post('/bills', payload);
      alert('Bill created successfully!');
      navigate(`/bills/${res.data.id}`); // Navigate to bill details
    } catch (err) {
      alert(err.response?.data?.detail || 'Error creating bill');
    }
  };

  const filteredProducts = search ? products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.barcode && p.barcode.includes(search))
  ).slice(0, 5) : [];

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      {/* Left side - Product Selection */}
      <div className="page-card flex w-full flex-col p-5 md:p-6 lg:w-1/2">
        <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Search className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Product search</p><h2 className="text-xl font-bold text-slate-900">Add Products</h2></div></div>
        
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or barcode..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 pl-10 pr-4 focus:bg-white"
          />
          {search && filteredProducts.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => addExistingProduct(p)} className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between border-b last:border-0">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">Stock: {p.stock_quantity}</div>
                  </div>
                  <div className="font-medium text-blue-600">₹{p.selling_price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowManual(!showManual)}
            className="mb-4 self-start text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          + Add Manual Item
        </button>

        {showManual && (
          <form onSubmit={addManualItem} className="bg-gray-50 p-4 rounded-md mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium">Item Name</label>
              <input type="text" required value={manualItem.name} onChange={e => setManualItem({...manualItem, name: e.target.value})} className="mt-1 w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Price (₹)</label>
              <input type="number" step="0.01" required value={manualItem.price} onChange={e => setManualItem({...manualItem, price: e.target.value})} className="mt-1 w-full border rounded px-3 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input type="number" min="1" required value={manualItem.qty} onChange={e => setManualItem({...manualItem, qty: e.target.value})} className="mt-1 w-full border rounded px-3 py-1" />
            </div>
            <div className="col-span-2">
              <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Add to Bill</button>
            </div>
          </form>
        )}
      </div>

      {/* Right side - Cart/Bill */}
      <div className="page-card flex w-full flex-col lg:w-1/2">
        <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center md:p-6">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><ShoppingCart className="h-5 w-5" /></div><h2 className="text-xl font-bold text-slate-900">Current Bill</h2></div>
          {/* Customer Selection placeholder */}
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="border rounded px-3 py-1 bg-white text-sm">
            <option value="">Walk-in Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
          </select>
        </div>
        
        <div className="flex-1 overflow-auto p-6 min-h-[300px]">
          {items.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center text-center text-slate-400"><ShoppingCart className="mb-3 h-10 w-10 text-slate-200" /><p className="font-semibold text-slate-500">Your cart is empty</p><p className="text-sm">Search for a product to begin a bill.</p></div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                    <div className="text-sm text-gray-500">₹{item.unit_price} / unit</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex border rounded-md">
                      <button onClick={() => updateQuantity(idx, -1)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                      <div className="px-3 py-1 border-l border-r">{item.quantity}</div>
                      <button onClick={() => updateQuantity(idx, 1)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200">+</button>
                    </div>
                    <div className="w-20 text-right font-medium text-gray-800">
                      ₹{(item.unit_price * item.quantity).toFixed(2)}
                    </div>
                    <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 p-5 md:p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discount (₹)</span>
              <input type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)} className="w-24 text-right border rounded px-2 py-1 text-sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax (₹)</span>
              <input type="number" min="0" value={tax} onChange={e => setTax(e.target.value)} className="w-24 text-right border rounded px-2 py-1 text-sm" />
            </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border rounded px-3 py-2 bg-white">
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
               <label className="block text-sm text-gray-600 mb-1">Notes</label>
               <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded px-3 py-2 bg-white" placeholder="Optional notes" />
            </div>
          </div>

          <button onClick={handleSubmit} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-bold text-white transition-colors hover:bg-emerald-700">
            <CreditCard className="h-5 w-5" /> Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
}
