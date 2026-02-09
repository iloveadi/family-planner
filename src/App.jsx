import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import { Menu, LogOut, LayoutList, CalendarDays } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'month'

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
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

          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'month' : 'list')}
            className="ml-2 p-1.5 bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-semibold px-2.5"
          >
            {viewMode === 'list' ? (
              <>
                <CalendarDays className="w-4 h-4" />
                <span>달력</span>
              </>
            ) : (
              <>
                <LayoutList className="w-4 h-4" />
                <span>리스트</span>
              </>
            )}
          </button>
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
        <Calendar currentUser={currentUser} viewMode={viewMode} />
      </main>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}

export default App;
