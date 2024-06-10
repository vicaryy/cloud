import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private _secretKey: string = "1234";

    constructor() { }


    async encrypt(ab: ArrayBuffer): Promise<ArrayBuffer> {
        const wordArray = CryptoJS.lib.WordArray.create(ab);
        const encrypted = CryptoJS.AES.encrypt(wordArray, this._secretKey);
        const encoder = new TextEncoder();
        return encoder.encode(encrypted.toString()).buffer;
    }

    async decrypt(ab: ArrayBuffer): Promise<ArrayBuffer> {
        const textDecoder = new TextDecoder();
        const decodedArrayBuffer = textDecoder.decode(ab);
        const decodedString = CryptoJS.AES.decrypt(decodedArrayBuffer, this._secretKey);
        return this.convertWordArrayToUint8Array(decodedString);
    }

    private convertWordArrayToUint8Array(wordArray: any): ArrayBuffer {
        var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
        var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
        var uInt8Array = new Uint8Array(length), index = 0, word, i;
        for (i = 0; i < length; i++) {
            word = arrayOfWords[i];
            uInt8Array[index++] = word >> 24;
            uInt8Array[index++] = (word >> 16) & 0xff;
            uInt8Array[index++] = (word >> 8) & 0xff;
            uInt8Array[index++] = word & 0xff;
        }
        return uInt8Array;
    }
}
