import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import { Menu, LogOut, LayoutList, CalendarDays } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'month'

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('familyPlannerUser');
    const storedTimestamp = localStorage.getItem('familyPlannerLoginTime');

    if (storedUser && storedTimestamp) {
      const now = new Date().getTime();
      const loginTime = parseInt(storedTimestamp, 10);
      const thirtyMinutes = 30 * 60 * 1000;

      if (now - loginTime < thirtyMinutes) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // Session expired
        localStorage.removeItem('familyPlannerUser');
        localStorage.removeItem('familyPlannerLoginTime');
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('familyPlannerUser', JSON.stringify(user));
    localStorage.setItem('familyPlannerLoginTime', new Date().getTime().toString());
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
    localStorage.removeItem('familyPlannerUser');
    localStorage.removeItem('familyPlannerLoginTime');
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <header className="px-4 py-3 bg-white shadow-sm flex justify-between items-center z-50 border-b sticky top-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{currentUser.avatar}</span>
          <h1 className="font-bold text-lg text-gray-800 tracking-tight whitespace-nowrap truncate">{currentUser.name}의 플래너</h1>

          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'month' : 'list')}
            className="ml-2 p-1.5 bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors flex items-center gap-1.5 text-xs font-semibold px-2.5 flex-shrink-0"
          >
            {viewMode === 'list' ? (
              <>
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">달력</span>
              </>
            ) : (
              <>
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">리스트</span>
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
