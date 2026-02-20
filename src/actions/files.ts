'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/auth';
import { randomUUID } from 'crypto';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(contentType: string, existingId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  const fileId = existingId || randomUUID();
  const objectKey = `abstracts/${fileId}.pdf`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: objectKey,
    ContentType: contentType,
  });

  try {
    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
    const fileUrl = `${baseUrl}/${objectKey}`;

    return { presignedUrl, fileUrl, fileId };
  } catch (error) {
    console.error('R2 Presign Error:', error);
    return { error: "Failed to generate secure upload link." };
  }
}