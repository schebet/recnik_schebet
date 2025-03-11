export interface Word {
  id: string;
  created_at: string;
  word: string;
  meaning: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}