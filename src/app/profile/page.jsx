'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserProfile, signout } from '@/app/actions'; // Adjust this import based on your project structure

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const handleSignout = async () => {
    try {
      await signout(); // Calls the server action to sign out
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;

        if (currentUser) {
          const userProfile = await getUserProfile(currentUser.id);
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      if (currentUser) {
        fetchUserProfile(currentUser);
      } else {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <center><p>Loading...</p></center>;
  }

  if (!user) {
    return <center><p>No user data found</p></center>;
  }

  const avatarUrl = user.avatar_url 
  ? `https://espvfjqyherbtwiilqug.supabase.co/storage/v1/object/public/avatars/${user.avatar_url}` 
  : '/default-avatar.png';
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-lg bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
          />
          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-gray-400">@{user.username}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-300">
            Email: {user.email}
          </p>
          <p className="text-gray-300">
            Website: <a href={user.website} className="text-blue-400 hover:underline">{user.website}</a>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSignout}
            className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
