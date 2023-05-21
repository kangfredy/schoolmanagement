import * as crypto from "crypto"

export const encodeData = (data: any, key: any) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, crypto.randomBytes(16));
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  };
  
export  const decodeData = (encodedData: any, key: any) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16));
    let decrypted = decipher.update(encodedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };
  
  // Usage
  //const data = 'Sensitive information';
const keyString = 'SMKPGRILAHAT';
const salt = crypto.randomBytes(16); // Generate a random salt
export const key = crypto.pbkdf2Sync(keyString, salt, 10000, 32, 'sha256'); 