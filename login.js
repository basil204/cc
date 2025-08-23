import fs from "fs";

// Đọc file JSON (có key "cookie")
const raw = fs.readFileSync("./cookies.json", "utf-8");
const data = JSON.parse(raw);

// Chuỗi cookie gốc
const cookieStr = data.cookie;

// Các key cần giữ lại
const allowKeys = [
  "passport_csrf_token",
  "passport_csrf_token_default",
  "_gcl_au",
  "_ga",
  "_clck",
  "_uetvid",
  "_ga_F9J0QP63RB",
  "odin_tt",
  "sid_guard",
  "uid_tt",
  "uid_tt_ss",
  "sid_tt",
  "sessionid",
  "sessionid_ss",
  "sid_ucp_v1",
  "ssid_ucp_v1",
  "store-idc",
  "store-country-code",
  "store-country-code-src",
  "cc-target-idc",
  "tt-target-idc-sign",
  "ttwid",
  "store-country-sign",
  "msToken"
];

// Parse ra object
const cookieObj = Object.fromEntries(
  cookieStr.split("; ").map(pair => {
    const [key, ...valParts] = pair.split("=");
    return [key, valParts.join("=")];
  })
);

// Lọc theo allowKeys
const filtered = allowKeys
  .filter(k => cookieObj[k])
  .map(k => `${k}=${cookieObj[k]}`)
  .join("; ");

console.log(filtered);
