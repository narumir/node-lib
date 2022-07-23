import crypto from "crypto";

export const RTMP_HANDSHAKE_SIZE = 1536;

export enum RTMP_HANDSHAKE_STATUS {
    UNINITIALIZED = 0,
    RECEIVE_C0 = 1,
    RECEIVE_C1 = 2,
    RECEIVE_C2 = 3,
    DONE = 4,
}

export enum RTMP_MESSAGE_TYPE {
    TYPE_0 = 0,
    TYPE_1 = 1,
    TYPE_2 = 2,
    TYPE_3 = 3,
};

export const generateS0S1S2 = () => {
    const timezero = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
    const randomBytes1 = crypto.randomBytes(RTMP_HANDSHAKE_SIZE - 8);
    const randomBytes2 = crypto.randomBytes(RTMP_HANDSHAKE_SIZE - 8);
    const S0 = Buffer.alloc(1, 3);
    const S1 = Buffer.concat([timezero, randomBytes1]);
    const S2 = Buffer.concat([timezero, randomBytes2]);
    return Buffer.concat([S0, S1, S2]);
};
