'use client'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { updateUserProfile, getUserProfile, signout } from '@/app/actions'; // Adjust the import paths

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const supabase = createClient();

  const handleSignout = async () => {
    try {
      await signout(); // Calls the server action to sign out
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      await updateUserProfile(formData);
      // Optionally refetch user data here if needed
      setEditMode(false); // Exit edit mode after saving
      const updatedProfile = await getUserProfile(user.id);
      setUser(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error.message);
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
        fetchUserProfile();
      } else {
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <center><p className="text-white">Loading...</p></center>;
  }

  if (!user) {
    return <center><p className="text-white">No user data found</p></center>;
  }

  const avatarUrl = user.avatar_url ? `https://espvfjqyherbtwiilqug.supabase.co/storage/v1/object/public/avatars/${user.avatar_url}` : '/default-avatar.png';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
        {editMode ? (
          <form onSubmit={handleUpdateProfile} encType="multipart/form-data" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  name="avatar_file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  id="avatar"
                />
                <label htmlFor="avatar">
                  <img
                    src={avatarPreview || avatarUrl}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full cursor-pointer object-cover"
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  name="full_name"
                  defaultValue={user.full_name}
                  className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="username"
                  defaultValue={user.username}
                  className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white mt-2"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white w-full"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="text"
                name="website"
                defaultValue={user.website}
                className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white w-full"
                placeholder="Website"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover"
                width={96}
                height={96}
              />
              <div>
                <h1 className="text-3xl font-bold">{user.full_name}</h1>
                <p className="text-gray-400">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Website:</span> <a href={user.website} className="text-blue-400 hover:underline">{user.website}</a>
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSignout}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Sign Out
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
