import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const body = await request.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if institution exists
    const { data: institution, error: institutionError } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', body.institution_id)
      .single();

    if (institutionError || !institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // Update user's institution_id
    const { error: updateError } = await supabase
      .from('users')
      .update({
        institution_id: institution.id,
        role: 'admin',
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to assign institution to user' },
        { status: 500 }
      );
    }

    // Create institution admin record
    const { error: adminError } = await supabase
      .from('institution_admins')
      .insert({
        user_id: user.id,
        institution_id: institution.id,
        employee_id: 'ADMIN-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      });

    if (adminError) {
      return NextResponse.json(
        { error: 'Failed to create admin record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Institution assigned successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 