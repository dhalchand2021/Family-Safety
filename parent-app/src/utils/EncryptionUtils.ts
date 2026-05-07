import { Buffer } from 'buffer';
import * as CryptoJS from 'crypto-js';

export const EncryptionUtils = {
  encrypt: (data: string, secretKey: string) => {
    const iv = CryptoJS.lib.WordArray.random(12);
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding
    });
    
    return iv.toString(CryptoJS.enc.Base64) + encrypted.toString();
  },

  decrypt: (encryptedData: string, secretKey: string) => {
    const iv = CryptoJS.enc.Base64.parse(encryptedData.substring(0, 16)); // Base64 12 bytes
    const cipherText = encryptedData.substring(16);
    
    const decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(secretKey), {
      iv: iv,
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
