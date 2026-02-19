'use server';

import { db } from '@/db';
import { users, abstracts, abstractCoauthors } from '@/db/schema';
import { ilike, or, eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';

// Action to search for users by name or email
export async function searchAuthors(query: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  if (!query || query.length < 2) return [];

  try {
    const results = await db.query.users.findMany({
      where: or(
        ilike(users.name, `%${query}%`),
        ilike(users.email, `%${query}%`)
      ),
      limit: 5,
      columns: {
        id: true,
        name: true,
        email: true,
        affiliation: true,
      }
    });

    // Filter out the currently logged-in user so they can't add themselves as a co-author
    return results.filter(u => u.id !== session.user?.id);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Action to submit the abstract
export async function submitAbstract(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized. Please log in." };
  }

  const title = formData.get('title') as string;
  const topic = formData.get('topic') as any;
  const fileUrl = formData.get('fileUrl') as string;
  const coAuthorIdsStr = formData.get('coAuthors') as string;

  // Basic server-side validation
  if (!title || !topic || !fileUrl) {
    return { error: "Missing required fields." };
  }

  try {
    // Insert the Abstract into the Neon DB
    const [newAbstract] = await db.insert(abstracts).values({
      writerId: session.user.id,
      title,
      topic,
      path: fileUrl,
    }).returning({ id: abstracts.id });

    // Insert Co-authors into the junction table (if any)
    if (coAuthorIdsStr) {
      const coAuthorIds: string[] = JSON.parse(coAuthorIdsStr);

      if (Array.isArray(coAuthorIds) && coAuthorIds.length > 0) {
        // Map the IDs to match our schema structure
        const coAuthorData = coAuthorIds.map(id => ({
          abstractId: newAbstract.id,
          userId: id,
        }));

        await db.insert(abstractCoauthors).values(coAuthorData);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Database insert error:', error);
    return { error: "Failed to save submission to the database." };
  }
}

// Action to get all abstracts for a user
export async function getUserAbstracts() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // Fetch abstracts where the user is the primary writer
    const primaryAbstracts = await db.query.abstracts.findMany({
      where: eq(abstracts.writerId, session.user.id),
      orderBy: [desc(abstracts.createdAt)],
    });

    // Fetch abstracts where the user is a co-author via the junction table
    const coAuthoredData = await db.select({
      abstract: abstracts
    })
    .from(abstracts)
    .innerJoin(abstractCoauthors, eq(abstracts.id, abstractCoauthors.abstractId))
    .where(eq(abstractCoauthors.userId, session.user.id));

    const coAuthoredAbstracts = coAuthoredData.map(row => row.abstract);

    // Combine and deduplicate
    const allAbstractsMap = new Map();
    primaryAbstracts.forEach(a => allAbstractsMap.set(a.id, a));
    coAuthoredAbstracts.forEach(a => allAbstractsMap.set(a.id, a));

    // Sort by newest first
    const finalAbstracts = Array.from(allAbstractsMap.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );

    return { success: true, data: finalAbstracts };
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Failed to load submissions" };
  }
}