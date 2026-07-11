import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api/admin';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: 2, price_per_month: 5000 });
  const [newBed, setNewBed] = useState({ room_id: '', bed_number: '' });

  const fetchData = async () => {
    try {
      const [roomsRes, allocsRes] = await Promise.all([
        fetch(`${API_BASE}/rooms`),
        fetch(`${API_BASE}/allocations`)
      ]);
      const roomsData = await roomsRes.json();
      const allocsData = await allocsRes.json();
      setRooms(roomsData);
      setAllocations(allocsData);
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoom)
    });
    setNewRoom({ room_number: '', capacity: 2, price_per_month: 5000 });
    fetchData();
  };

  const handleAddBed = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/beds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newBed, room_id: parseInt(newBed.room_id) })
    });
    setNewBed({ room_id: '', bed_number: '' });
    fetchData();
  };

  const handleGenerateBills = async () => {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    await fetch(`${API_BASE}/billing/generate?month=${month}`, { method: 'POST' });
    alert(`Successfully generated bills for ${month}`);
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex-between">
        <h2>Overview</h2>
        <button className="primary-btn" onClick={handleGenerateBills}>Generate Monthly Bills</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Rooms</h3>
          <div className="value">{rooms.length}</div>
        </div>
        <div className="dashboard-card">
          <h3>Active Allocations</h3>
          <div className="value">{allocations.filter(a => a.end_date === null).length}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Add Room */}
        <div className="glass-card" style={{ width: '100%', maxWidth: 'none', margin: 0, padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{marginBottom: '1rem'}}>Add New Room</h3>
          <form onSubmit={handleAddRoom}>
            <div className="form-group">
              <label>Room Number</label>
              <input type="text" className="form-control" value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} required/>
            </div>
            <div className="flex-gap">
              <div className="form-group" style={{flex: 1}}>
                <label>Capacity</label>
                <input type="number" className="form-control" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})} required/>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Price/Month ($)</label>
                <input type="number" className="form-control" value={newRoom.price_per_month} onChange={e => setNewRoom({...newRoom, price_per_month: parseFloat(e.target.value)})} required/>
              </div>
            </div>
            <button type="submit" className="success-btn" style={{width: '100%'}}>Save Room</button>
          </form>
        </div>

        {/* Add Bed */}
        <div className="glass-card" style={{ width: '100%', maxWidth: 'none', margin: 0, padding: '1.5rem', textAlign: 'left' }}>
          <h3 style={{marginBottom: '1rem'}}>Add Bed to Room</h3>
          <form onSubmit={handleAddBed}>
            <div className="form-group">
              <label>Select Room</label>
              <select className="form-control" value={newBed.room_id} onChange={e => setNewBed({...newBed, room_id: e.target.value})} required style={{backgroundColor: 'rgba(30, 41, 59, 0.9)', color: 'inherit'}}>
                <option value="" disabled>Select a room</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.room_number}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Bed Identifier</label>
              <input type="text" className="form-control" placeholder="e.g. Bed A, Window Side" value={newBed.bed_number} onChange={e => setNewBed({...newBed, bed_number: e.target.value})} required/>
            </div>
            <button type="submit" className="success-btn" style={{width: '100%', marginTop: 'auto'}}>Save Bed</button>
          </form>
        </div>
      </div>

      <h2 style={{marginTop: '2rem'}}>Recent Allocations</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Bed ID</th>
              <th>Start Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allocations.length === 0 ? <tr><td colSpan="5" style={{textAlign: 'center'}}>No allocations found</td></tr> : null}
            {allocations.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>Student {a.student_id}</td>
                <td>Bed {a.bed_id}</td>
                <td>{new Date(a.start_date).toLocaleDateString()}</td>
                <td>
                  {a.end_date === null ? <span className="badge success">Active</span> : <span className="badge">Ended</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
