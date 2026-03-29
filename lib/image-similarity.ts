import sharp from 'sharp';
import imghash from 'imghash';
import fs from 'fs';
import path from 'path';

/**
 * Calculate perceptual hash for an image
 * @param imagePath Absolute path to image file
 * @returns Perceptual hash string
 */
export async function calculateImageHash(imagePath: string): Promise<string> {
  try {
    return await imghash.hash(imagePath, 16); // 16 bits precision
  } catch (error) {
    console.error(`Error hashing image ${imagePath}:`, error);
    throw error;
  }
}

/**
 * Calculate Hamming distance between two hash strings
 * Lower distance = more similar images
 * @param hash1 First perceptual hash
 * @param hash2 Second perceptual hash
 * @returns Hamming distance (0-256)
 */
export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) {
    throw new Error('Hash lengths must be equal');
  }

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
}

/**
 * Get dominant colors from an image
 * @param imagePath Absolute path to image file
 * @returns Array of RGB colors
 */
export async function getDominantColors(imagePath: string): Promise<number[][]> {
  try {
    const image = sharp(imagePath);
    const { data, info } = await image
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Simple color histogram (could be improved with k-means clustering)
    const colors: number[][] = [];
    for (let i = 0; i < data.length; i += info.channels * 10) {
      colors.push([
        data[i],
        data[i + 1],
        data[i + 2]
      ]);
    }

    return colors.slice(0, 5); // Return top 5 sampled colors
  } catch (error) {
    console.error(`Error extracting colors from ${imagePath}:`, error);
    return [];
  }
}

/**
 * Compare two images for visual similarity
 * @param image1Path First image path
 * @param image2Path Second image path
 * @returns Similarity score (0-100, where 100 is identical)
 */
export async function compareImages(image1Path: string, image2Path: string): Promise<number> {
  try {
    const [hash1, hash2] = await Promise.all([
      calculateImageHash(image1Path),
      calculateImageHash(image2Path)
    ]);

    const distance = hammingDistance(hash1, hash2);
    const maxDistance = hash1.length * 4; // Maximum possible hamming distance for hex string
    const similarity = Math.max(0, Math.min(100, ((maxDistance - distance) / maxDistance) * 100));

    return Math.round(similarity);
  } catch (error) {
    console.error(`Error comparing images:`, error);
    return 0;
  }
}

export interface SimilarImageGroup {
  images: string[]; // Array of image filenames
  similarity: number; // Average similarity score
  count: number; // Number of images in group
}

/**
 * Find groups of similar images from a list of image paths
 * @param imagePaths Array of absolute image paths
 * @param threshold Similarity threshold (0-100), default 85
 * @returns Array of similar image groups
 */
export async function findSimilarImages(
  imagePaths: string[],
  threshold: number = 85
): Promise<SimilarImageGroup[]> {
  // Calculate hashes for all images
  const imageHashes: { path: string; hash: string; filename: string }[] = [];

  for (const imagePath of imagePaths) {
    try {
      const hash = await calculateImageHash(imagePath);
      imageHashes.push({
        path: imagePath,
        hash,
        filename: path.basename(imagePath)
      });
    } catch (error) {
      console.error(`Failed to hash ${imagePath}:`, error);
    }
  }

  // Find similar groups using hash comparison
  const groups: Map<string, Set<string>> = new Map();
  const processed = new Set<string>();

  for (let i = 0; i < imageHashes.length; i++) {
    if (processed.has(imageHashes[i].filename)) continue;

    const similar: string[] = [imageHashes[i].filename];
    processed.add(imageHashes[i].filename);

    for (let j = i + 1; j < imageHashes.length; j++) {
      if (processed.has(imageHashes[j].filename)) continue;

      const distance = hammingDistance(imageHashes[i].hash, imageHashes[j].hash);
      const maxDistance = imageHashes[i].hash.length * 4;
      const similarity = ((maxDistance - distance) / maxDistance) * 100;

      if (similarity >= threshold) {
        similar.push(imageHashes[j].filename);
        processed.add(imageHashes[j].filename);
      }
    }

    // Only create group if there are 2+ similar images
    if (similar.length >= 2) {
      const groupKey = similar.sort().join('-');
      groups.set(groupKey, new Set(similar));
    }
  }

  // Convert to result format
  const result: SimilarImageGroup[] = Array.from(groups.values()).map(group => ({
    images: Array.from(group),
    similarity: threshold, // Simplified - all are above threshold
    count: group.size
  }));

  return result;
}

// Lalou
