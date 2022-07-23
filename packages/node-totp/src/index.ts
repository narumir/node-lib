import crypto from "crypto";

type OTPAlgorithm = "sha1" | "sha256" | "sha512";

export type TOTPOption = {
    algorithm?: OTPAlgorithm;
    period?: 30 | 60;
    digit?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export class TOTP {
    private period: number = 30;
    private digit: number = 6;
    private algorithm: OTPAlgorithm = "sha1";

    private static DIGITS_POWER = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

    private generateHMAC(secret: string, timestamp: number) {
        const time = Math.floor(Math.round(timestamp / 1000) / this.period)
            .toString(16)
            .padStart(16, "0");
        const key = this.convertBase32ToHex(secret);
        const result = crypto.createHmac(this.algorithm, Buffer.from(key, "hex"))
            .update(Buffer.from(time, "hex"))
            .digest("hex");
        return Buffer.from(result, "hex");
    }

    private convertBase32ToHex(key: string) {
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        key = key.replace(/=+$/, "");
        let bits = "";
        for (let i = 0; i < key.length; i++) {
            const val = base32chars.indexOf(key.charAt(i).toUpperCase());
            if (val === -1) {
                throw new Error("Invalid base32 charactor in key");
            }
            bits += val.toString(2).padStart(5, "0");
        }
        let hex = "";
        for (let i = 0; i + 8 <= bits.length; i += 8) {
            hex += parseInt(bits.substring(i, i + 8), 2)
                .toString(16)
                .padStart(2, "0");
        }
        return hex;
    }

    private generateTOTP(hmac: Buffer) {
        const offset = hmac[hmac.length - 1] & 0xf;
        const binary =
            ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff);
        const otp = binary % TOTP.DIGITS_POWER[this.digit];
        return otp.toString().padStart(this.digit, "0");
    }

    constructor({ period = 30, algorithm = "sha1", digit = 6 }: TOTPOption = {}) {
        if (period != 30 && period != 60) {
            throw new TypeError("Invalid period value, Must 30 or 60.");
        }
        this.period = period;
        if (digit < 1 && digit > 9) {
            throw new TypeError("Invalid digit value, Must between 1 and 9.");
        }
        this.digit = digit;
        if (!["sha1", "sha256", "sha512"].includes(algorithm)) {
            throw new TypeError("Invalid algorithm, Must sha1, sha256 or sha 512.");
        }
        this.algorithm = algorithm;
    }

    public generate(secret: string, timestamp: number = Date.now()) {
        const hmac = this.generateHMAC(secret, timestamp);
        const otp = this.generateTOTP(hmac);
        return otp;
    }
}
