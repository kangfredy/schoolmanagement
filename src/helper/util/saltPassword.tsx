import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Pad the secret key to the desired length
function padKey(secretKey: string, length: number): Buffer {
  const keyBuffer = Buffer.alloc(length);
  const keyData = Buffer.from(secretKey, 'utf8');

  keyData.copy(keyBuffer);
  return keyBuffer;
}

// AES encryption function
export function encodeData(message: string, secretKey: string): string {
  const key = padKey(secretKey, 32); // 32 bytes for AES-256
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const encryptedMessage = iv.toString('base64') + ':' + encrypted;
  return encryptedMessage;
}

// AES decryption function
export function decodeData(encryptedMessage: string, secretKey: string): string {
  const [ivString, encrypted] = encryptedMessage.split(':');
  const iv = Buffer.from(ivString, 'base64');
  const key = padKey(secretKey, 32); // 32 bytes for AES-256
  const decipher = createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Usage
export const key = 'SMKPGRILAHAT';