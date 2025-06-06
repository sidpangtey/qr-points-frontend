import React, { useState, createContext, useContext } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Badge } from './components/ui/badge';
import { Switch } from './components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  BarChart3, 
  Settings, 
  Scan, 
  Star,
  Plus,
  UserCog,
  Menu,
  Moon,
  Sun,
  LogIn,
  UserPlus
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Scanner';
  points: number;
}

interface QRCodeData {
  id: string;
  name: string;
  qrCodeId: string;
  tags: string[];
  mode: 'Give to Owner' | 'Scanner' | 'Both';
  points: number;
  status: 'Active' | 'Inactive';
}

interface ScanHistory {
  id: string;
  qrCodeId: string;
  points: number;
  timestamp: Date;
}

interface AuthUser {
  email: string;
  role: 'Admin' | 'Scanner';
}

// Context
const AppContext = createContext<{
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  qrCodes: QRCodeData[];
  setQrCodes: (qrCodes: QRCodeData[]) => void;
  scanHistory: ScanHistory[];
  setScanHistory: (history: ScanHistory[]) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}>({
  user: null,
  setUser: () => {},
  currentPage: 'login',
  setCurrentPage: () => {},
  users: [],
  setUsers: () => {},
  qrCodes: [],
  setQrCodes: () => {},
  scanHistory: [],
  setScanHistory: () => {},
  darkMode: false,
  setDarkMode: () => {}
});

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Scanner', points: 150 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Scanner', points: 200 },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'Admin', points: 0 },
];

const mockQRCodes: QRCodeData[] = [
  { id: '1', name: 'Welcome Bonus', qrCodeId: 'QR001', tags: ['bonus', 'welcome'], mode: 'Give to Owner', points: 50, status: 'Active' },
  { id: '2', name: 'Daily Check-in', qrCodeId: 'QR002', tags: ['daily', 'checkin'], mode: 'Scanner', points: 10, status: 'Active' },
  { id: '3', name: 'Event Participation', qrCodeId: 'QR003', tags: ['event', 'participation'], mode: 'Both', points: 25, status: 'Inactive' },
];

// Components
function Login() {
  const { setUser, setCurrentPage, users, setUsers } = useContext(AppContext);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState<'Admin' | 'Scanner'>('Scanner');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<'Admin' | 'Scanner'>('Scanner');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!loginEmail) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!validateEmail(loginEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setUser({ email: loginEmail, role: loginRole });
    setCurrentPage(loginRole === 'Admin' ? 'admin-dashboard' : 'scanner-scan');
    toast.success('Login successful!');
  };

  const handleSignup = () => {
    // Validation
    if (!signupName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!signupEmail) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!validateEmail(signupEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Check for duplicate email
    const existingUser = users.find(user => user.email.toLowerCase() === signupEmail.toLowerCase());
    if (existingUser) {
      toast.error('Email already exists. Please use a different email.');
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: signupName.trim(),
      email: signupEmail.toLowerCase(),
      role: signupRole,
      points: 0
    };
    
    // Add to users list
    setUsers([...users, newUser]);
    
    // Clear form
    setSignupName('');
    setSignupEmail('');
    setSignupRole('Scanner');
    
    toast.success('Account created successfully! You can now log in.');
  };

  const LoginForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-role">Role</Label>
          <Select value={loginRole} onValueChange={(value: 'Admin' | 'Scanner') => setLoginRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Scanner">Scanner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </CardContent>
    </Card>
  );

  const SignupForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Sign Up
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Enter your full name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-role">Role</Label>
          <Select value={signupRole} onValueChange={(value: 'Admin' | 'Scanner') => setSignupRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Scanner">Scanner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSignup} className="w-full">
          Sign Up
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup" className="mt-6">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const { currentPage, setCurrentPage } = useContext(AppContext);

  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-qrcodes', label: 'QR Codes', icon: QrCode },
    { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentPage(item.id)}
                    isActive={currentPage === item.id}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AdminDashboard() {
  const { users, qrCodes, scanHistory } = useContext(AppContext);
  
  const totalPoints = scanHistory.reduce((sum, scan) => sum + scan.points, 0);
  const activeQRCodes = qrCodes.filter(qr => qr.status === 'Active').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1>Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create QR Code
          </Button>
          <Button variant="outline">
            <UserCog className="w-4 h-4 mr-2" />
            Adjust Points
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeQRCodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Points Distributed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalPoints}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsersManagement() {
  const { users, setUsers } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pointsAction, setPointsAction] = useState<'add' | 'subtract'>('add');
  const [pointsAmount, setPointsAmount] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'Admin' | 'Scanner'>('All');

  const filteredUsers = users.filter(user => 
    filterRole === 'All' || user.role === filterRole
  );

  const handleAdjustPoints = () => {
    if (!selectedUser || !pointsAmount) return;
    
    const amount = parseInt(pointsAmount);
    const newPoints = pointsAction === 'add' 
      ? selectedUser.points + amount 
      : Math.max(0, selectedUser.points - amount);

    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, points: newPoints }
        : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser(null);
    setPointsAmount('');
    toast.success(`Points ${pointsAction === 'add' ? 'added' : 'subtracted'} successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1>User Management</h1>
        <Select value={filterRole} onValueChange={(value: 'All' | 'Admin' | 'Scanner') => setFilterRole(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Scanner">Scanner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.points}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        Adjust Points
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjust Points for {user.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Action</Label>
                          <Select value={pointsAction} onValueChange={(value: 'add' | 'subtract') => setPointsAction(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="add">Add Points</SelectItem>
                              <SelectItem value="subtract">Subtract Points</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount</Label>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={pointsAmount}
                            onChange={(e) => setPointsAmount(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleAdjustPoints} className="w-full">
                          Submit
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function QRCodesManagement() {
  const { qrCodes, setQrCodes } = useContext(AppContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQRCode, setNewQRCode] = useState({
    name: '',
    tags: '',
    mode: 'Give to Owner' as 'Give to Owner' | 'Scanner' | 'Both',
    points: 0
  });
  const [filterMode, setFilterMode] = useState<'All' | 'Give to Owner' | 'Scanner' | 'Both'>('All');

  const filteredQRCodes = qrCodes.filter(qr => 
    filterMode === 'All' || qr.mode === filterMode
  );

  const handleCreateQRCode = () => {
    if (!newQRCode.name) {
      toast.error('Please enter a QR code name');
      return;
    }

    const qrCode: QRCodeData = {
      id: Date.now().toString(),
      name: newQRCode.name,
      qrCodeId: `QR${Date.now().toString().slice(-3)}`,
      tags: newQRCode.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      mode: newQRCode.mode,
      points: newQRCode.points,
      status: 'Active'
    };

    setQrCodes([...qrCodes, qrCode]);
    setNewQRCode({ name: '', tags: '', mode: 'Give to Owner', points: 0 });
    setShowCreateModal(false);
    toast.success('QR Code created successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1>QR Code Management</h1>
        <div className="flex gap-2">
          <Select value={filterMode} onValueChange={(value: typeof filterMode) => setFilterMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Modes</SelectItem>
              <SelectItem value="Give to Owner">Give to Owner</SelectItem>
              <SelectItem value="Scanner">Scanner</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New QR Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>QR Code Name</Label>
                  <Input
                    placeholder="Enter QR code name"
                    value={newQRCode.name}
                    onChange={(e) => setNewQRCode({...newQRCode, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    placeholder="welcome, bonus, daily"
                    value={newQRCode.tags}
                    onChange={(e) => setNewQRCode({...newQRCode, tags: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select value={newQRCode.mode} onValueChange={(value: typeof newQRCode.mode) => setNewQRCode({...newQRCode, mode: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Give to Owner">Give to Owner</SelectItem>
                      <SelectItem value="Scanner">Scanner</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newQRCode.points}
                    onChange={(e) => setNewQRCode({...newQRCode, points: parseInt(e.target.value) || 0})}
                  />
                </div>
                <Button onClick={handleCreateQRCode} className="w-full">
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>QR Code ID</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQRCodes.map((qrCode) => (
              <TableRow key={qrCode.id}>
                <TableCell>{qrCode.name}</TableCell>
                <TableCell>{qrCode.qrCodeId}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {qrCode.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {qrCode.mode}
                  </Badge>
                </TableCell>
                <TableCell>{qrCode.points}</TableCell>
                <TableCell>
                  <Badge variant={qrCode.status === 'Active' ? 'default' : 'secondary'}>
                    {qrCode.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ScannerScan() {
  const { qrCodes, scanHistory, setScanHistory, user } = useContext(AppContext);
  const [qrCodeId, setQrCodeId] = useState('');

  const handleScan = () => {
    if (!qrCodeId) {
      toast.error('Please enter a QR Code ID');
      return;
    }

    const qrCode = qrCodes.find(qr => qr.qrCodeId === qrCodeId && qr.status === 'Active');
    if (!qrCode) {
      toast.error('QR Code not found or inactive');
      return;
    }

    const newScan: ScanHistory = {
      id: Date.now().toString(),
      qrCodeId: qrCodeId,
      points: qrCode.points,
      timestamp: new Date()
    };

    setScanHistory([newScan, ...scanHistory]);
    setQrCodeId('');
    toast.success(`Successfully scanned! ${qrCode.points} points added.`);
  };

  const recentScans = scanHistory.slice(0, 5);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Enter QR Code ID</Label>
              <Input
                placeholder="QR001"
                value={qrCodeId}
                onChange={(e) => setQrCodeId(e.target.value)}
              />
            </div>
            <Button onClick={handleScan} className="w-full">
              <Scan className="w-4 h-4 mr-2" />
              Scan
            </Button>
          </CardContent>
        </Card>

        {recentScans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex justify-between items-center p-2 border rounded">
                    <span>{scan.qrCodeId}</span>
                    <Badge>+{scan.points} points</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ScannerPoints() {
  const { scanHistory, user } = useContext(AppContext);
  
  const totalPoints = scanHistory.reduce((sum, scan) => sum + scan.points, 0);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-2">{totalPoints}</div>
              <p className="text-muted-foreground">Total Points Earned</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scan History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.slice(0, 10).map((scan) => (
                <div key={scan.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div>{scan.qrCodeId}</div>
                    <div className="text-sm text-muted-foreground">
                      {scan.timestamp.toLocaleDateString()} {scan.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge>+{scan.points}</Badge>
                </div>
              ))}
              {scanHistory.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No scans yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScannerNav() {
  const { currentPage, setCurrentPage, setUser, setCurrentPage: logout } = useContext(AppContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
      <div className="flex">
        <Button
          variant={currentPage === 'scanner-scan' ? 'default' : 'ghost'}
          className="flex-1 rounded-none h-16"
          onClick={() => setCurrentPage('scanner-scan')}
        >
          <Scan className="w-5 h-5 mb-1" />
          <span className="text-xs">Scan</span>
        </Button>
        <Button
          variant={currentPage === 'scanner-points' ? 'default' : 'ghost'}
          className="flex-1 rounded-none h-16"
          onClick={() => setCurrentPage('scanner-points')}
        >
          <Star className="w-5 h-5 mb-1" />
          <span className="text-xs">Points</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 rounded-none h-16"
          onClick={() => {
            setUser(null);
            logout('login');
          }}
        >
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </div>
  );
}

function Header() {
  const { darkMode, setDarkMode, user, setUser, setCurrentPage } = useContext(AppContext);

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h2>QR Points System</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setUser(null);
              setCurrentPage('login');
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>(mockQRCodes);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const contextValue = {
    user,
    setUser,
    currentPage,
    setCurrentPage,
    users,
    setUsers,
    qrCodes,
    setQrCodes,
    scanHistory,
    setScanHistory,
    darkMode,
    setDarkMode
  };

  const renderPage = () => {
    if (!user) return <Login />;

    if (user.role === 'Admin') {
      return (
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1">
              <Header />
              {currentPage === 'admin-dashboard' && <AdminDashboard />}
              {currentPage === 'admin-users' && <UsersManagement />}
              {currentPage === 'admin-qrcodes' && <QRCodesManagement />}
              {currentPage === 'admin-analytics' && (
                <div className="p-6">
                  <h1>Analytics</h1>
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </div>
              )}
              {currentPage === 'admin-settings' && (
                <div className="p-6">
                  <h1>Settings</h1>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </div>
              )}
            </main>
          </div>
        </SidebarProvider>
      );
    } else {
      return (
        <div className="pb-16">
          {currentPage === 'scanner-scan' && <ScannerScan />}
          {currentPage === 'scanner-points' && <ScannerPoints />}
          <ScannerNav />
        </div>
      );
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {renderPage()}
        <Toaster />
      </div>
    </AppContext.Provider>
  );
}