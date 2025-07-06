import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import './quotationGenerator.css';

 import logo from '../assets/logo.png'; // Replace with actual path to your logo


const QuotationGenerator = () => {
  const location = useLocation();
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', charge: '' });

  useEffect(() => {
    if (location.state) {
      const { name, phone, address } = location.state;
      setClientInfo({ name, phone, address });
    }
  }, [location.state]);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const addService = () => {
    if (newService.name && newService.charge) {
      setServices([...services, { ...newService, locked: true }]);
      setNewService({ name: '', charge: '' });
    }
  };

  const removeService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const lockService = (index) => {
    const updated = [...services];
    updated[index].locked = true;
    setServices(updated);
  };

const exportToPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const quotationNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Add logo
  const imgWidth = 30;
  const imgHeight = 30;
  doc.addImage(logo, 'PNG', 20, 10, imgWidth, imgHeight);

  // Company Name & Tagline
  doc.setFontSize(18);
  doc.setFont('PlayFair Display', 'bold');
  doc.text('One Stop Solutions', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('FIXING THE LEAKS  LEAVING NO PEAKS', pageWidth / 2, 26, { align: 'center' });
  doc.text('Thosarwadi bldg, Opp Janta shakari, Hanuman Road, Vile Parle (E), Mumbai - 400057', pageWidth / 2, 32, { align: 'center' });

  // Move line separator BELOW the address and logo
  doc.setLineWidth(0.5);
  doc.line(20, 38, pageWidth - 20, 38);

  // Quotation Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation', pageWidth / 2, 46, { align: 'center' });

  // Quotation No and Date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quotation No: #${quotationNumber}`, 20, 55);
  doc.text(`Date: ${currentDate}`, pageWidth - 20, 55, { align: 'right' });

  // Client Info
  const startY = 68;
  doc.text(`Client Name: ${clientInfo.name}`, 20, startY);
  doc.text(`Phone: +91 ${clientInfo.phone}`, 20, startY + 8);
  doc.text(`Address: ${clientInfo.address}`, 20, startY + 16);

  // Services Table
  let y = startY + 30;
  const colX = {
    sno: 20,
    desc: 40,
    charge: pageWidth - 40,
  };

  doc.setFont('helvetica', 'bold');
  doc.text('S.No', colX.sno, y);
  doc.text('Service Description', colX.desc, y);
  doc.text('Charges (₹)', colX.charge, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  y += 8;

  services.forEach((service, i) => {
    doc.text(`${i + 1}`, colX.sno, y);
    doc.text(service.name, colX.desc, y);
    doc.text(`₹${service.charge}`, colX.charge, y, { align: 'right' });
    y += 8;
  });

  // Total
  const total = services.reduce((sum, s) => sum + Number(s.charge || 0), 0);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total', colX.desc, y);
  doc.text(`₹${total}`, colX.charge, y, { align: 'right' });

  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing One Stop Solutions!', pageWidth / 2, y, { align: 'center' });

  // Save PDF
  doc.save(`${clientInfo.name}_quotation.pdf`);
};



  const shareWhatsApp = () => {
    const message = `🧾 *Quotation*\n\nName: ${clientInfo.name}\nPhone: +91${clientInfo.phone}\nAddress: ${clientInfo.address}\n\n` +
      services.map((s, i) => `${i + 1}. ${s.name} - ₹${s.charge}`).join('\n');
    window.open(`https://wa.me/91${clientInfo.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="quotation-container">
      <h2>Quotation Generator</h2>

      <form className="quotation-form">
        {['name', 'phone', 'address'].map((field) => (
          <div key={field} className="input-group">
            <input
              type={field === 'phone' ? 'tel' : 'text'}
              name={field}
              value={clientInfo[field]}
              onChange={handleClientChange}
              required={field !== 'address'}
              className={`form-input ${clientInfo[field] ? 'filled' : ''}`}
              maxLength={field === 'phone' ? 10 : undefined}
            />
            <label className={clientInfo[field] ? 'filled' : ''}>
              {field === 'name' ? 'Client Name' : field === 'phone' ? 'Phone Number' : 'Address'}
            </label>
          </div>
        ))}

        <div className="service-entry-row">
          <div className="input-group half">
            <input
              type="text"
              name="name"
              value={newService.name}
              onChange={handleServiceChange}
              className={`form-input ${newService.name ? 'filled' : ''}`}
            />
            <label className={newService.name ? 'filled' : ''}>Service</label>
          </div>

          <div className="input-group quarter">
            <input
              type="number"
              name="charge"
              value={newService.charge}
              onChange={handleServiceChange}
              className={`form-input ${newService.charge ? 'filled' : ''}`}
            />
            <label className={newService.charge ? 'filled' : ''}>Charge (₹)</label>
          </div>

          <button type="button" onClick={addService} className="add-btn">✔️</button>
        </div>

        <div className="services-list">
          {services.map((s, i) => (
            <div key={i} className="service-item">
              {s.locked ? (
                <>
                  <span>{s.name} - ₹{s.charge}</span>
                  <button onClick={() => removeService(i)} className="remove-btn">❌</button>
                </>
              ) : (
                <>
                  <input
                    value={s.name}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[i].name = e.target.value;
                      setServices(updated);
                    }}
                  />
                  <input
                    type="number"
                    value={s.charge}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[i].charge = e.target.value;
                      setServices(updated);
                    }}
                  />
                  <button onClick={() => lockService(i)}>✔️</button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" onClick={exportToPDF} className="pdf-btn">📄 Export to PDF</button>
          <button type="button" onClick={shareWhatsApp} className="whatsapp-btn">📤 Share via WhatsApp</button>
        </div>
      </form>
    </div>
  );
};

export default QuotationGenerator;
