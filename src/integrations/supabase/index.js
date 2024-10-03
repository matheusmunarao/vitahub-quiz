// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import { useQuiz, useQuizzes, useAddQuiz, useUpdateQuiz, useDeleteQuiz } from './hooks/useQuiz.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useQuiz,
  useQuizzes,
  useAddQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
};