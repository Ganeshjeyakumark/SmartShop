import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import printerService from '../services/printer';
import { formatDateTimeIST } from '../services/date';
import { Printer as PrinterIcon, Download, ArrowLeft } from 'lucide-react';

export default function BillDetails() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const [billRes, shopRes] = await Promise.all([
          api.get(`/bills/${id}`),
          api.get('/shop/profile')
        ]);
        setBill(billRes.data);
        setShop(shopRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [id]);

  const handlePrint = () => {
    printerService.printReceipt(receiptRef.current);
  };

  const handleDownloadPdf = () => {
    // Standard browser print to PDF via the same dialog, or implement html2pdf
    printerService.printReceipt(receiptRef.current);
  };

  if (loading) return <div>Loading bill details...</div>;
  if (!bill) return <div>Bill not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link to="/bills" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl font-semibold">Bill #{bill.bill_number}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownloadPdf} className="flex items-center px-4 py-2 border rounded hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" /> PDF
            </button>
            <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <PrinterIcon className="w-4 h-4 mr-2" /> Print Receipt
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-medium">{formatDateTimeIST(bill.created_at)}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Method</p>
            <p className="font-medium">{bill.payment_method}</p>
          </div>
          <div>
            <p className="text-gray-500">Customer ID</p>
            <p className="font-medium">{bill.customer_id || 'Walk-in'}</p>
          </div>
          <div>
            <p className="text-gray-500">Notes</p>
            <p className="font-medium">{bill.notes || '-'}</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-t">
              <th className="p-3 font-medium text-gray-600">Item</th>
              <th className="p-3 font-medium text-gray-600 text-right">Qty</th>
              <th className="p-3 font-medium text-gray-600 text-right">Price</th>
              <th className="p-3 font-medium text-gray-600 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">{item.product_name}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">₹{item.unit_price}</td>
                <td className="p-3 text-right font-medium">₹{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full max-w-sm ml-auto mt-6 space-y-2 text-right">
          <div className="flex justify-between text-gray-600"><span>Subtotal:</span> <span>₹{bill.subtotal}</span></div>
          <div className="flex justify-between text-gray-600"><span>Discount:</span> <span>₹{bill.discount}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax:</span> <span>₹{bill.tax}</span></div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
            <span>Total:</span> <span className="text-blue-600">₹{bill.total_amount}</span>
          </div>
        </div>
      </div>

      {/* Hidden Receipt Element for Printing */}
      <div className="hidden">
        <div ref={receiptRef}>
          <div className="text-center border-bottom pb-2 mb-2">
            <div className="bold text-lg">{shop?.shop_name}</div>
            <div>{shop?.address}, {shop?.city}</div>
            <div>Ph: {shop?.phone}</div>
            {shop?.gst_number && <div>GST: {shop?.gst_number}</div>}
          </div>
          <div className="mb-2">
            <div>Bill No: {bill.bill_number}</div>
            <div>Date: {formatDateTimeIST(bill.created_at)}</div>
          </div>
          <div className="border-top border-bottom py-1 mb-2">
            <table>
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th className="text-right">QTY</th>
                  <th className="text-right">AMT</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.product_name}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right mb-2">
            <div>Subtotal: {bill.subtotal}</div>
            {parseFloat(bill.discount) > 0 && <div>Disc: -{bill.discount}</div>}
            {parseFloat(bill.tax) > 0 && <div>Tax: +{bill.tax}</div>}
            <div className="bold border-top mt-1 pt-1">TOTAL: {bill.total_amount}</div>
          </div>
          <div className="text-center mt-4">
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
