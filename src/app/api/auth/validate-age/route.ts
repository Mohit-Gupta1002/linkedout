import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { birthDate, age: explicitAge, username, displayName } = body;

    // Validate required fields
    if (!displayName || !displayName.trim()) {
      return NextResponse.json(
        { eligible: false, error: 'Display name is required.' },
        { status: 400 }
      );
    }

    if (!username || !username.trim()) {
      return NextResponse.json(
        { eligible: false, error: 'Username is required.' },
        { status: 400 }
      );
    }

    // Calculate age accurately
    let calculatedAge: number | null = null;

    if (birthDate) {
      const dob = new Date(birthDate);
      if (isNaN(dob.getTime())) {
        return NextResponse.json(
          { eligible: false, error: 'Invalid date of birth format.' },
          { status: 400 }
        );
      }
      const today = new Date();
      calculatedAge = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
    } else if (typeof explicitAge === 'number' || (typeof explicitAge === 'string' && explicitAge.trim() !== '')) {
      calculatedAge = parseInt(String(explicitAge), 10);
      if (isNaN(calculatedAge)) {
        return NextResponse.json(
          { eligible: false, error: 'Valid numeric age is required.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { eligible: false, error: 'Age or date of birth is required.' },
        { status: 400 }
      );
    }

    // Strict 18+ enforcement
    if (calculatedAge < 18) {
      return NextResponse.json(
        {
          eligible: false,
          age: calculatedAge,
          error: 'LinkedOut is currently available only to people aged 18 and above.',
          message: 'LinkedOut is currently available only to people aged 18 and above.'
        },
        { status: 403 }
      );
    }

    // Age >= 18 verified
    const response = NextResponse.json(
      {
        eligible: true,
        age: calculatedAge,
        verifiedAt: new Date().toISOString(),
        verificationId: `verified_age_${Date.now()}`
      },
      { status: 200 }
    );

    // Set server-side verified cookie
    response.cookies.set({
      name: 'linkedout_age_verified',
      value: 'true',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { eligible: false, error: errorMsg },
      { status: 500 }
    );
  }
}
