'use server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ErrorPage from './error/page';
 

export async function login(formData) {
  const supabase = createClient();

  const userData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Login Error:', error.message);
    throw new Error(error.message); 
  }
}

export async function signup(formData) {
  console.log("Inside signup...");
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  console.log("Data...", data);
  console.log("error...", error);

  const profileData = {
    email: formData.get('email'),
    full_name: formData.get('fullname'),
    username: formData.get('username'),
    website: formData.get('website'),
    avatar_url: formData.get('avatar_file'),
  };

  console.log("Inside signup profileData...", profileData);


  const avatarFile = formData.get('avatar_file');

  if (avatarFile && avatarFile.size > 0) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${profileData.username}-${Date.now()}`, avatarFile);

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      redirect(`/error?errorMessage=${uploadError.message}`);
      return;
    }

    profileData.avatar_url = uploadData.path;
  }

  console.log("avatar_url...", profileData.avatar_url);

    const user = data.user;
    console.log("before insert profiles..");
    if (user) {
      const { data: existingProfile, error: fetchProfileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (fetchProfileError && fetchProfileError.code !== 'PGRST116') {
      console.error("Error fetching existing profile:", fetchProfileError);
      redirect(`/error?errorMessage=${fetchProfileError.message}`);
      return;
    }

    let profileError;
    if (existingProfile) {
      ({ error: profileError } = await supabase
        .from('profiles')
        .update({
          email: profileData.email,
          full_name: profileData.full_name, 
          username: profileData.username,
          website: profileData.website,
          avatar_url: profileData.avatar_url,
        })
        .eq('id', user.id));
    } else {
      ({ error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: profileData.email,
          full_name: profileData.full_name, // Ensure this matches your DB field name
          username: profileData.username,
          website: profileData.website,
          avatar_url: profileData.avatar_url,
        }]));
    }

      if (profileError) {
        console.error("Error inserting profile data:", profileError);
        redirect(`/error?errorMessage=${profileError.message}`);
      }
      console.log("after insert profiles..");

      revalidatePath('/');
      redirect('/profile');
    }
}

export async function getUserProfile(userId) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log("User profile details...", data);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }
}

export async function signout() {
  const supabase = createClient();

  await supabase.auth.signOut();
  redirect('/');
}

export async function updateUserProfile(formData) {
  const supabase = createClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    throw new Error('User is not authenticated or session retrieval failed.');
  }
  const user = session.user;
  const avatarFile = formData.get('avatar_file');
  let avatarUrl = formData.get('avatar_url'); 

  if (avatarFile && avatarFile.size > 0) {
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}-${Date.now()}`, avatarFile);

      if (uploadError) {
        throw uploadError;
      }

      avatarUrl = uploadData.path; // Update with new avatar URL
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: formData.get('email'),
        full_name: formData.get('full_name'),
        username: formData.get('username'),
        website: formData.get('website'),
        avatar_url: avatarUrl, // Preserve existing or set new avatar URL
      });

    if (error) {
      throw error;
    }

    return { success: true };

  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}
