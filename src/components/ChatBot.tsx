import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Book, Sparkles, BookOpen, Play } from 'lucide-react';

interface Message { // อินเทอร์เฟซสำหรับข้อความในแชท
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps { // อินเทอร์เฟซสำหรับ props ที่รับเข้ามาใน ChatBot
  selectedBook?: {
    id: string;
    title: string;
    author: string;
  };
  currentPage?: number;
  currentContent?: {
    title: string;
    content: string;
  };
  onBookSelect?: (bookId: string) => void;
  onReadBook?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({
  selectedBook,
  currentPage,
  currentContent,
  onBookSelect,
  onReadBook
}) => {
  const [messages, setMessages] = useState<Message[]>([]); // สถานะข้อความทั้งหมดในแชท
  const [inputText, setInputText] = useState(''); // สถานะข้อความที่ผู้ใช้พิมพ์
  const [isTyping, setIsTyping] = useState(false);  // สถานะว่า AI กำลังพิมพ์อยู่หรือไม่
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 📚 หนังสือจำลองที่ใช้ตอนยังไม่เลือกหนังสือจริง
  const availableBooks = [
    { id: '1', title: 'วิทยาศาสตร์น่ารู้ ชั้นมัธยมศึกษาตอนต้น', author: 'ดร.สมชาย วิทยาคม' },
    { id: '2', title: 'คณิตศาสตร์พื้นฐานเพื่อชีวิต', author: 'อาจารย์สมหญิง เลขคณิต' },
    { id: '3', title: 'ประวัติศาสตร์ไทย เรื่องราวที่น่าทึ่ง', author: 'ศาสตราจารย์พิมพ์ใจ ประวัติศาสตร์' }
  ];

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // เมื่อโหลด component ครั้งแรก แสดงข้อความต้อนรับ
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: selectedBook
        ? (
          currentPage
            ? `สวัสดี! คุณกำลังอ่าน "${selectedBook.title}" หน้า ${currentPage} — ถาม AI ได้เลยครับ!`
            : `ยินดีต้อนรับสู่ "${selectedBook.title}" ของ ${selectedBook.author} — ถาม AI ได้เลยครับ!`
        )
        : `สวัสดี! ฉันเป็น AI ผู้ช่วยของคุณ 🤖\n\nคุณสามารถถามฉันได้เลย ไม่ต้องเลือกหนังสือก็ได้ เช่น:\n• อธิบายเรื่องแรงโน้มถ่วง\n• สรุปสูตรคณิตศาสตร์\n• ช่วยอธิบายประวัติศาสตร์ไทย`,
      isBot: true,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [selectedBook, currentPage]);

  // เมื่อผู้ใช้กดส่งข้อความ
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // 🔗 BACKEND CONNECTION: Send message to AI API with book context
    try {
      // Mock AI response - replace with actual API call
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateMockResponse(inputText, selectedBook, currentPage, currentContent),
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  // จำลองการตอบกลับจาก AI
  const generateMockResponse = (
    input: string,
    book?: { title: string; author: string },
    page?: number,
    content?: { title: string; content: string }
  ) => {
    if (page && content) {
      const responses = [
        `จากเนื้อหาในหน้า ${page} ที่คุณกำลังอ่าน "${content.title}" ฉันจะอธิบายให้ฟังนะ...\n\nประเด็นสำคัญในหน้านี้คือ การเคลื่อนที่ของวัตถุ ซึ่งเป็นพื้นฐานสำคัญของฟิสิกส์ คุณสามารถเข้าใจได้ง่ายๆ ดังนี้...`,
        `เรื่องที่คุณถามเกี่ยวกับหน้า ${page} นี้น่าสนใจมาก! ตามที่เขียนไว้ในหนังสือ "${book?.title}" เนื้อหาส่วนนี้อธิบายว่า...\n\nให้ฉันยกตัวอย่างจากชีวิตจริงให้ฟังนะ เช่น เวลาคุณขับรถ...`,
        `คำถามดีมาก! จากเนื้อหาในหน้า ${page} ที่กล่าวถึง "${content.title}" ฉันจะอธิบายให้เข้าใจง่ายๆ...\n\nสูตรที่เห็นในหนังสือ v = s ÷ t นั้น หมายความว่า...`,
        `ในหน้า ${page} ที่คุณกำลังอ่านอยู่ มีการอธิบายเรื่อง ${content.title} ไว้อย่างละเอียด ฉันจะสรุปประเด็นสำคัญให้ฟัง...\n\nจุดที่ควรจำคือ...`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else if (book) {
      const responses = [
        `จากเนื้อหาในหนังสือ "${book.title}" ที่คุณถาม เรื่องนี้เป็นหัวข้อที่น่าสนใจมาก ฉันจะอธิบายให้ฟังตามที่เขียนไว้ในหนังสือนะ...\n\nในบทที่ 1 มีการกล่าวถึงการเคลื่อนที่ของวัตถุ ซึ่งเป็นพื้นฐานสำคัญ...`,
        `ในหนังสือของ ${book.author} มีการกล่าวถึงเรื่องนี้ไว้ในบทที่ 3 โดยอธิบายว่า...\n\nให้ฉันยกตัวอย่างให้เข้าใจง่ายขึ้น เช่น...`,
        `คำถามดีมาก! ตามที่ระบุไว้ในหนังสือ "${book.title}" เรื่องนี้สามารถเข้าใจได้ง่ายๆ ดังนี้...\n\nประเด็นสำคัญคือ...`,
        `จากหนังสือ "${book.title}" ที่คุณเลือก ฉันจะเล่าเรื่องให้ฟังนะ...\n\nในช่วงแรกของเรื่อง มีการอธิบายเกี่ยวกับ...`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      return `ตอบคำถาม 📚`;
    }
  };

  // ส่งข้อความเมื่อกด Enter โดยไม่กด Shift
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // สร้าง Quick Actions ตามบริบท
  const getQuickActions = () => {
    if (currentPage && currentContent) {
      return [
        `อธิบายเนื้อหาหน้า ${currentPage} ให้ฟังหน่อย`,
        `สรุปประเด็นสำคัญในหน้านี้`,
        `ยกตัวอย่างจากชีวิตจริงเกี่ยวกับเนื้อหานี้`,
        `ให้แบบฝึกหัดจากเนื้อหาหน้านี้`
      ];
    } else if (selectedBook) {
      return [
        'สรุปหนังสือเล่มนี้ให้ฟังหน่อย',
        'เล่าเรื่องในหนังสือให้ฟังหน่อย',
        'ให้แบบฝึกหัดจากเนื้อหาในหนังสือ',
        'อธิบายแนวคิดหลักในหนังสือ'
      ];
    } else {
      return [
        'แนะนำหนังสือที่น่าสนใจ',
        'อยากเรียนรู้เรื่องวิทยาศาสตร์',
        'ช่วยอธิบายคณิตศาสตร์',
        'เล่าประวัติศาสตร์ให้ฟัง'
      ];
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">AI ผู้ช่วยการเรียนรู้</h2>
            <p className="text-blue-100 text-sm">
              {selectedBook ? `กำลังเรียนรู้: ${selectedBook.title}` : 'เลือกหนังสือเพื่อเริ่มต้น'}
            </p>
          </div>
        </div>
      </div>


      {/* Book Selection - Show when no book is selected
      {!selectedBook && onBookSelect && (
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">เลือกหนังสือที่สนใจ:</h3>
          <div className="grid grid-cols-1 gap-2">
            {availableBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => onBookSelect(book.id)}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{book.title}</p>
                    <p className="text-xs text-gray-600">{book.author}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}  */}


      {/* แสดงข้อมูลหนังสือที่เลือกไว้ */}
      {selectedBook && (
        <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Book className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{selectedBook.title}</p>
                <p className="text-xs text-gray-600">{selectedBook.author}</p>
              </div>
            </div>
            {onReadBook && (
              <button
                onClick={onReadBook}
                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Play className="h-4 w-4" />
                <span>อ่านหนังสือ</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* แสดงข้อความในแชท */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-600 text-white'
                }`}
            >
              <div className="flex items-start space-x-2">
                {message.isBot && (
                  <Bot className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                )}
                {!message.isBot && (
                  <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                    {message.timestamp.toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* แสดงจุดสามจุดขณะ AI กำลังพิมพ์ */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* กล่องพิมพ์ข้อความและปุ่มส่ง */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ถามคำถามเกี่ยวกับเนื้อหา..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* ปุ่มคำถามด่วน */}
        <div className="mt-3 flex flex-wrap gap-2">
          {getQuickActions().map((action, index) => (
            <button
              key={index}
              onClick={() => setInputText(action)}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;