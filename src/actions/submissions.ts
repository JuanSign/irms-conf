'use server';

import { db } from '@/db';
import { users, abstracts, abstractCoauthors } from '@/db/schema';
import { ilike, or, eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import { TopicType } from '@/types/submission';

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

// Action to get all abstracts for a user
export async function getUserAbstracts() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const data = await db.query.abstracts.findMany({
      where: (abstracts, { exists, and }) => or(
        eq(abstracts.writerId, session.user.id),
        exists(
          db.select()
            .from(abstractCoauthors)
            .where(
              and(
                eq(abstractCoauthors.abstractId, abstracts.id),
                eq(abstractCoauthors.userId, session.user.id)
              )
            )
        )
      ),
      with: {
        // Include comments so the SubmissionCard can render feedback
        comments: {
          orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        },
        author: {
          columns: {
            name: true,
          }
        }
      },
      orderBy: [desc(abstracts.createdAt)],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Failed to load submissions" };
  }
}

// Action to submit the abstract
export async function submitAbstract(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const topic = formData.get('topic') as TopicType;
  const fileUrl = formData.get('fileUrl') as string;
  const coAuthorIdsStr = formData.get('coAuthors') as string;

  if (!id || !title || !topic || !fileUrl) return { error: "Missing fields." };

  try {
    await db.insert(abstracts).values({
      id,
      writerId: session.user.id,
      title,
      topic,
      path: fileUrl,
    });

    if (coAuthorIdsStr) {
      const coAuthorIds: string[] = JSON.parse(coAuthorIdsStr);
      if (coAuthorIds.length > 0) {
        const coAuthorData = coAuthorIds.map(userId => ({ abstractId: id, userId }));
        await db.insert(abstractCoauthors).values(coAuthorData);
      }
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save submission." };
  }
}

// Action to update existing abstract
export async function updateAbstract(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const topic = formData.get('topic') as TopicType;
  const fileUrl = formData.get('fileUrl') as string;
  const coAuthorIdsStr = formData.get('coAuthors') as string;

  try {
    const existing = await db.query.abstracts.findFirst({ where: eq(abstracts.id, id) });
    if (!existing || existing.writerId !== session.user.id) return { error: "Unauthorized." };

    await db.update(abstracts)
      .set({ title, topic, path: fileUrl, status: 'Under Review' })
      .where(eq(abstracts.id, id));

    await db.delete(abstractCoauthors).where(eq(abstractCoauthors.abstractId, id));

    if (coAuthorIdsStr) {
      const coAuthorIds: string[] = JSON.parse(coAuthorIdsStr);
      if (coAuthorIds.length > 0) {
        const coAuthorData = coAuthorIds.map(userId => ({ abstractId: id, userId }));
        await db.insert(abstractCoauthors).values(coAuthorData);
      }
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update." };
  }
}