import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Eye } from 'lucide-react';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await api.get('/bills');
        setBills(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  if (loading) return <div>Loading bills...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bill History</h2>
        <Link to="/billing" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
          Create New Bill
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Bill No</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Total</th>
              <th className="p-4 font-medium text-gray-600">Payment</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-blue-600">{bill.bill_number}</td>
                <td className="p-4">{new Date(bill.created_at).toLocaleDateString()}</td>
                <td className="p-4">{bill.customer_id ? `Cust #${bill.customer_id}` : 'Walk-in'}</td>
                <td className="p-4 font-semibold">₹{bill.total_amount}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                    {bill.payment_method}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {/* For now, just a button. Will link to details page in Phase 5 */}
                  <button className="text-gray-500 hover:text-blue-600 inline-flex items-center">
                    <Eye className="w-5 h-5 mr-1" /> View
                  </button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  No bills found. Create your first bill!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
