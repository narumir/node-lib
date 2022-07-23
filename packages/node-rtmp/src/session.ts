import {
    Socket,
} from "net";
import {
    generateS0S1S2,
    RTMP_HANDSHAKE_STATUS,
    RTMP_HANDSHAKE_SIZE,
} from "./utils";

const MAX_CHUNK_HEADER = 18;

export class RTMPSession {
    private handshakeStatus = RTMP_HANDSHAKE_STATUS.UNINITIALIZED;
    private version = 0;

    constructor(private socket: Socket) {
        this.socket.on("data", this.onData.bind(this));
    }

    private onData(data: Buffer) {
        let bytes = data.length;
        while (bytes > 0) {
            switch (this.handshakeStatus) {
                case RTMP_HANDSHAKE_STATUS.UNINITIALIZED:
                    this.handshakeStatus = RTMP_HANDSHAKE_STATUS.RECEIVE_C0;
                    break;
                case RTMP_HANDSHAKE_STATUS.RECEIVE_C0:
                    this.handshakeStatus = RTMP_HANDSHAKE_STATUS.RECEIVE_C1;
                    this.version = data.readInt8(0);
                    bytes -= 1;
                    break;
                case RTMP_HANDSHAKE_STATUS.RECEIVE_C1:
                    if (bytes !== RTMP_HANDSHAKE_SIZE) {
                        throw new Error("RTMP Handshake size error");
                    }
                    this.handshakeStatus = RTMP_HANDSHAKE_STATUS.RECEIVE_C2;
                    this.socket.write(generateS0S1S2());
                    bytes = 0;
                    break;
                case RTMP_HANDSHAKE_STATUS.RECEIVE_C2:
                    this.handshakeStatus = RTMP_HANDSHAKE_STATUS.DONE;
                    break;
                case RTMP_HANDSHAKE_STATUS.DONE:
                    if (bytes === RTMP_HANDSHAKE_SIZE) {
                        return;
                    }
                    return this.readChunk(data);
                default:
                    throw new Error("Unknown RTMP Handshake Status");
            }
        }
    }

    private readChunk(data: Buffer) {
        console.log(data);
        // const header = new RTMPChunk(data);
        // console.log(header);
        // console.log(header.chunkData.toString("hex"));

    }
    private sendACK() {
        Buffer.from("02000000000004030000000000000000", "hex")
    }

}
