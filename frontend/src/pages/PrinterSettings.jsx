import { useState, useEffect } from 'react';
import printerService from '../services/printer';
import { Printer as PrinterIcon } from 'lucide-react';

export default function PrinterSettings() {
  const [type, setType] = useState(printerService.type);
  const [paper, setPaper] = useState(printerService.paperSize);
  const [status, setStatus] = useState({ status: 'UNKNOWN', message: '' });

  useEffect(() => {
    checkStatus();
  }, [type]);

  const checkStatus = async () => {
    const stat = await printerService.getStatus();
    setStatus(stat);
  };

  const handleSave = () => {
    printerService.saveSettings(type, paper);
    alert('Printer settings saved successfully.');
    checkStatus();
  };

  const testPrint = () => {
    const el = document.createElement('div');
    el.innerHTML = `
      <div style="text-align: center;">
        <h3>TEST PRINT</h3>
        <p>Printer connection successful!</p>
        <p>${new Date().toLocaleString()}</p>
        <p>------------------</p>
      </div>
    `;
    printerService.printReceipt(el);
  };

  return (
    <div className="bg-white rounded-lg shadow max-w-2xl">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold flex items-center">
          <PrinterIcon className="mr-2" /> Printer Settings
        </h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status.status === 'CONNECTED' || status.status === 'SUPPORTED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium text-gray-700">{status.status}</span>
          <span className="text-sm text-gray-500">- {status.message}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white">
              <option value="BROWSER">Browser System Print</option>
              <option value="BLUETOOTH">Bluetooth ESC/POS</option>
              <option value="USB">USB (Not Supported)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
            <select value={paper} onChange={e => setPaper(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white">
              <option value="58mm">58mm Receipt</option>
              <option value="80mm">80mm Receipt</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Save Settings
          </button>
          <button onClick={testPrint} className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
            Test Print
          </button>
        </div>
      </div>
    </div>
  );
}
