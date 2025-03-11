import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Search, Trash2, X } from 'lucide-react';
import type { Word } from '../types';

// Serbian Cyrillic alphabet
const ALPHABET = [
  'А', 'Б', 'В', 'Г', 'Д', 'Ђ', 'Е', 'Ж', 'З', 'И',
  'Ј', 'К', 'Л', 'Љ', 'М', 'Н', 'Њ', 'О', 'П', 'Р',
  'С', 'Т', 'Ћ', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Џ', 'Ш'
];

export function Dictionary() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchWords();
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user?.id || null);
  }

  async function fetchWords() {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('word', { ascending: true });

    if (error) {
      console.error('Error fetching words:', error);
    } else {
      setWords(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(wordId: string) {
    if (!confirm('Да ли сте сигурни да желите да обришете ову реч?')) {
      return;
    }

    setDeleteLoading(wordId);
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', wordId);

    if (error) {
      console.error('Error deleting word:', error);
      alert('Грешка при брисању речи.');
    } else {
      setWords(words.filter(w => w.id !== wordId));
    }
    setDeleteLoading(null);
  }

  const filteredWords = words.filter(word => {
    const matchesSearch = searchTerm === '' || 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLetter = !selectedLetter || 
      word.word.toUpperCase().startsWith(selectedLetter);

    return matchesSearch && matchesLetter;
  });

  if (loading) {
    return <div className="text-center">Учитавање...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Шебечки дијалекатски речник</h1>
      
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Претражи речи или значења..."
            className="w-full p-4 pl-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2 justify-center">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors
                  ${selectedLetter === letter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>
          {selectedLetter && (
            <div className="mt-4 flex items-center justify-center">
              <span className="text-sm text-gray-600">
                Приказане су речи које почињу словом "{selectedLetter}"
              </span>
              <button
                onClick={() => setSelectedLetter(null)}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                title="Уклони филтер"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => (
            <div key={word.id} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-blue-600">{word.word}</h3>
                  <p className="mt-2 text-gray-700">{word.meaning}</p>
                </div>
                {currentUser === word.user_id && (
                  <button
                    onClick={() => handleDelete(word.id)}
                    disabled={deleteLoading === word.id}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Обриши реч"
                  >
                    <Trash2 size={20} className={deleteLoading === word.id ? 'animate-pulse' : ''} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">
            {searchTerm || selectedLetter
              ? 'Нема пронађених речи за задате критеријуме претраге.'
              : 'Још увек нема унетих речи.'}
          </p>
        )}
      </div>
    </div>
  );
}