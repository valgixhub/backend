import CryptoES from 'crypto-es'
import { AESEncrypt, VOProto } from '../vendor/interfaces.js'

export default class VOP {

    action?: string;

    /**
    * Creates an instance of the VOP class.
    * @param {string} action - The action to be performed (encrypt or decrypt).
    * 
    * @example
    * // Example:
    * new VOP({action: 'encrypt'}).data(data)
    */

    constructor(ops? : VOProto) {
        this.action = ops?.action
    }

    /** Encrypts or decrypts data depending on the specified action. */

    data(e : AESEncrypt) {

        if(this.action === 'encrypt') {

            const key = CryptoES.enc.Hex.parse(e.Key)
            const iv = CryptoES.enc.Hex.parse(e.Vi)

            const encrypted = CryptoES.AES.encrypt(e.Text, key, { iv: iv })

            return encrypted

        }

        if(this.action === 'decrypt') {

            const key = CryptoES.enc.Hex.parse(e.Key)
            const iv = CryptoES.enc.Hex.parse(e.Vi)

            const decrypted = CryptoES.AES.decrypt(e.Text, key, { iv: iv })

            return decrypted.toString(CryptoES.enc.Utf8)

        }

    }

    /**
     * Generates a random initialization vector of a given length.
     * @param {number} length - Generation length
     * @example
     * // Example:
     * new VOP().iv(32)
    */

    iv(length: number) {
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;

    }

}