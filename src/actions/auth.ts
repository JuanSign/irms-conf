'use server';

import { hash } from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const affiliation = formData.get('affiliation') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) return { error: "Missing required fields." };

  try {
    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({
      name,
      email,
      affiliation,
      passwordHash: hashedPassword,
    });
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const dbError = error as { code: string };
      if (dbError.code === '23505') {
        return { error: "Email already registered." };
      }
    }
    return { error: "Failed to create account. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const credentials = Object.fromEntries(formData.entries());
    const result = await signIn('credentials', {
      ...credentials,
      redirect: false,
    });
    if (result?.error) return { error: 'Invalid email or password.' };
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' };
        default:
          return { error: 'Something went wrong during login.' };
      }
    }

    throw error;
  }
}