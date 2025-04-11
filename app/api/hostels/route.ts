import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/hostels - Get all hostels for an institution
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');

    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // Verify authentication and admin role
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', institutionId)
      .single();
      

    // if (!admin) {
    //   return NextResponse.json(
    //     { error: 'Not authorized' },
    //     { status: 403 }
    //   );
    // }

    // Fetch hostels
    const { data: hostels, error: hostelsError } = await supabase
      .from('hostels')
      .select(`
        id,
        name,
        code,
        address,
        city,
        state,
        contact_email,
        contact_phone,
        total_blocks,
        total_rooms,
        created_at,
        updated_at
      `)
      .eq('institution_id', institutionId)
      .order('name');

    if (hostelsError) {
      console.error('Error fetching hostels:', hostelsError);
      return NextResponse.json(
        { error: 'Failed to fetch hostels' },
        { status: 500 }
      );
    }

    return NextResponse.json(hostels);
  } catch (error) {
    console.error('Hostels fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/hostels - Create a new hostel
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();

    // Verify authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', data.institution_id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Create hostel
    const { data: hostel, error: createError } = await supabase
      .from('hostels')
      .insert({
        name: data.name,
        code: data.code,
        address: data.address,
        city: data.city,
        state: data.state,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        total_blocks: data.total_blocks,
        total_rooms: data.total_rooms,
        institution_id: data.institution_id
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating hostel:', createError);
      return NextResponse.json(
        { error: 'Failed to create hostel' },
        { status: 500 }
      );
    }

    return NextResponse.json(hostel);
  } catch (error) {
    console.error('Hostel creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 