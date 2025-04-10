import { useQuery } from '@tanstack/react-query';
import { createSupabaseBrowser } from '@/lib/supabase/client';

export function useInstitution() {
  const supabase = createSupabaseBrowser();

  const { data: institutionId, isLoading } = useQuery({
    queryKey: ['institution'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Not authenticated');
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('institution_id')
        .eq('id', session.user.id)
        .single();

      if (userError || !user) {
        throw new Error('Failed to fetch user institution');
      }

      return user.institution_id;
    }
  });

  return { institutionId, isLoading };
} 