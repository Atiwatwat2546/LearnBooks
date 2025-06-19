import React from 'react';
import { Book, Users, Star } from 'lucide-react';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  rating: number;
  studentsCount: number;
  onSelect: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  description,
  cover,
  rating,
  studentsCount,
  onSelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-blue-200 transform hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-blue-100 via-green-100 to-teal-100 flex items-center justify-center">
        <Book className="h-16 w-16 text-blue-600" />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-2">โดย {author}</p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">{studentsCount} นักเรียน</span>
          </div>
        </div>
        
        <button
          onClick={() => onSelect(id)}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {/* 🔗 BACKEND CONNECTION: API call to select book */}
          เริ่มอ่านหนังสือ
        </button>
      </div>
    </div>
  );
};

export default BookCard;