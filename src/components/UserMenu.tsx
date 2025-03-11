import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { supabase } from '../supabase';

export function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <Link to="/auth" className="flex items-center space-x-2 hover:text-blue-200">
        <User size={20} />
        <span>Пријава</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm">{user.email}</span>
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 hover:text-blue-200"
      >
        <LogOut size={20} />
        <span>Одјава</span>
      </button>
    </div>
  );
}