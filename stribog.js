//ALEX HEROEVICH IF U WANT TO MAKE A NEW KEY ==> USE CONSOLE TO MAKE NEW HASH 

class Stribog {
    constructor(outputSize = 512) {
        if (outputSize !== 256 && outputSize !== 512) {
            throw new Error('Output size must be 256 or 512 bits');
        }
        this.outputSize = outputSize;
        this.blockSize = 64; 
        this.hashSize = outputSize / 8;
        
        this.initVectors = {
            512: new Uint8Array([
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
            ]),
            256: new Uint8Array([
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
                0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
            ])
        };

        this.sbox = new Uint8Array([
            0xFC, 0xEE, 0xDD, 0x11, 0xCF, 0x6E, 0x31, 0x16,
            0xFB, 0xC4, 0xFA, 0xDA, 0x23, 0xC5, 0x04, 0x4D,
            0xE9, 0x77, 0xF0, 0xDB, 0x93, 0x2E, 0x99, 0xBA,
            0x17, 0x36, 0xF1, 0xBB, 0x14, 0xCD, 0x5F, 0xC1,
            0xF9, 0x18, 0x65, 0x5A, 0xE2, 0x5C, 0xEF, 0x21,
            0x81, 0x1C, 0x3C, 0x42, 0x8B, 0x01, 0x8E, 0x4F,
            0x05, 0x84, 0x02, 0xAE, 0xE3, 0x6A, 0x8F, 0xA0,
            0x06, 0x0B, 0xED, 0x98, 0x7F, 0xD4, 0xD3, 0x1F,
            0xEB, 0x34, 0x2C, 0x51, 0xEA, 0xC8, 0x48, 0xAB,
            0xF2, 0x2A, 0x68, 0xA2, 0xFD, 0x55, 0x0C, 0x0D,
            0xC0, 0x76, 0xE0, 0x03, 0x60, 0x45, 0x8C, 0x49,
            0x46, 0x29, 0x28, 0xCE, 0x6B, 0xC6, 0x4E, 0x9B,
            0x3A, 0x47, 0x7E, 0x53, 0xE1, 0x7B, 0x24, 0x35,
            0x6C, 0xFF, 0x69, 0xF4, 0x9D, 0x70, 0x67, 0xE8,
            0x71, 0x79, 0x09, 0xBD, 0x82, 0x33, 0x5B, 0x95,
            0x22, 0xE6, 0x13, 0xAE, 0x43, 0xA9, 0xC7, 0x3F,
            0xAC, 0x7A, 0x3B, 0x12, 0x0F, 0x7D, 0x1E, 0x2D,
            0xCC, 0xB9, 0xB4, 0x96, 0xD8, 0x86, 0xF3, 0xE4,
            0x78, 0xA1, 0xF7, 0x0E, 0x64, 0x8A, 0x5D, 0xE5,
            0x3D, 0xD0, 0x20, 0x9C, 0x9E, 0x2B, 0x73, 0xA8,
            0x4A, 0xCA, 0x92, 0x44, 0x00, 0x62, 0xC3, 0x88,
            0x94, 0x56, 0x8D, 0xF6, 0x90, 0x19, 0x3E, 0x52,
            0x1B, 0x5E, 0x41, 0x54, 0xA5, 0x4B, 0x1D, 0xC2,
            0xE7, 0x07, 0x0A, 0x57, 0x2F, 0xAF, 0x6D, 0x32,
            0x1A, 0xD1, 0x91, 0x4C, 0xBD, 0x72, 0x30, 0xCB,
            0x39, 0x27, 0x7C, 0x97, 0x6F, 0x75, 0xDC, 0xAD,
            0x5E, 0x15, 0x61, 0x08, 0x3B, 0x50, 0x83, 0x26,
            0x40, 0x63, 0x25, 0xFE, 0x59, 0xA7, 0xBE, 0x37,
            0x66, 0x74, 0xA6, 0x80, 0xF8, 0x1C, 0x0C, 0x2B,
            0xA4, 0x5F, 0xB5, 0xCF, 0x85, 0xE3, 0x3F, 0xD9,
            0x9F, 0x89, 0xB0, 0x4C, 0xB7, 0xEC, 0x09, 0xD5,
            0x58, 0x71, 0x58, 0xCF, 0x5F, 0x3A, 0x9D, 0xB2
        ]);
        

        this.invSbox = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            this.invSbox[this.sbox[i]] = i;
        }
    }

    lTransform(data) {
        const result = new Uint8Array(64);
        const temp = new Uint8Array(64);
        
        for (let i = 0; i < 64; i++) {
            temp[i] = data[i];
        }
        
        for (let i = 0; i < 64; i++) {
            let byte = 0;
            for (let j = 0; j < 8; j++) {
                if (i - j >= 0) {
                    byte ^= this.mulGF2(temp[i - j], this.getA(i, j));
                }
            }
            result[i] = byte;
        }
        
        return result;
    }
    

    mulGF2(a, b) {
        let result = 0;
        while (b > 0) {
            if (b & 1) result ^= a;
            a = (a << 1) ^ (a & 0x80 ? 0xC3 : 0);
            b >>= 1;
        }
        return result;
    }
    

    getA(i, j) {
        const A = [
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9],
            [0x8e, 0x20, 0x5e, 0x43, 0x3c, 0x1f, 0x29, 0xb9]
        ];
        return A[i % 8][j];
    }
    

    sTransform(data) {
        const result = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            result[i] = this.sbox[data[i]];
        }
        return result;
    }
    

    pTransform(data) {
        const result = new Uint8Array(64);
        const tau = [
            0, 8, 16, 24, 32, 40, 48, 56,
            1, 9, 17, 25, 33, 41, 49, 57,
            2, 10, 18, 26, 34, 42, 50, 58,
            3, 11, 19, 27, 35, 43, 51, 59,
            4, 12, 20, 28, 36, 44, 52, 60,
            5, 13, 21, 29, 37, 45, 53, 61,
            6, 14, 22, 30, 38, 46, 54, 62,
            7, 15, 23, 31, 39, 47, 55, 63
        ];
        
        for (let i = 0; i < 64; i++) {
            result[i] = data[tau[i]];
        }
        return result;
    }
    

    compress(N, h, m) {
        let K = this.xorArrays(h, N);
        K = this.transform(K);
        
        let result = this.xorArrays(K, m);
        result = this.transform(result);
        result = this.xorArrays(result, h);
        
        return result;
    }
    

    transform(data) {
        let result = this.sTransform(data);
        result = this.pTransform(result);
        result = this.lTransform(result);
        return result;
    }
    

    xorArrays(a, b) {
        const result = new Uint8Array(a.length);
        for (let i = 0; i < a.length; i++) {
            result[i] = a[i] ^ b[i];
        }
        return result;
    }
    
    padMessage(message) {
        const messageLength = message.length;
        const paddingSize = (this.blockSize - (messageLength % this.blockSize)) % this.blockSize;
        
        const padded = new Uint8Array(messageLength + paddingSize + 8);
        padded.set(message);
        
        if (paddingSize > 0) {
            padded[messageLength] = 0x80;
        }
        
        const bitLength = messageLength * 8;
        for (let i = 0; i < 8; i++) {
            padded[messageLength + paddingSize + i] = (bitLength >> (i * 8)) & 0xFF;
        }
        
        return padded;
    }
    

    hash(message, encoding = 'utf8') {

        let messageBytes;
        if (typeof message === 'string') {
            if (encoding === 'hex') {
                messageBytes = this.hexToBytes(message);
            } else {
                messageBytes = this.stringToBytes(message);
            }
        } else if (message instanceof Uint8Array) {
            messageBytes = message;
        } else if (Array.isArray(message)) {
            messageBytes = new Uint8Array(message);
        } else {
            throw new Error('Unsupported message type');
        }
        
        const paddedMessage = this.padMessage(messageBytes);
        
        let h = new Uint8Array(this.hashSize);
        let N = new Uint8Array(this.hashSize);
        let Sigma = new Uint8Array(this.hashSize);
        
        if (this.hashSize === 64) {
            h.set(this.initVectors[512]);
        } else {
            h.set(this.initVectors[256]);
        }
        
        for (let i = 0; i < paddedMessage.length; i += this.blockSize) {
            const m = paddedMessage.slice(i, i + this.blockSize);
            
            N = this.addMod(N, new Uint8Array(this.blockSize));
            N[0] = (N[0] + 1) & 0xFF;
            
            Sigma = this.addMod(Sigma, m);
            
            h = this.compress(N, h, m);
        }
        
        h = this.compress(N, h, Sigma);
        
        if (this.hashSize === 32) {
            h = h.slice(0, 32);
        }
        
        return h;
    }
    
    addMod(a, b) {
        const result = new Uint8Array(a.length);
        let carry = 0;
        
        for (let i = 0; i < a.length; i++) {
            const sum = a[i] + b[i] + carry;
            result[i] = sum & 0xFF;
            carry = sum >> 8;
        }
        
        return result;
    }
    
    stringToBytes(str) {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }
    
    hexToBytes(hex) {
        if (hex.length % 2 !== 0) {
            throw new Error('Invalid hex string');
        }
        
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }
    
    bytesToHex(bytes) {
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    hashHex(message, encoding = 'utf8') {
        const hashBytes = this.hash(message, encoding);
        return this.bytesToHex(hashBytes);
    }
}
