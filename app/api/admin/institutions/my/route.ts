import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's role and institution
    const { data: userData } = await supabase
      .from('users')
      .select('role, institution_id')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user doesn't have an institution, return null
    if (!userData.institution_id) {
      return NextResponse.json(null);
    }

    // Get the institution
    const { data: institution, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', userData.institution_id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(institution);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 