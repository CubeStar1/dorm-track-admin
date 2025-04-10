import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    
    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { 
      fullName, 
      phone, 
      gender, 
      role,
      employeeId,
      department,
      institutionId,
      hostelId,
      assignedBlocks = []
    } = await request.json();

    // Start a transaction by using the Supabase client
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: session.user.id,
        full_name: fullName,
        email: session.user.email,
        phone,
        gender,
        role: role,
        institution_id: institutionId
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create the role-specific record based on the selected role
    if (role === 'admin') {
      const { error: adminError } = await supabase
        .from('institution_admins')
        .insert({
          user_id: session.user.id,
          employee_id: employeeId,
          institution_id: institutionId,
          department
        });

      if (adminError) {
        console.error('Admin creation error:', adminError);
        // Roll back user creation
        await supabase.from('users').delete().eq('id', session.user.id);
        return NextResponse.json(
          { error: 'Failed to create admin profile' },
          { status: 500 }
        );
      }
    } else if (role === 'warden') {
      // Only include hostelId for warden role
      if (!hostelId) {
        await supabase.from('users').delete().eq('id', session.user.id);
        return NextResponse.json(
          { error: 'Hostel ID is required for wardens' },
          { status: 400 }
        );
      }

      const { error: wardenError } = await supabase
        .from('wardens')
        .insert({
          user_id: session.user.id,
          employee_id: employeeId,
          hostel_id: hostelId,
          institution_id: institutionId,
          assigned_blocks: assignedBlocks
        });

      if (wardenError) {
        console.error('Warden creation error:', wardenError);
        // Roll back user creation
        await supabase.from('users').delete().eq('id', session.user.id);
        return NextResponse.json(
          { error: 'Failed to create warden profile' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 