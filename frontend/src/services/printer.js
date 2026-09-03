class PrinterService {
  constructor() {
    this.type = localStorage.getItem('printer_type') || 'BROWSER'; // BROWSER, BLUETOOTH, USB
    this.paperSize = localStorage.getItem('printer_paper') || '58mm';
  }

  saveSettings(type, paperSize) {
    this.type = type;
    this.paperSize = paperSize;
    localStorage.setItem('printer_type', type);
    localStorage.setItem('printer_paper', paperSize);
  }

  async getStatus() {
    if (this.type === 'BROWSER') return { status: 'CONNECTED', message: 'Ready to print via browser' };
    if (this.type === 'BLUETOOTH' && navigator.bluetooth) {
       return { status: 'SUPPORTED', message: 'Bluetooth supported. Ready to connect on print.' };
    }
    return { status: 'DISCONNECTED', message: 'Printer type not supported or disconnected' };
  }

  async printReceipt(htmlElement) {
    if (this.type === 'BROWSER') {
      this._printViaBrowser(htmlElement);
    } else if (this.type === 'BLUETOOTH') {
      alert("Bluetooth ESC/POS printing would be invoked here.");
      // In a real app, this would use Web Bluetooth API to connect to ESC/POS printer
      // and send raw byte arrays.
    } else {
      alert("Printing method not supported.");
    }
  }

  _printViaBrowser(htmlElement) {
    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; width: ${this.paperSize === '58mm' ? '58mm' : '80mm'}; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 2px 0; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .border-top { border-top: 1px dashed #000; margin-top: 5px; padding-top: 5px; }
            .border-bottom { border-bottom: 1px dashed #000; margin-bottom: 5px; padding-bottom: 5px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          ${htmlElement.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Use a slight timeout to ensure styles are loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

export default new PrinterService();
