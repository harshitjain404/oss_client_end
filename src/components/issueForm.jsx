import { useState, useEffect } from 'react';
import './issueForm.css';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function IssueForm() {
  const [showToast, setShowToast] = useState(false);
  const [issueNumber, setIssueNumber] = useState(null);
  const [issueDate, setIssueDate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    natureOfWork: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    category: '',
    description: '',
    suitableTiming: '',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '',
    photo: null,
  });

  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchIssueCount = async () => {
      const snapshot = await getDocs(collection(db, 'issues'));
      setIssueNumber(snapshot.size + 1);
      setIssueDate(new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }));
    };
    fetchIssueCount();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'phone') {
      if (!/^\d{0,10}$/.test(value)) return;
      setPhoneError(value.length === 10 ? '' : 'Phone number must be exactly 10 digits');
    }
    setFormData({
      ...formData,
      [name]: name === 'photo' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }

    const message = `New Issue Reported:
Issue No: ${issueNumber}
Issue Date: ${issueDate}
Name: ${formData.name}
Phone: +91${formData.phone}
Nature of Work: ${formData.natureOfWork}
Email: ${formData.email}
Address:
Bldg: ${formData.addressLine1}
Road: ${formData.addressLine2}
Area: ${formData.addressLine3}
Category: ${formData.category}
Description: ${formData.description}
Preferred Timing: ${formData.suitableTiming} at ${formData.preferredTime}
Preferred Date: ${formData.preferredDate}`;

    try {
      await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      await addDoc(collection(db, 'issues'), {
        ...formData,
        phone: formData.phone,
        timestamp: new Date(),
        issueNumber,
      });

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setFormData({
        name: '',
        phone: '',
        natureOfWork: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        category: '',
        description: '',
        suitableTiming: '',
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: '',
        photo: null,
      });
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('Failed to submit issue.');
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 20; hour++) {
      ['00', '30'].forEach((minute) => {
        const hr = hour < 10 ? `0${hour}` : `${hour}`;
        times.push(`${hr}:${minute}`);
      });
    }
    return times;
  };

  return (
    <div className="form-container max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {issueNumber && (
        <div className="mb-4 text-sm font-semibold text-gray-600">Issue No: #{issueNumber}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="input-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`form-input ${formData.name ? 'filled' : ''}`}
          />
          <label className={formData.name ? 'filled' : ''}>Name</label>
        </div>

        {/* Phone with +91 prefix */}
        <div className="input-group phone-group">
          <div className="phone-prefix">+91</div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`form-input ${formData.phone ? 'filled' : ''}`}
            maxLength="10"
          />
          <label className={formData.phone ? 'filled' : ''}>Phone Number</label>
          {phoneError && <div className="error-text">{phoneError}</div>}
        </div>

        {/* Nature of Work */}
        <div className="input-group">
          <input
            type="text"
            name="natureOfWork"
            value={formData.natureOfWork}
            onChange={handleChange}
            required
            className={`form-input ${formData.natureOfWork ? 'filled' : ''}`}
          />
          <label className={formData.natureOfWork ? 'filled' : ''}>Nature of Work</label>
        </div>

        {/* Email */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${formData.email ? 'filled' : ''}`}
          />
          <label className={formData.email ? 'filled' : ''}>Email (optional)</label>
        </div>

        {/* Address Fields */}
        {[
          { label: 'Bldg', name: 'addressLine1' },
          { label: 'Road', name: 'addressLine2' },
          { label: 'Area', name: 'addressLine3' },
        ].map(({ label, name }) => (
          <div className="input-group" key={name}>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className={`form-input ${formData[name] ? 'filled' : ''}`}
            />
            <label className={formData[name] ? 'filled' : ''}>{label}</label>
          </div>
        ))}

        {/* Category */}
        <div className="input-group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-input ${formData.category ? 'filled' : ''}`}
          >
            <option value="" disabled>Select Category</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Other">Other</option>
          </select>
          <label className={formData.category ? 'filled' : ''}>Category</label>
        </div>

        {/* Description */}
        <div className="input-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={`form-input ${formData.description ? 'filled' : ''}`}
            rows="4"
          />
          <label className={formData.description ? 'filled' : ''}>Describe the issue</label>
        </div>

        {/* Preferred Time */}
        <div className="input-group">
          <select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className={`form-input ${formData.preferredTime ? 'filled' : ''}`}
          >
            <option value="" disabled>Select Preferred Time</option>
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <label className={formData.preferredTime ? 'filled' : ''}>Preferred Time</label>
        </div>

        {/* Preferred Date */}
        <div className="input-group">
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className={`form-input ${formData.preferredDate ? 'filled' : ''}`}
          />
          <label className={formData.preferredDate ? 'filled' : ''}>Preferred Date</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {showToast && <div className="toast">Issue submitted successfully!</div>}
    </div>
  );
}

export default IssueForm;
