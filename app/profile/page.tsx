import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface UserData {
  userId: number;
  name: string;
  role: string;
  location: string | null;
  eventPreference: string | null;
  city: {
    cityId: number;
    name: string;
    country: string;
  } | null;
  preferredCity: {
    cityId: number;
    name: string;
    country: string;
  } | null;
}

/**
 * Server-side rendered profile page that fetches secured user data
 * This demonstrates SSR with authentication - the token is read from cookies
 * and used to fetch protected user data from the backend
 */
async function fetchUserProfile(userId: number, token: string): Promise<UserData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default async function ProfilePage() {
  // Read auth data from cookies (set by the client-side AuthContext)
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('eventify_auth');
  
  // If no auth cookie, redirect to login
  if (!authCookie?.value) {
    redirect('/login');
  }

  let authData;
  try {
    authData = JSON.parse(authCookie.value);
  } catch (e) {
    redirect('/login');
  }

  const { userId, token, name, role } = authData;

  if (!userId || !token) {
    redirect('/login');
  }

  // Fetch user profile data from the secured API endpoint
  const userData = await fetchUserProfile(userId, token);

  if (!userData) {
    // If we couldn't fetch user data, the token might be invalid
    // The client component will handle this case
    return <ProfileClient error="Unable to load profile. Please try logging in again." />;
  }

  return (
    <ProfileClient 
      user={{
        userId: userData.userId,
        name: userData.name,
        role: userData.role,
        location: userData.location,
        eventPreference: userData.eventPreference,
        cityName: userData.city?.name || null,
        preferredCityId: userData.preferredCity?.cityId || null,
        preferredCityName: userData.preferredCity?.name || null,
      }}
    />
  );
}
