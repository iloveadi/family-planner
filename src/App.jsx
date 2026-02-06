import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import { Menu, LogOut } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check localStorage for persisted session
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
    localStorage.removeItem('currentUser');
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <header className="px-4 py-3 bg-white shadow-sm flex justify-between items-center z-30 border-b">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentUser.avatar}</span>
          <h1 className="font-bold text-lg text-gray-800 tracking-tight">{currentUser.name}의 플래너</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            title="로그아웃"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <Calendar currentUser={currentUser} />
      </main>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}

export default App;
