/** @format */

import CryptoJS from 'crypto-js';
import {JSEncrypt} from 'jsencrypt';
let key = ''; // 前端生成key
//随机生成32AES密钥
export function desStrPro() {
  var desStr = '';
  var arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];
  for (var i = 0; i < 32; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1));
    desStr += arr[pos];
  }
  return desStr;
}
// AES加密
function encodeDes(data, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(data, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

// AES解密
export function decodeAesString(data, _key) {
  var key = CryptoJS.enc.Utf8.parse(_key);
  var decrypted = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/*
 * 随机字符串,前端生成AES随机key,然后加密数据
 * data: 要加密的数据
 */
export function encodeAesString(data) {
  key = desStrPro();
  return encodeDes(data, key);
}

/*
 * RSA加密
 * publicE：公钥
 * key: 加密前端随机生成key
 */
const publicE =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmLjHgszTxQX+t73MiKNzTF2UYc7wsimu5u/wk5QKx50JoggjGyYlQRZobaOXYL+Uud9o6bR4UpayxQXFxlc1r4fq/s3qTnTfSD36kX0fGtBk6T/SDX+L15xZCtlscjbh0VtFuh7kHvthjF8X8vQmQMRAHxKcMA0DodAMiynhWM5tNICNJ6dKZnrxyoX5lYP2zW5wCaHyvFXIULPR2nUj96xx46G3sIAZ0Wa3ONWsqQgBu3jHnlHcsYI+UPmMxOdosmynRKead8oKgEMrtujBJeeNdnIHSiBMfHhAhSZ9dv9bbyAiVMwPdznwtznbYCyc4H33S3ErgGMHsm1A3/GLUQIDAQAB';
export function encryptRAS() {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicE);
  return encrypt.encrypt(key); // key: 加密的数据
}

/*
 * RSA解密
 * PRIVATE_KEY：私钥
 * resData：要解密的数据
 */
const PRIVATE_KEY =
  'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIygi1qlNDjW5l8H3/f338TSwjtgfp4Gz8cPqZFAs7aBN+Wnnh1taIQ37SwCe95FgSyxSSsOOyOJKaY+szN7yB3qXE9zt7gcPVVohwKHJBgzCFNmaRXgAlRQdw+Yzhr9BjS1kqBK40+jE8iO1aBIlUJMVfzRRal61/XY09Hls7YNAgMBAAECgYB8ZyngLnVcMv/o4ZaIToduHuQkkuBv+6ajen+PN6XDtdw1FWsSrU7gaHkvjaL2ppX3a35G0HgQn65wmtb8nGwSersDQaB0vp81W42ioF0oIKhcaW+4xAa3d0bpCRlQYSrDcOQgloglhXyF4n9I3kNGBJMcF3ZrsCG0a4lFmw+LIQJBAMdqY9J9G2k65CeEWmgbvxp4pNmL4ySOpQ5/ZSB22z2UnBKrtCAyZvR1uw+X5NNA9wCjKhsnS3qMIHTDXTzQmIMCQQC0h74TT+uVfuj1QqxwkEa8kql9p/QnuaXevy4ONtl4mnJmCf5h+Kvc61061EW7Jf/gqK6QBvfZBsDPAM08T5IvAkBKuZU6VOMmpYjFPhVambscwkSTuJWfJ0y2iApvBdrV0pBBdtIClqB5znwQNczrVJa6SGoIzsq72zJ2TpbrqQbdAkB9XEmEVZoNDLyuGydtXvKP3fQuWqOztjnVbMKJglMPaYiJDOWFmM2XMiViRadKZv/BPMFDKGORZBwdYrwh5ktnAkADjTNfWLfUBRztKPxncihHGBi1MkyVJxCtIVRKgKPNS0QY8riowD2ObRncjTxnyUy0h1R8XhFdhZNlbm44DfIT';
export function decryptRAS(resData) {
  console.log(resData);
  var decrypt = new JSEncrypt();
  decrypt.setPrivateKey(PRIVATE_KEY);
  const data = decrypt.decrypt(resData); // 解密
  return data;
}
