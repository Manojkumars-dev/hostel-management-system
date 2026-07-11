import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

const DEMO_ACCOUNTS = [
  { role: 'admin',   email: 'admin@hostel.com',   password: 'admin123',   name: 'Demo Admin',   label: 'Admin' },
  { role: 'student', email: 'student@hostel.com',  password: 'student123', name: 'Demo Student', label: 'Student' },
];

function App() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState('initial');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (account) => {
    setRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password, role })
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else alert('Registration Failed: ' + data.detail);
    } catch { alert('Network error — make sure the backend is running.'); }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else alert('Login Failed: ' + data.detail);
    } catch { alert('Network error — make sure the backend is running.'); }
    setLoading(false);
  };

  const resetAuth = () => {
    setAuthState('initial');
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('student');
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="glass-card">
          <h1>Hostel Management</h1>
          <p>Secure Portal Login &amp; Registration</p>

          {authState === 'initial' && (
            <>
              <div className="button-group">
                <button className="primary-btn" onClick={() => setAuthState('login')}>Login to Portal</button>
                <button className="secondary-btn" onClick={() => setAuthState('register')}>Register New User</button>
              </div>

              {/* ── Demo accounts ── */}
              <div style={{marginTop:'1.75rem'}}>
                <p style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>
                  Quick Demo Login
                </p>
                <div style={{display:'flex',gap:'0.75rem',flexDirection:'column'}}>
                  {DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => { fillDemo(acc); setAuthState('login'); }}
                      style={{
                        display:'flex', alignItems:'center', justifyContent:'space-between',
                        background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.25)',
                        borderRadius:'10px', padding:'0.65rem 1rem', cursor:'pointer',
                        transition:'all 0.2s', color:'white', textAlign:'left'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(99,102,241,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(99,102,241,0.08)'}
                    >
                      <div>
                        <div style={{fontWeight:600, fontSize:'0.9rem'}}>{acc.label} Demo</div>
                        <div style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:'2px'}}>{acc.email}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'0.7rem',color:'#64748b'}}>password</div>
                        <div style={{fontSize:'0.8rem',color:'#a5b4fc',fontFamily:'monospace'}}>{acc.password}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <p style={{fontSize:'0.7rem',color:'#475569',marginTop:'0.6rem'}}>
                  * Register these accounts first if it is your first visit.
                </p>
              </div>
            </>
          )}

          {authState === 'register' && (
            <form onSubmit={handleRegister} style={{textAlign:'left'}}>
              <h3 style={{marginBottom:'1rem',color:'white',borderBottom:'1px solid rgba(255,255,255,0.1)',paddingBottom:'0.5rem'}}>New User Registration</h3>
              <div className="form-group">
                <label>Select Role</label>
                <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{backgroundColor:'rgba(30,41,59,1)'}}>
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="button-group" style={{marginTop:'1.5rem'}}>
                <button type="submit" className="success-btn" disabled={loading}>{loading ? 'Registering...' : 'Register & Login'}</button>
                <button type="button" className="secondary-btn" onClick={resetAuth}>Cancel</button>
              </div>
            </form>
          )}

          {authState === 'login' && (
            <form onSubmit={handleLogin} style={{textAlign:'left'}}>
              <h3 style={{marginBottom:'1rem',color:'white'}}>Portal Login</h3>

              {/* Demo hint banner */}
              <div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'8px',padding:'0.6rem 0.9rem',marginBottom:'1rem'}}>
                <p style={{fontSize:'0.72rem',color:'#a5b4fc',margin:0,marginBottom:'0.35rem',fontWeight:600}}>Demo Credentials</p>
                <div style={{display:'flex',gap:'1.5rem'}}>
                  {DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => fillDemo(acc)}
                      style={{background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'6px',padding:'0.3rem 0.65rem',cursor:'pointer',color:'#c7d2fe',fontSize:'0.72rem',transition:'background 0.2s'}}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(99,102,241,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(99,102,241,0.15)'}
                    >
                      Use {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Select Role</label>
                <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{backgroundColor:'rgba(30,41,59,1)'}}>
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="button-group" style={{marginTop:'1.5rem'}}>
                <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                <button type="button" className="secondary-btn" onClick={resetAuth}>Go Back</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="navbar">
          <h2>Hostel App - <span style={{color:'white'}}>{user.role === 'admin' ? 'Admin Portal' : 'Student Portal'}</span></h2>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',lineHeight:'1.2'}}>
              <span style={{color:'#94a3b8',fontSize:'0.875rem'}}>Logged in as <strong style={{color:'white'}}>{user.full_name}</strong></span>
              <span style={{color:'#64748b',fontSize:'0.75rem'}}>{user.email}</span>
            </div>
            <button onClick={() => { setUser(null); resetAuth(); }} className="logout-btn">Logout</button>
          </div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard userId={user.id} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
