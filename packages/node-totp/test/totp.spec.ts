import {
    TOTP,
} from "src/index";

test("HMAC-SHA-1", () => {
    const timestamp = 1658305632083;
    const otp = new TOTP({ algorithm: "sha1" });
    const token = otp.generate("TL5BNHAVM3OOD4I2", timestamp);
    expect(token)
        .toEqual("704305");
});
