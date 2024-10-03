import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Quiz

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | integer                  | bigint | true     |
| created_at | timestamp with time zone | string | true     |
| answer     | text                     | string | false    |

Note: 
- 'id' is the Primary Key.
- 'created_at' has a default value of now().
*/

// Fetch a single quiz by id
export const useQuiz = (id) => useQuery({
    queryKey: ['quizzes', id],
    queryFn: () => fromSupabase(supabase.from('Quiz').select('*').eq('id', id).single()),
});

// Fetch all quizzes
export const useQuizzes = () => useQuery({
    queryKey: ['quizzes'],
    queryFn: () => fromSupabase(supabase.from('Quiz').select('*')),
});

// Add a new quiz
export const useAddQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newQuiz) => fromSupabase(supabase.from('Quiz').insert([newQuiz])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
    });
};

// Update an existing quiz
export const useUpdateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('Quiz').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
    });
};

// Delete a quiz
export const useDeleteQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Quiz').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
    });
};