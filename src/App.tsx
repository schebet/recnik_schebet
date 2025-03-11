import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Book, Upload } from 'lucide-react';
import { Auth } from './components/Auth';
import { Dictionary } from './components/Dictionary';
import { WordForm } from './components/WordForm';
import { UserMenu } from './components/UserMenu';
import { ImageUpload } from './components/ImageUpload';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div 
          className="bg-cover bg-center h-48 relative"
          style={{
            backgroundImage: 'url(https://pclmtbugrtlrofkbmrck.supabase.co/storage/v1/object/public/images/header-image.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50">
            <nav className="container mx-auto flex items-center justify-between p-4 text-white relative z-10">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
                <Book />
                <span>Шебечки речник</span>
              </Link>
              <div className="flex items-center space-x-6">
                <div className="space-x-4">
                  <Link to="/" className="hover:text-blue-200">Речник</Link>
                  <Link to="/add" className="hover:text-blue-200">Додај реч</Link>
                </div>
                <div className="flex items-center space-x-4">
                  <UserMenu />
                  <Link 
                    to="/upload" 
                    className="hover:text-blue-200 p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Промени слику"
                  >
                    <Upload size={20} />
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dictionary />} />
            <Route path="/add" element={<WordForm />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/upload" element={<ImageUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;