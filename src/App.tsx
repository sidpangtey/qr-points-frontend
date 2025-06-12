import React, { useState, useEffect, createContext, useContext } from 'react';

// Context definition
const AppContext = createContext({
  user: null as any,
  setUser: (user: any) => {},
  currentPage: 'login',
  setCurrentPage: (page: string) => {}
});

const API_BASE = 'https://qr-point-system.onrender.com';

function Login() {
  const { setUser, setCurrentPage } = useContext(AppContext);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'Admin' | 'Scanner'>('Scanner');

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Success → set user and navigate
      setUser({ email: data.user.email, role: data.user.role });
      setCurrentPage(data.user.role === 'admin' ? 'admin-dashboard' : 'scanner-scan');
      alert('Login successful!');
    } catch (err: any) {
      alert(`Login error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <label>Email:</label>
      <input
        type="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <label>Role:</label>
      <select
        value={loginRole}
        onChange={(e) => setLoginRole(e.target.value as 'Admin' | 'Scanner')}
      >
        <option value="Admin">Admin</option>
        <option value="Scanner">Scanner</option>
      </select>
      <button onClick={handleLogin}>Login</button>
      <br />
      <br />
      <button onClick={() => setCurrentPage('signup')}>Go to Signup</button>
    </div>
  );
}

function Signup() {
  const { setCurrentPage } = useContext(AppContext);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'Admin' | 'Scanner'>('Scanner');

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      alert('Please enter all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: signupRole.toLowerCase() // Backend expects 'admin' | 'scanner'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      alert('Account created! You can now log in.');
      setCurrentPage('login');
    } catch (err: any) {
      alert(`Signup error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <label>Name:</label>
      <input
        type="text"
        value={signupName}
        onChange={(e) => setSignupName(e.target.value)}
      />
      <label>Email:</label>
      <input
        type="email"
        value={signupEmail}
        onChange={(e) => setSignupEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={signupPassword}
        onChange={(e) => setSignupPassword(e.target.value)}
      />
      <label>Role:</label>
      <select
        value={signupRole}
        onChange={(e) => setSignupRole(e.target.value as 'Admin' | 'Scanner')}
      >
        <option value="Admin">Admin</option>
        <option value="Scanner">Scanner</option>
      </select>
      <button onClick={handleSignup}>Sign Up</button>
      <br />
      <br />
      <button onClick={() => setCurrentPage('login')}>Back to Login</button>
    </div>
  );
}

function AdminDashboard() {
  const { setCurrentPage } = useContext(AppContext);
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'https://qr-point-system.onrender.com';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching users:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch users on mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

       <button onClick={() => setCurrentPage('admin-qrcodes')} style={{ marginBottom: '1rem' }}>
        View QR Codes
      </button>

      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function ScannerScan() {
  const { user } = useContext(AppContext);
  const [qrCodeId, setQrCodeId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://qr-point-system.onrender.com';

  const handleScan = async () => {
    if (!qrCodeId) {
      alert('Please enter a QR Code ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeId: qrCodeId,
          scannerEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setMessage(data.message || 'Scan successful!');
      setQrCodeId('');
    } catch (err: any) {
      console.error('Scan error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Scanner - Scan Page</h2>

      <label>Enter QR Code ID:</label>
      <input
        type="text"
        value={qrCodeId}
        onChange={(e) => setQrCodeId(e.target.value)}
      />
      <button onClick={handleScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan'}
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

function AdminQRCodes() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [giveTo, setGiveTo] = useState<'owner' | 'scanner' | 'both'>('both');
  const [points, setPoints] = useState<number>(0);

  const API_BASE = 'https://qr-point-system.onrender.com';

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/qrcodes`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch QR Codes');
      }

      setQrCodes(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching QR Codes:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const handleCreateQRCode = async () => {
    if (!name) {
      alert('Please enter QR Code name');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/qrcodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          tags: tags.split(',').map(tag => tag.trim()),
          giveTo,
          points
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create QR Code');
      }

      alert('QR Code created successfully!');
      // Clear form
      setName('');
      setTags('');
      setGiveTo('both');
      setPoints(0);
      setShowForm(false);

      // Refresh list
      fetchQRCodes();

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>QR Codes</h2>

      {/* Create QR Code button */}
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Hide Create Form' : 'Create QR Code'}
      </button>

      {/* Create QR Code form */}
      {showForm && (
        <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
          <h3>Create New QR Code</h3>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Tags (comma-separated):</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />

          <label>Give To:</label>
          <select value={giveTo} onChange={(e) => setGiveTo(e.target.value as 'owner' | 'scanner' | 'both')}>
            <option value="owner">Owner</option>
            <option value="scanner">Scanner</option>
            <option value="both">Both</option>
          </select>

          <label>Points:</label>
          <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} />

          <br />
          <button onClick={handleCreateQRCode}>Submit</button>
        </div>
      )}

      {loading && <p>Loading QR Codes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>QR Code ID</th>
            <th>Tags</th>
            <th>Give To</th>
            <th>Points</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {qrCodes.map((qr: any) => (
            <tr key={qr._id}>
              <td>{qr.name}</td>
              <td>{qr.qrCodeId}</td>
              <td>{qr.tags?.join(', ')}</td>
              <td>{qr.giveTo}</td>
              <td>{qr.points}</td>
              <td>{qr.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminNavBar() {
  const { setCurrentPage, setUser } = useContext(AppContext);

  return (
    <div style={{
      background: '#333',
      color: '#fff',
      padding: '10px',
      marginBottom: '20px',
      display: 'flex',
      gap: '10px'
    }}>
      <button onClick={() => setCurrentPage('admin-dashboard')} style={{ color: 'white' }}>
        Dashboard
      </button>
      <button onClick={() => setCurrentPage('admin-qrcodes')} style={{ color: 'white' }}>
        QR Codes
      </button>
      <button onClick={() => {
        setUser(null);
        setCurrentPage('login');
      }} style={{ marginLeft: 'auto', color: 'white' }}>
        Logout
      </button>
    </div>
  );
}

function ScannerNavBar() {
  const { setCurrentPage, setUser } = useContext(AppContext);

  return (
    <div style={{
      background: '#333',
      color: '#fff',
      padding: '10px',
      marginBottom: '20px',
      display: 'flex',
      gap: '10px'
    }}>
      <button onClick={() => setCurrentPage('scanner-scan')} style={{ color: 'white' }}>
        Scan QR Code
      </button>
      <button onClick={() => setCurrentPage('scanner-points')} style={{ color: 'white' }}>
        My Points
      </button>
      <button onClick={() => {
        setUser(null);
        setCurrentPage('login');
      }} style={{ marginLeft: 'auto', color: 'white' }}>
        Logout
      </button>
    </div>
  );
}

function ScannerPoints() {
  const { scanHistory, user } = useContext(AppContext);

  // Calculate total points
  const totalPoints = scanHistory.reduce((sum, scan) => sum + scan.points, 0);

  return (
    <div className="container">
      <h2>My Points</h2>

      <div style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <h3>Total Points: {totalPoints}</h3>
      </div>

      <h3>Recent Scans:</h3>
      <table border={1} cellPadding={8} style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>QR Code ID</th>
            <th>Points</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {scanHistory.slice(0, 10).map((scan: any) => (
            <tr key={scan.id}>
              <td>{scan.qrCodeId}</td>
              <td>{scan.points}</td>
              <td>{new Date(scan.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}






export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('login');

  const contextValue = {
    user,
    setUser,
    currentPage,
    setCurrentPage
  };

const renderPage = () => {
  // If user is not logged in
  if (currentPage === 'signup') return <Signup />;
  if (!user) return <Login />;

  // Admin flow
  if (user.role === 'admin') {
    return (
      <div>
        <AdminNavBar />
        {currentPage === 'admin-dashboard' && <AdminDashboard />}
        {currentPage === 'admin-qrcodes' && <AdminQRCodes />}
      </div>
    );
  }

  // Scanner flow
  if (user.role === 'scanner') {
    return (
      <div>
        <ScannerNavBar />
        {currentPage === 'scanner-scan' && <ScannerScan />}
        {currentPage === 'scanner-points' && <ScannerPoints />}
      </div>
    );
  }

  // Default fallback (should not happen)
  return <Login />;
};



  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f9f9f9' }}>
        {renderPage()}
      </div>
    </AppContext.Provider>
  );
}
