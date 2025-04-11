import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

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

    // Get all institutions
    const { data: institutions, error: institutionsError } = await supabase
      .from('institutions')
      .select('*')
      .order('name');

    if (institutionsError) {
      return NextResponse.json(
        { error: 'Failed to fetch institutions' },
        { status: 500 }
      );
    }

    return NextResponse.json(institutions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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

    // Create institution
    const { data: institution, error: createError } = await supabase
      .from('institutions')
      .insert({
        name: body.name,
        code: body.code,
        address: body.address,
        city: body.city,
        state: body.state,
        contact_email: body.contact_email,
        contact_phone: body.contact_phone,
        website: body.website,
        logo_url: body.logo_url,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create institution' },
        { status: 500 }
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

    return NextResponse.json(institution);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}