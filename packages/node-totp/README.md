nodejs용 TOTP 라이브러리 입니다.

https://datatracker.ietf.org/doc/html/rfc6238

## install

```
$ npm install @narumir/node-totp
```

## use

```
import {
    TOTP,
} from "@narumir/node-totp";
const otp = new TOTP({ algorithm: "sha1" });
const token = otp.generate("TL5BNHAVM3OOD4I2", Date.now());
console.log(token);
```
