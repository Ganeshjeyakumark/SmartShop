import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import CreateBill from './pages/CreateBill';
import Bills from './pages/Bills';
import BillDetails from './pages/BillDetails';
import PrinterSettings from './pages/PrinterSettings';
import Customers from './pages/Customers';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="billing" element={<CreateBill />} />
          <Route path="bills" element={<Bills />} />
          <Route path="bills/:id" element={<BillDetails />} />
          <Route path="printer" element={<PrinterSettings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          {/* Add other protected routes here in future phases */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
