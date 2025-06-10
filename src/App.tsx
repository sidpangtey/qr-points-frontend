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
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Basic dashboard - more coming soon!</p>
    </div>
  );
}

function ScannerScan() {
  return (
    <div className="container">
      <h2>Scanner - Scan Page</h2>
      <p>Basic scanner page - more coming soon!</p>
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
    if (currentPage === 'signup') return <Signup />;
    if (!user) return <Login />;
    if (user.role === 'admin') return <AdminDashboard />;
    else return <ScannerScan />;
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f9f9f9' }}>
        {renderPage()}
      </div>
    </AppContext.Provider>
  );
}
