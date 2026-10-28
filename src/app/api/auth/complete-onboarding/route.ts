import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile } = body;

    if (!profile || !profile.username || !profile.display_name) {
      return NextResponse.json(
        { success: false, error: 'Incomplete profile submission.' },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        completedAt: new Date().toISOString(),
        username: profile.username
      },
      { status: 200 }
    );

    // Set server-side onboarding completed cookie
    response.cookies.set({
      name: 'linkedout_onboarding_completed',
      value: 'true',
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
