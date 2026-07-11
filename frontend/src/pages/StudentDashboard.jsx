import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api/student';

export default function StudentDashboard({ userId }) {
  const [availableBeds, setAvailableBeds] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // printable bill modal
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchData = async () => {
    try {
      const [bedsRes, billsRes] = await Promise.all([
        fetch(`${API_BASE}/available-beds`),
        fetch(`${API_BASE}/bills/${userId}`)
      ]);
      setAvailableBeds(await bedsRes.json());
      setBills(await billsRes.json());
    } catch (err) {
      console.error("Error fetching student data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleBook = async (bedId) => {
    if (!window.confirm("Are you sure you want to book this bed? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: userId, bed_id: bedId })
      });
      const data = await res.json();
      if (!res.ok) alert(data.detail || 'Booking failed');
      else {
        alert('Booking successful!');
        fetchData();
      }
    } catch (err) {
      alert('Error booking bed');
    }
  };

  if (loading) return <div>Loading portal...</div>;

  return (
    <div>
      <h2>Available Beds</h2>
      <div className="dashboard-grid">
        {availableBeds.length === 0 && <p style={{gridColumn: '1 / -1', color: '#94a3b8'}}>No beds available currently.</p>}
        {availableBeds.map(bed => (
          <div className="dashboard-card" key={bed.bed_id}>
            <h3>Room {bed.room_number}</h3>
            <div className="value" style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '0.2rem'}}>
              {bed.bed_number}
            </div>
            <div className="flex-between">
              <span className="badge warning">${bed.price}/mon</span>
              <button className="primary-btn" onClick={() => handleBook(bed.bed_id)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{marginTop: '3rem', marginBottom: '1rem'}}>My Bills</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount ($)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? <tr><td colSpan="4" style={{textAlign: 'center'}}>No bills generated yet</td></tr> : null}
            {bills.map(bill => (
              <tr key={bill.id}>
                <td><strong>{bill.month}</strong></td>
                <td>${bill.amount.toFixed(2)}</td>
                <td>
                  {bill.is_paid ? <span className="badge success">Paid</span> : <span className="badge danger">Unpaid</span>}
                </td>
                <td>
                  <button className="secondary-btn" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}
                    onClick={() => setSelectedBill(bill)}
                  >View & Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print Bill Modal */}
      {selectedBill && (
        <div className="modal-overlay">
          <div className="modal-content printable-area" style={{background: 'white', color: 'black', width: '90%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}>
            <button className="modal-close no-print" onClick={() => setSelectedBill(null)} style={{color: '#64748b', fontSize: '2rem', cursor: 'pointer', border: 'none', background: 'transparent'}}>&times;</button>
            <div style={{padding: '1rem'}}>
              <h1 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', textAlign: 'center', color: '#0f172a', margin: 0}}>Hostel Monthly Invoice</h1>
              <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <p style={{margin: '0.5rem 0'}}><strong>Billed To:</strong> Student ID {selectedBill.student_id}</p>
                  <p style={{margin: '0.5rem 0'}}><strong>Month:</strong> {selectedBill.month}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{margin: '0.5rem 0'}}><strong>Invoice #:</strong> INV-{selectedBill.id}</p>
                  <p style={{margin: '0.5rem 0'}}><strong>Date Generated:</strong> {new Date(selectedBill.generated_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{marginTop: '3rem'}}>
                <table style={{color: 'black', width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{background: '#f8fafc', color: '#475569'}}>
                      <th style={{padding: '1rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1'}}>Description</th>
                      <th style={{padding: '1rem', textAlign: 'right', borderBottom: '2px solid #cbd5e1'}}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{padding: '1.5rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#1e293b'}}>Hostel Room Rent - {selectedBill.month}</td>
                      <td style={{padding: '1.5rem 1rem', textAlign: 'right', borderBottom: '1px solid #e2e8f0', color: '#1e293b'}}>${selectedBill.amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{fontWeight: 'bold', paddingTop: '1.5rem', paddingLeft: '1rem', color: '#0f172a', fontSize: '1.2rem'}}>Total Due</td>
                      <td style={{textAlign: 'right', fontWeight: 'bold', paddingTop: '1.5rem', paddingRight: '1rem', color: '#0f172a', fontSize: '1.2rem'}}>${selectedBill.amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{marginTop: '4rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem'}}>
                <p>Please pay within 7 days of invoice date.</p>
                <div style={{marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center'}} className="no-print">
                  <button className="primary-btn" onClick={() => window.print()}>🖨️ Print Bill</button>
                  <button className="secondary-btn" onClick={() => setSelectedBill(null)} style={{color: 'black', borderColor: '#cbd5e1', background: 'transparent'}}>Close</button>
                </div>
              </div>
            </div>
            {/* CSS specific for hiding elements during print */}
            <style>{`
              @media print {
                .no-print { display: none !important; }
                .modal-close { display: none !important; }
                table td { color: black !important; }
                table th { color: black !important; background: transparent !important; }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
