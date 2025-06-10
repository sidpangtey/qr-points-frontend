import React, { useState, createContext, useContext } from 'react';

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

      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '20px' }}>
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

