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

export async function uploadAnnotationToR2(fileBuffer: Buffer, fileName: string, contentType: string) {
  const session = await auth();

  // Extra security: Ensure only admins can upload annotations
  if (!session?.user?.id || session.user.role !== "admin") {
    return { error: "Unauthorized." };
  }

  const fileId = randomUUID();
  const cleanFileName = fileName.replace(/\s+/g, '_'); // Remove spaces
  const objectKey = `annotations/${fileId}-${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: objectKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  try {
    // Send the buffer directly to R2
    await S3.send(command);

    const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
    const fileUrl = `${baseUrl}/${objectKey}`;

    return { fileUrl };
  } catch (error) {
    console.error('R2 Direct Upload Error:', error);
    return { error: "Failed to upload annotation to R2." };
  }
}

export async function getPaymentProofUploadUrl(contentType: string, fileName: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "user") {
    return { error: "Unauthorized." };
  }

  const fileId = randomUUID();

  const extension = fileName.split('.').pop()?.toLowerCase() || 'bin';
  const objectKey = `payments/${fileId}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: objectKey,
    ContentType: contentType,
  });

  try {
    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const baseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '');
    const fileUrl = `${baseUrl}/${objectKey}`;

    return { presignedUrl, fileUrl };
  } catch (error) {
    console.error('R2 Payment Presign Error:', error);
    return { error: "Failed to generate secure upload link for payment proof." };
  }
}