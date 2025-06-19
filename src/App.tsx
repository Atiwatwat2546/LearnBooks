import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BookLibrary from './components/BookLibrary';
import BookReader from './components/BookReader';
import ChatBot from './components/ChatBot';
import TeacherDashboard from './components/TeacherDashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Profile from './components/Profile';
import { Home, BookOpen, MessageSquare, BarChart3, Users, Settings } from 'lucide-react';
import { User } from './types/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'library' | 'reader' | 'chat' | 'teacher-dashboard' | 'teacher-books' | 'teacher-analytics' | 'profile'>('dashboard');
  const [selectedBook, setSelectedBook] = useState<{
    id: string;
    title: string;
    author: string;
  } | null>(null);

  // 🔗 BACKEND CONNECTION: Authentication
  const handleLogin = async (email: string, password: string, role: 'teacher' | 'student') => {
    setIsLoading(true);

    try {
      // Mock authentication - replace with actual API call
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email,
          name: role === 'teacher' ? 'อาจารย์สมชาย' : 'นักเรียนสมหญิง',
          role
        };

        setUser(mockUser);
        // เปลี่ยนฟีเจอร์หลักเป็น chat สำหรับนักเรียน
        setCurrentView(role === 'teacher' ? 'teacher-dashboard' : 'chat');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  // 🔗 BACKEND CONNECTION: Registration
  const handleRegister = async (email: string, password: string, name: string, role: 'teacher' | 'student') => {
    setIsLoading(true);

    try {
      // Mock registration - replace with actual API call
      setTimeout(() => {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          role
        };

        setUser(mockUser);
        setCurrentView(role === 'teacher' ? 'teacher-dashboard' : 'chat');
        setShowRegister(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    setSelectedBook(null);
    setShowRegister(false);
  };

  const handleBookSelect = (bookId: string) => {
    // Mock book data - in real app, this would come from API
    const books = {
      '1': { id: '1', title: 'วิทยาศาสตร์น่ารู้ ชั้นมัธยมศึกษาตอนต้น', author: 'ดร.สมชาย วิทยาคม' },
      '2': { id: '2', title: 'คณิตศาสตร์พื้นฐานเพื่อชีวิต', author: 'อาจารย์สมหญิง เลขคณิต' },
      '3': { id: '3', title: 'ประวัติศาสตร์ไทย เรื่องราวที่น่าทึ่ง', author: 'ศาสตราจารย์พิมพ์ใจ ประวัติศาสตร์' }
    };

    const book = books[bookId as keyof typeof books];
    if (book) {
      setSelectedBook(book);
      // เปลี่ยนให้ไปหน้า chat แทน reader เป็นฟีเจอร์หลัก
      setCurrentView('chat');
    }
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedBook(null);
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleBackFromProfile = () => {
    setCurrentView(user?.role === 'teacher' ? 'teacher-dashboard' : 'chat');
  };

  // If not logged in, show login or register form
  if (!user) {
    if (showRegister) {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
          isLoading={isLoading}
        />
      );
    }
    return (
      <LoginForm
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
        isLoading={isLoading}
      />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return <Profile user={user} onBack={handleBackFromProfile} />;
      case 'dashboard':
        return (
          <div className={`min-h-screen ${user.role === 'student'
              ? 'bg-gradient-to-br from-green-50 via-blue-50 to-teal-50'
              : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50'
            }`}>
            <div className="pt-8">
              <Dashboard />
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
            <div className="pt-8">
              <BookLibrary onBookSelect={handleBookSelect} />
            </div>
          </div>
        );
      case 'reader':
        return selectedBook ? (
          <BookReader
            book={selectedBook}
            onBack={handleBackToChat}
            onBackToLibrary={handleBackToLibrary}
          />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
            <div className="pt-8">
              <BookLibrary onBookSelect={handleBookSelect} />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 py-4 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] space-y-4">

                {/* ✅ ปุ่มย้อนกลับหากมีหนังสือถูกเลือก */}
                {selectedBook && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>← ย้อนกลับไปเลือกหนังสือ</span>
                    </button>
                  </div>
                )}

                <ChatBot
                  selectedBook={selectedBook}
                  onBookSelect={handleBookSelect}
                  onReadBook={() => setCurrentView('reader')}
                />
              </div>
            </div>
          </div>
        );

      case 'teacher-dashboard':
      case 'teacher-books':
      case 'teacher-analytics':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
            <TeacherDashboard />
          </div>
        );
      default:
        return (
          <div className={`min-h-screen ${user.role === 'student'
              ? 'bg-gradient-to-br from-green-50 via-blue-50 to-teal-50'
              : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50'
            }`}>
            <div className="pt-8">
              <Dashboard />
            </div>
          </div>
        );
    }
  };

  const getNavigationItems = () => {
    if (user.role === 'teacher') {
      return [
        { id: 'teacher-dashboard', label: 'ภาพรวม', icon: BarChart3 },
        { id: 'teacher-books', label: 'จัดการหนังสือ', icon: BookOpen },
        { id: 'teacher-analytics', label: 'วิเคราะห์', icon: Users },
      ];
    } else {
      return [
        { id: 'chat', label: 'AI ผู้ช่วย', icon: MessageSquare },
        { id: 'library', label: 'ห้องสมุด', icon: BookOpen },
        { id: 'dashboard', label: 'ภาพรวม', icon: Home },
      ];
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        user={user}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />

      {/* Navigation - Only show for students and not in reader/profile view */}
      {user.role === 'student' && currentView !== 'reader' && currentView !== 'profile' && (
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {getNavigationItems().map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 border-b-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${currentView === item.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={user.role === 'teacher' ? '' : currentView === 'reader' || currentView === 'profile' ? '' : 'pt-0'}>
        {renderCurrentView()}
      </main>

      {/* Footer - Only show for students and not in reader/profile view */}
      {user.role === 'student' && currentView !== 'reader' && currentView !== 'profile' && (
        <footer className="bg-gray-700 text-white py-6 sm:py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">🔗 ระบบ Backend</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                  <li>• RESTful API สำหรับจัดการหนังสือ</li>
                  <li>• WebSocket สำหรับ Real-time Chat</li>
                  <li>• Authentication & Authorization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">🗄️ ฐานข้อมูล</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                  <li>• PostgreSQL สำหรับข้อมูลหลัก</li>
                  <li>• Vector Database สำหรับ AI Search</li>
                  <li>• Redis สำหรับ Session Management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">🤖 AI Integration</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                  <li>• OpenAI API สำหรับ Chatbot</li>
                  <li>• Document Embedding & Retrieval</li>
                  <li>• Natural Language Processing</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;