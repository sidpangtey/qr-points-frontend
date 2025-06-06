import React, { useState, createContext, useContext } from 'react';

// Context definition
const AppContext = createContext({
  user: null as any,
  setUser: (user: any) => {},
  currentPage: 'login',
  setCurrentPage: (page: string) => {}
});

function Login() {
  const { setUser, setCurrentPage } = useContext(AppContext);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState<'Admin' | 'Scanner'>('Scanner');

  const handleLogin = () => {
    if (!loginEmail) {
      alert('Please enter your email');
      return;
    }
    setUser({ email: loginEmail, role: loginRole });
    setCurrentPage(loginRole === 'Admin' ? 'admin-dashboard' : 'scanner-scan');
    alert('Login successful!');
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
      <br />
      <label>Role:</label>
      <select
        value={loginRole}
        onChange={(e) => setLoginRole(e.target.value as 'Admin' | 'Scanner')}
      >
        <option value="Admin">Admin</option>
        <option value="Scanner">Scanner</option>
      </select>
      <br />
      <button onClick={handleLogin}>Login</button>
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
    if (!user) return <Login />;
    if (user.role === 'Admin') return <AdminDashboard />;
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
