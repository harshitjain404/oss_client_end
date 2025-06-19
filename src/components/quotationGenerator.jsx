import React, { useState } from 'react';
import './quotationGenerator.css';
import jsPDF from 'jspdf';

const QuotationGenerator = () => {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', charge: '' });

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

  const unlockService = (index) => {
    const updated = [...services];
    updated[index].locked = false;
    setServices(updated);
  };

  const lockService = (index) => {
    const updated = [...services];
    updated[index].locked = true;
    setServices(updated);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Quotation', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Name: ${clientInfo.name}`, 20, 40);
    doc.text(`Phone: ${clientInfo.phone}`, 20, 50);
    doc.text(`Address: ${clientInfo.address}`, 20, 60);

    doc.text('Services:', 20, 80);
    services.forEach((service, i) => {
      doc.text(`${i + 1}. ${service.name} - ₹${service.charge}`, 30, 90 + i * 10);
    });

    doc.save('quotation.pdf');
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
              className={clientInfo[field] ? 'filled' : ''}
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
              placeholder=""
              className={newService.name ? 'filled' : ''}
            />
            <label className={newService.name ? 'filled' : ''}>Service</label>
          </div>

          <div className="input-group quarter">
            <input
              type="number"
              name="charge"
              value={newService.charge}
              onChange={handleServiceChange}
              placeholder=""
              className={newService.charge ? 'filled' : ''}
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
                  <div>
                    <button onClick={() => removeService(i)} className="remove-btn">❌</button>
                  </div>
                </>
              ) : (
                <>
                  <input value={s.name} onChange={(e) => {
                    const updated = [...services];
                    updated[i].name = e.target.value;
                    setServices(updated);
                  }} />
                  <input type="number" value={s.charge} onChange={(e) => {
                    const updated = [...services];
                    updated[i].charge = e.target.value;
                    setServices(updated);
                  }} />
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
