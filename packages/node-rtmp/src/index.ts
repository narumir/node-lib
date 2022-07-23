import net from "net";
import { RTMPSession } from "./session";

const port = 1935;
const server = net.createServer((client) => {
    const session = new RTMPSession(client);
});

server.listen(port, "0.0.0.0", () => {
    console.info(`The RTMP server started at ${port}`);
});
