import { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, FileText, Package, AlertTriangle, TrendingUp } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [sumRes, salesRes, payRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/sales?days=7'),
          api.get('/dashboard/payment-summary')
        ]);
        setSummary(sumRes.data);
        setSalesData(salesRes.data);
        setPaymentData(payRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map(card => <div key={card} className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />)}</div>;

  const statCards = [
    { label: "Today's Sales", value: `₹${summary.today_sales.toLocaleString()}`, hint: 'Revenue collected today', icon: IndianRupee, color: 'bg-blue-50 text-blue-600' },
    { label: "Today's Bills", value: summary.today_bills, hint: 'Invoices generated today', icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Products', value: summary.total_products, hint: 'Items in your catalogue', icon: Package, color: 'bg-violet-50 text-violet-600' },
    { label: 'Low Stock', value: summary.low_stock, hint: 'Items need your attention', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, hint, icon: Icon, color }) => (
          <div key={label} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between"><div className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></div><TrendingUp className="h-4 w-4 text-slate-300 transition group-hover:text-emerald-500" /></div>
            <p className="mt-5 text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Sales Last 7 Days</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Payment Methods</h3>
          <div className="h-72 flex items-center justify-center">
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No payment data yet</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {paymentData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}: ₹{entry.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
