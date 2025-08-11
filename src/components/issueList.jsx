// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import './issueList.css';
// import { useNavigate } from 'react-router-dom';

// const defaultMetadata = {
//   relatedToService: false,
//   pricingIssue: false,
//   reviewTaken: false,
//   warrantyOffered: '',
//   workStatus: '',
//   allotedTechnician: '',
// };

// function IssueList() {
//   const [issues, setIssues] = useState([]);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [metadataForm, setMetadataForm] = useState(defaultMetadata);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();
  

//    const handleGenerateQuotation = (issue) => {
//     const phoneValid = isValidPhone(issue.phone);
//     if (!phoneValid) return alert("Phone number must be 10 digits");

//     const address = `${issue.addressLine1 || ''}, ${issue.addressLine2 || ''}, ${issue.addressLine3 || ''}`;
//     navigate('/quotation', {
//       state: {
//         name: issue.name,
//         phone: `+91${issue.phone}`,
//         address: address,
//         issueNumber: issue.issueNumber,
//       }
//     });
//   };

//   useEffect(() => {
//     const fetchIssues = async () => {
//       try {
//         const q = query(collection(db, 'issues'), orderBy('timestamp', 'desc'));
//         const snapshot = await getDocs(q);
//         const data = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//           metadata: doc.data().metadata || defaultMetadata,
//         }));
//         setIssues(data);
//       } catch (err) {
//         console.error('Error fetching issues:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchIssues();
//   }, []);

//   const handleEditClick = (issue) => {
//     setSelectedIssue(issue);
//     setMetadataForm(issue.metadata || defaultMetadata);
//   };

//   const handleToggle = (field, value) => {
//     setMetadataForm(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleMetadataChange = (e) => {
//     const { name, value } = e.target;
//     setMetadataForm(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveMetadata = async () => {
//     try {
//       const issueRef = doc(db, 'issues', selectedIssue.id);
//       await updateDoc(issueRef, { metadata: metadataForm });
//       const updatedIssues = issues.map(issue =>
//         issue.id === selectedIssue.id ? { ...issue, metadata: metadataForm } : issue
//       );
//       setIssues(updatedIssues);
//       setSelectedIssue(null);
//     } catch (error) {
//       console.error('Error updating metadata:', error);
//     }
//   };



//   const filteredIssues = issues.filter((issue) =>
//   issue.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   issue.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   issue.address?.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   const isValidPhone = (phone) => {
//     return /^\d{10}$/.test(phone);
//   };

//   if (loading) return <p className="loading-text">Loading issues...</p>;

//   return (
//     <div className="issue-list-container">
     
//       {selectedIssue ? (
//         <div className="fullscreen-card">
//           <h2>Issue #{selectedIssue.issueNumber}</h2>
//           <p><strong>Name:</strong> {selectedIssue.name}</p>
//           <p><strong>Phone:</strong> {selectedIssue.phone}</p>
//           <p><strong>Work:</strong> {selectedIssue.natureOfWork}</p>
//           <p><strong>Category:</strong> {selectedIssue.category}</p>
//           <p><strong>Description:</strong> {selectedIssue.description}</p>

//           <div className="metadata-form">
//             {['relatedToService', 'pricingIssue', 'reviewTaken'].map((field) => (
//               <div key={field} className="button-toggle-group">
//                 <label>{field === 'relatedToService' ? 'Related to Service' : field === 'pricingIssue' ? 'Pricing Issue' : 'Review Taken'}</label>
//                 <div className="yes-no-buttons">
//                   <button
//                     type="button"
//                     className={metadataForm[field] === true ? 'yes active' : 'yes'}
//                     onClick={() => handleToggle(field, true)}
//                   >Yes</button>
//                   <button
//                     type="button"
//                     className={metadataForm[field] === false ? 'no active' : 'no'}
//                     onClick={() => handleToggle(field, false)}
//                   >No</button>
//                 </div>
//               </div>
//             ))}

//             <label>
//               Warranty Offered:
//               <input type="text" name="warrantyOffered" value={metadataForm.warrantyOffered} onChange={handleMetadataChange} />
//             </label>

//             <label>
//               Work Status:
//               <select name="workStatus" value={metadataForm.workStatus} onChange={handleMetadataChange}>
//                 <option value="">Select</option>
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </label>

//             <label>
//               Allotted Technician:
//               <input
//                 type="text"
//                 name="allotedTechnician"
//                 value={metadataForm.allotedTechnician}
//                 onChange={handleMetadataChange}
//                 placeholder="Enter technician name"
//               />
//             </label>
//           </div>

//           <div className="edit-actions">
//             <button onClick={handleSaveMetadata} className="save-btn">Save</button>
//             <button onClick={() => setSelectedIssue(null)} className="back-btn">Back</button>
//           </div>
//         </div>
//       ) : (
//           <div className="grid-layout">
//             <div className="search-bar-container">
// <input
//   type="text"
//   placeholder="Search by name, phone, or address..."
//   value={searchTerm}
//   onChange={(e) => setSearchTerm(e.target.value)}
//   className="search-bar"
// />
// </div>

//           {issues.map((issue) => {
//             const phoneValid = isValidPhone(issue.phone);
//             const phone = phoneValid ? `+91${issue.phone}` : '';

//             return (
//               <div key={issue.id} className="issue-card" onClick={() => handleEditClick(issue)}>
//                 <h3>Issue #{issue.issueNumber}</h3>
//                 <p><strong>Name:</strong> {issue.name}</p>
//                 <p><strong>Category:</strong> {issue.category}</p>
//                 <p><strong>Work:</strong> {issue.natureOfWork}</p>

//                 <p>
//                   <strong>Status:</strong>{' '}
//                   <span className={`status-label ${issue.metadata?.workStatus?.toLowerCase().replace(/\s/g, '-') || ''}`}>
//                     {issue.metadata?.workStatus || 'N/A'}
//                   </span>
//                 </p>

//                 <p><strong>Warranty:</strong> {issue.metadata?.warrantyOffered || 'N/A'}</p>

//                 <p>
//                   <strong>Review:</strong>{' '}
//                   <span className={`review-label ${issue.metadata?.reviewTaken ? 'review-yes' : 'review-no'}`}>
//                     {issue.metadata?.reviewTaken ? 'Yes' : 'No'}
//                   </span>
//                 </p>

//                 <p><strong>Related:</strong> {issue.metadata?.relatedToService ? 'Yes' : 'No'}</p>
//                 <p><strong>Pricing Issue:</strong> {issue.metadata?.pricingIssue ? 'Yes' : 'No'}</p>
//                 <p><strong>Technician:</strong> {issue.metadata?.allotedTechnician || 'N/A'}</p>

//                 <div className="action-buttons">
//                   {phoneValid && (
//                     <>
//                       <a href={`tel:${phone}`} className="action-btn call-btn">📞 Call</a>
//                       <a
//                         href={`https://wa.me/${phone}?text=${encodeURIComponent(
//                           `Hello ${issue.name},\n\nRegarding your issue:\nCategory: ${issue.category}\nWork: ${issue.natureOfWork}\nStatus: ${issue.metadata?.workStatus || 'Pending'}`
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="action-btn whatsapp-btn"
//                       >
//                         💬 WhatsApp
//                       </a>
//                     </>
//                   )}

//                   <a
//                     href={`https://wa.me/?text=${encodeURIComponent(
//                       `🛠️ *Issue #${issue.issueNumber}*\n` +
//                       `👤 Name: ${issue.name}\n` +
//                       `📞 Phone: ${phone || 'Invalid'}\n` +
//                       `📍 Address:\n${issue.addressLine1 || ''}\n${issue.addressLine2 || ''}\n${issue.addressLine3 || ''}\n` +
//                       `📝 Work: ${issue.natureOfWork}\n` +
//                       `📋 Description: ${issue.description || 'N/A'}\n` +
//                       `✅ Status: ${issue.metadata?.workStatus || 'Pending'}\n` +
//                       `🔁 Warranty: ${issue.metadata?.warrantyOffered || 'N/A'}\n` +
//                       `⭐ Review Taken: ${issue.metadata?.reviewTaken ? 'Yes' : 'No'}\n`
//                     )}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="action-btn share-btn"
//                   >
//                     📤 Share Issue
//                   </a>
//                 </div>
//                 <button onClick={() => handleGenerateQuotation(issue)}>Generate Quotation</button>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default IssueList;



import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './issueList.css';
import { useNavigate } from 'react-router-dom';

const defaultMetadata = {
  relatedToService: false,
  pricingIssue: false,
  reviewTaken: false,
  warrantyOffered: '',
  workStatus: '',
  allotedTechnician: '',
};

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [metadataForm, setMetadataForm] = useState(defaultMetadata);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();

  const handleGenerateQuotation = (issue) => {
    const phoneValid = isValidPhone(issue.phone);
    if (!phoneValid) return alert("Phone number must be 10 digits");

    const address = `${issue.addressLine1 || ''}, ${issue.addressLine2 || ''}, ${issue.addressLine3 || ''}`;
    navigate('/quotation', {
      state: {
        name: issue.name,
        phone: `+91${issue.phone}`,
        address: address,
        issueNumber: issue.issueNumber,
      }
    });
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const q = query(collection(db, 'issues'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          metadata: doc.data().metadata || defaultMetadata,
        }));
        setIssues(data);
      } catch (err) {
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // ✅ Debounce logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 300); // 300ms delay
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleEditClick = (issue) => {
    setSelectedIssue(issue);
    setMetadataForm(issue.metadata || defaultMetadata);
  };

  const handleToggle = (field, value) => {
    setMetadataForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadataForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveMetadata = async () => {
    try {
      const issueRef = doc(db, 'issues', selectedIssue.id);
      await updateDoc(issueRef, { metadata: metadataForm });
      const updatedIssues = issues.map(issue =>
        issue.id === selectedIssue.id ? { ...issue, metadata: metadataForm } : issue
      );
      setIssues(updatedIssues);
      setSelectedIssue(null);
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
  };

  // ✅ Filter with debounced search term
  const filteredIssues = issues.filter((issue) => {
    const search = debouncedSearch;
    const address = `${issue.addressLine1 || ''} ${issue.addressLine2 || ''} ${issue.addressLine3 || ''}`.toLowerCase();
    return (
      issue.name?.toLowerCase().includes(search) ||
      issue.phone?.toString().toLowerCase().includes(search) ||
      address.includes(search) ||
      issue.natureOfWork?.toLowerCase().includes(search) ||
      issue.metadata?.workStatus?.toLowerCase().includes(search)
    );
  });
  
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  if (loading) return <p className="loading-text">Loading issues...</p>;

  return (
    <div className="issue-list-container">
      {selectedIssue ? (
        <div className="fullscreen-card">
          <h2>Issue #{selectedIssue.issueNumber}</h2>
          <p><strong>Name:</strong> {selectedIssue.name}</p>
          <p><strong>Phone:</strong> {selectedIssue.phone}</p>
          <p><strong>Work:</strong> {selectedIssue.natureOfWork}</p>
          <p><strong>Category:</strong> {selectedIssue.category}</p>
          <p><strong>Description:</strong> {selectedIssue.description}</p>

          <div className="metadata-form">
            {['relatedToService', 'pricingIssue', 'reviewTaken'].map((field) => (
              <div key={field} className="button-toggle-group">
                <label>{field === 'relatedToService' ? 'Related to Service' : field === 'pricingIssue' ? 'Pricing Issue' : 'Review Taken'}</label>
                <div className="yes-no-buttons">
                  <button
                    type="button"
                    className={metadataForm[field] === true ? 'yes active' : 'yes'}
                    onClick={() => handleToggle(field, true)}
                  >Yes</button>
                  <button
                    type="button"
                    className={metadataForm[field] === false ? 'no active' : 'no'}
                    onClick={() => handleToggle(field, false)}
                  >No</button>
                </div>
              </div>
            ))}

            <label>
              Warranty Offered:
              <input type="text" name="warrantyOffered" value={metadataForm.warrantyOffered} onChange={handleMetadataChange} />
            </label>

            <label>
              Work Status:
              <select name="workStatus" value={metadataForm.workStatus} onChange={handleMetadataChange}>
                <option value="">Select</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>

            <label>
              Allotted Technician:
              <input
                type="text"
                name="allotedTechnician"
                value={metadataForm.allotedTechnician}
                onChange={handleMetadataChange}
                placeholder="Enter technician name"
              />
            </label>
          </div>

          <div className="edit-actions">
            <button onClick={handleSaveMetadata} className="save-btn">Save</button>
            <button onClick={() => setSelectedIssue(null)} className="back-btn">Back</button>
          </div>
        </div>
      ) : (
          <>
            <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search by name, phone, address, work, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>
        <div className="grid-layout">
          

          {filteredIssues.map((issue) => {
            const phoneValid = isValidPhone(issue.phone);
            const phone = phoneValid ? `+91${issue.phone}` : '';

            return (
              <div key={issue.id} className="issue-card" onClick={() => handleEditClick(issue)}>
                <h3>Issue #{issue.issueNumber}</h3>
                <p><strong>Name:</strong> {issue.name}</p>
                <p><strong>Category:</strong> {issue.category}</p>
                <p><strong>Work:</strong> {issue.natureOfWork}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-label ${issue.metadata?.workStatus?.toLowerCase().replace(/\s/g, '-') || ''}`}>
                    {issue.metadata?.workStatus || 'N/A'}
                  </span>
                </p>

                <p><strong>Warranty:</strong> {issue.metadata?.warrantyOffered || 'N/A'}</p>

                <p>
                  <strong>Review:</strong>{' '}
                  <span className={`review-label ${issue.metadata?.reviewTaken ? 'review-yes' : 'review-no'}`}>
                    {issue.metadata?.reviewTaken ? 'Yes' : 'No'}
                  </span>
                </p>

                <p><strong>Related:</strong> {issue.metadata?.relatedToService ? 'Yes' : 'No'}</p>
                <p><strong>Pricing Issue:</strong> {issue.metadata?.pricingIssue ? 'Yes' : 'No'}</p>
                <p><strong>Technician:</strong> {issue.metadata?.allotedTechnician || 'N/A'}</p>

                <div className="action-buttons">
                  {phoneValid && (
                    <>
                      <a href={`tel:${phone}`} className="action-btn call-btn">📞 Call</a>
                      <a
                        href={`https://wa.me/${phone}?text=${encodeURIComponent(
                          `Hello ${issue.name},\n\nRegarding your issue:\nCategory: ${issue.category}\nWork: ${issue.natureOfWork}\nStatus: ${issue.metadata?.workStatus || 'Pending'}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn whatsapp-btn"
                      >
                        💬 WhatsApp
                      </a>
                    </>
                  )}

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🛠️ *Issue #${issue.issueNumber}*\n` +
                      `👤 Name: ${issue.name}\n` +
                      `📞 Phone: ${phone || 'Invalid'}\n` +
                      `📍 Address:\n${issue.addressLine1 || ''}\n${issue.addressLine2 || ''}\n${issue.addressLine3 || ''}\n` +
                      `📝 Work: ${issue.natureOfWork}\n` +
                      `📋 Description: ${issue.description || 'N/A'}\n` +
                      `✅ Status: ${issue.metadata?.workStatus || 'Pending'}\n` +
                      `🔁 Warranty: ${issue.metadata?.warrantyOffered || 'N/A'}\n` +
                      `⭐ Review Taken: ${issue.metadata?.reviewTaken ? 'Yes' : 'No'}\n`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn share-btn"
                  >
                    📤 Share Issue
                  </a>
                </div>
                <button onClick={() => handleGenerateQuotation(issue)}>Generate Quotation</button>
              </div>
            );
          })}
            </div>
            </>
      )}
    </div>
  );
}

export default IssueList;
