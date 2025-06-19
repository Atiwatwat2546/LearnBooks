import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Plus, 
  BarChart3, 
  Settings,
  Upload,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  studentsCount: number;
  chatsCount: number;
  rating: number;
  status: 'active' | 'draft';
}

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'analytics'>('overview');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'วิทยาศาสตร์น่ารู้ ชั้นมัธยมศึกษาตอนต้น',
      author: 'ดร.สมชาย วิทยาคม',
      category: 'science',
      studentsCount: 1205,
      chatsCount: 3420,
      rating: 4.8,
      status: 'active'
    },
    {
      id: '2',
      title: 'คณิตศาสตร์พื้นฐานเพื่อชีวิต',
      author: 'อาจารย์สมหญิง เลขคณิต',
      category: 'math',
      studentsCount: 892,
      chatsCount: 2156,
      rating: 4.6,
      status: 'active'
    }
  ]);

  const stats = {
    totalBooks: books.length,
    totalStudents: books.reduce((sum, book) => sum + book.studentsCount, 0),
    totalChats: books.reduce((sum, book) => sum + book.chatsCount, 0),
    averageRating: books.reduce((sum, book) => sum + book.rating, 0) / books.length
  };

  const AddBookModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">เพิ่มหนังสือใหม่</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อหนังสือ</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="กรอกชื่อหนังสือ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ผู้แต่ง</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="กรอกชื่อผู้แต่ง"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">เลือกหมวดหมู่</option>
              <option value="science">วิทยาศาสตร์</option>
              <option value="math">คณิตศาสตร์</option>
              <option value="history">ประวัติศาสตร์</option>
              <option value="language">ภาษา</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="กรอกคำอธิบายหนังสือ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">อัพโหลดไฟล์หนังสือ (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="text-xs text-gray-500 mt-1">รองรับไฟล์ PDF เท่านั้น (ขนาดไม่เกิน 50MB)</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex justify-end space-x-3">
          <button
            onClick={() => setShowAddBookModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ยกเลิก
          </button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            {/* 🔗 BACKEND CONNECTION: Upload book and process with AI */}
            เพิ่มหนังสือ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Teacher Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">แดชบอร์ดอาจารย์</h1>
              <p className="text-purple-100 mt-1">จัดการหนังสือและติดตามการเรียนรู้ของนักเรียน</p>
            </div>
            <button
              onClick={() => setShowAddBookModal(true)}
              className="mt-4 sm:mt-0 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>เพิ่มหนังสือ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'ภาพรวม', icon: BarChart3 },
              { id: 'books', label: 'จัดการหนังสือ', icon: BookOpen },
              { id: 'analytics', label: 'วิเคราะห์', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">หนังสือทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">นักเรียนทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">การสนทนา</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalChats.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
              <div className="space-y-4">
                {[
                  { action: 'นักเรียนใหม่เข้าร่วม', book: 'วิทยาศาสตร์น่ารู้', time: '5 นาทีที่แล้ว' },
                  { action: 'การสนทนาใหม่', book: 'คณิตศาสตร์พื้นฐาน', time: '15 นาทีที่แล้ว' },
                  { action: 'รีวิวใหม่', book: 'ประวัติศาสตร์ไทย', time: '1 ชั่วโมงที่แล้ว' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.book}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Books Management Tab */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-purple-100">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900">จัดการหนังสือ</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หนังสือ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นักเรียน</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การสนทนา</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-purple-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{book.title}</p>
                            <p className="text-sm text-gray-600">{book.author}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.studentsCount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.chatsCount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">★ {book.rating}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            book.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {book.status === 'active' ? 'เปิดใช้งาน' : 'ร่าง'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">การวิเคราะห์การใช้งาน</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">หนังสือยอดนิยม</h4>
                  <div className="space-y-2">
                    {books.map((book, index) => (
                      <div key={book.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{index + 1}. {book.title}</span>
                        <span className="text-sm font-medium text-purple-600">{book.chatsCount} chats</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🔗 AI Analytics</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• คำถามที่ถูกถามบ่อยที่สุด</li>
                    <li>• หัวข้อที่นักเรียนสนใจ</li>
                    <li>• ประสิทธิภาพการตอบคำถาม</li>
                    <li>• เวลาการใช้งานเฉลี่ย</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddBookModal && <AddBookModal />}
    </div>
  );
};

export default TeacherDashboard;