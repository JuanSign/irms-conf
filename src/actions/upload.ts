'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/auth';

// Initialize the S3 Client for Cloudflare R2
const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(filename: string, contentType: string) {
  // Verify the user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized. Please log in." };
  }

  // Sanitize the filename to prevent URL issues and make it unique
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueKey = `abstracts/${Date.now()}-${cleanFilename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: uniqueKey,
    ContentType: contentType,
  });

  try {
    // Generate a Presigned URL valid for 1 hour (3600 seconds)
    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    // Clean up the base URL just in case you added a trailing slash in .env
    const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
    const fileUrl = `${baseUrl}/${uniqueKey}`;

    return { presignedUrl, fileUrl };
  } catch (error) {
    console.error('R2 Presign Error:', error);
    return { error: "Failed to generate secure upload link." };
  }
}