import * as crypto from 'crypto';

export class EncryptionUtil {
  private static readonly ENCRYPTION_KEY = 'MAKV2SPBNI99212';
  private static readonly SALT = Buffer.from([
    0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
  ]);

  static encrypt(clearText: string): string {
    if (!clearText || clearText.trim() === '') {
      return '';
    }

    const clearBytes = Buffer.from(clearText, 'utf16le');
    
    const key = crypto.pbkdf2Sync(
      this.ENCRYPTION_KEY,
      this.SALT,
      1000,
      32,
      'sha1'
    );
    
    const iv = crypto.pbkdf2Sync(
      this.ENCRYPTION_KEY,
      this.SALT,
      1000,
      16,  
      'sha1'
    );

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(clearBytes);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return encrypted.toString('base64');
  }

  static decrypt(cipherText: string): string {
    if (!cipherText || cipherText.trim() === '') {
      return '';
    }

    const cipherBytes = Buffer.from(cipherText, 'base64');
    
    const key = crypto.pbkdf2Sync(
      this.ENCRYPTION_KEY,
      this.SALT,
      1000,
      32,
      'sha1'
    );
    
    const iv = crypto.pbkdf2Sync(
      this.ENCRYPTION_KEY,
      this.SALT,
      1000,
      16,
      'sha1'
    );

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(cipherBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf16le');
  }
}