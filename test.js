// capcut-login.js — FULL CODE (Node 22 + ESM)
// Cài: npm i node-fetch tough-cookie fetch-cookie
// package.json: { "type": "module" }
// Chạy: CAPCUT_EMAIL="..." CAPCUT_PASSWORD="..." node capcut-login.js

import fetch from "node-fetch";
import { CookieJar } from "tough-cookie";
import fetchCookie from "fetch-cookie";

// ====== CẤU HÌNH CỐ ĐỊNH ======
const AID = "348188";
const SDK_VERSION = "2.1.10-tiktok";
const LANGUAGE = "vi-VN";

// ====== ENV/TÙY CHỌN ======
const VERIFY_FP =
  process.env.VERIFY_FP ||
  "verify_men0a4cg_yEfkzeLx_7hft_4fKX_8ENt_fYQ6wdT6OUFB";

const EMAIL = process.env.CAPCUT_EMAIL || "gwdy9at2@manhnl.dev";
const PASSWORD = process.env.CAPCUT_PASSWORD || "capcut2025";

const APP_SDK_VERSION = process.env.APP_SDK_VERSION || "48.0.0";
const APPVR = process.env.APPVR || "5.8.0";
const LAN = process.env.LAN || "vi-VN";
const PF = process.env.PF || "7";
const LOC = process.env.LOC || "sg";
const DID = process.env.DID || "7530162609912366593";
const STORE_COUNTRY_CODE = process.env.STORE_COUNTRY_CODE || "es";
const STORE_COUNTRY_CODE_SRC = process.env.STORE_COUNTRY_CODE_SRC || "uid";

// Chữ ký (có thể cần cập nhật theo thời gian)
const SIGN = process.env.CAPCUT_SIGN || "36dfbee63db781f85b0545a8334edf67";
const SIGN_VER = process.env.CAPCUT_SIGN_VER || "1";

// (Tuỳ chọn) nạp cookie thô copy từ DevTools
const BROWSER_COOKIE_STRING = process.env.BROWSER_COOKIE_STRING || "";

// (Tuỳ chọn) ép gửi header "cookie" thủ công (không khuyến nghị, mặc định OFF)
const USE_MANUAL_COOKIE = process.env.USE_MANUAL_COOKIE === "1";

// ====== COOKIE JAR ======
const jar = new CookieJar();
const _fetch = fetchCookie(fetch, jar);

// ====== UTIL: XOR 0x05 -> hex ======
function encryptToHex(str) {
  let hex = "";
  for (const ch of str) {
    const enc = ch.charCodeAt(0) ^ 0x05;
    hex += enc.toString(16).padStart(2, "0");
  }
  return hex;
}

// ====== COOKIE HELPERS ======
async function seedCookiesFromString(cookieStr, url = "https://www.capcut.com") {
  if (!cookieStr) return;
  const parts = cookieStr.split(";").map((s) => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (!p.includes("=")) continue;
    await new Promise((resolve, reject) => {
      jar.setCookie(p, url, (err) => (err ? reject(err) : resolve()));
    });
  }
}

/**
 * Trả cookie dạng mảng đối tượng tough-cookie.
 */
async function getCookies(host) {
  return await new Promise((resolve, reject) => {
    jar.getCookies(host, (err, arr) => (err ? reject(err) : resolve(arr)));
  });
}

/**
 * Trả về chuỗi header Cookie chuẩn: "k=v; k2=v2; ..."
 */
async function getCookieHeader(host) {
  const cookies = await getCookies(host);
  return cookies.map((c) => `${c.key}=${c.value}`).join("; ");
}

/**
 * LOG cookie như bạn yêu cầu:
 * [COOKIE] https://www.capcut.com: { "cookie": "k=v; k2=v2; ..." }
 * → Đồng thời return chuỗi cookie để tái sử dụng.
 */
async function logJar(host) {
  const cookieHeader = await getCookieHeader(host);
  console.log(`[COOKIE] ${host}: { "cookie": "${cookieHeader}" }`);
  return cookieHeader;
}

// ====== PREFLIGHT ======
async function preflight() {
  const res = await _fetch("https://www.capcut.com/", {
    method: "GET",
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "vi,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    },
  });
  console.log("[PREFLIGHT] status =", res.status);
  await logJar("https://www.capcut.com");
}

// ====== LOGIN EMAIL/PASS ======
async function loginEmailPassword(email, password) {
  const url = `https://www.capcut.com/passport/web/email/login/?aid=${AID}&account_sdk_source=web&sdk_version=${encodeURIComponent(
    SDK_VERSION
  )}&language=${encodeURIComponent(LANGUAGE)}&verifyFp=${encodeURIComponent(
    VERIFY_FP
  )}`;

  const body = new URLSearchParams({
    mix_mode: "1",
    email: encryptToHex(email),
    password: encryptToHex(password),
    fixed_mix_mode: "1",
  });

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json, text/plain, */*",
    origin: "https://www.capcut.com",
    referer: "https://www.capcut.com/",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  };

  const res = await _fetch(url, { method: "POST", headers, body });
  console.log("[LOGIN] status =", res.status);
  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("[LOGIN] Raw response (not JSON):\n", text);
    throw new Error("Login response is not JSON");
  }
  if (String(data?.message).toLowerCase() !== "success") {
    console.error("[LOGIN] Response:", data);
    throw new Error("Login không thành công");
  }

  console.log("[LOGIN] OK →", {
    user_id: data?.data?.user_id,
    screen_name: data?.data?.screen_name,
    email_mask: data?.data?.email,
  });

  await logJar("https://www.capcut.com");
  return data;
}

// ====== GET NOTICE LIST (phân trang next_cursor) ======
async function getNoticeList({
  notice_type = [2, 3],
  cursor = "0",
  count = 10,
  maxPages = 5,
  verbose = true,
} = {}) {
  const url = "https://edit-api-sg.capcut.com/lv/v1/notice/get_notice_list";

  // Base headers (KHÔNG cần các sec-ch-ua, fetch-site trong Node)
  const baseHeaders = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",

    "app-sdk-version": APP_SDK_VERSION,
    appid: AID,
    appvr: APPVR,
    "device-time": Math.floor(Date.now() / 1000).toString(),
    did: DID,
    lan: LAN,
    loc: LOC,
    pf: PF,
    sign: SIGN,
    "sign-ver": SIGN_VER,
    "store-country-code": STORE_COUNTRY_CODE,
    "store-country-code-src": STORE_COUNTRY_CODE_SRC,

    origin: "https://www.capcut.com",
    referer: "https://www.capcut.com/",
  };

  // Tuỳ chọn: ép đính kèm header "cookie" thủ công (không khuyến nghị)
  if (USE_MANUAL_COOKIE) {
    const manualCookie = await getCookieHeader("https://edit-api-sg.capcut.com");
    if (manualCookie) baseHeaders.cookie = manualCookie;
  }

  let page = 0;
  let next = cursor;
  const allNotices = [];

  while (page < maxPages) {
    const body = { notice_type, cursor: next, count };
    const res = await _fetch(url, {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`[NOTICE] HTTP ${res.status} – ${text.slice(0, 300)}`);
    }

    const json = await res.json();

    if (json?.message && String(json.message).toLowerCase() !== "success") {
      throw new Error(`[NOTICE] API error: ${json.message}`);
    }

    const data = json?.data ?? {};
    const list = Array.isArray(data.notice_list) ? data.notice_list : [];

    allNotices.push(...list);

    if (verbose) {
      console.log(
        `[NOTICE] page=${page + 1} got=${list.length} has_more=${!!data.has_more} next_cursor=${data.next_cursor}`
      );
    }

    if (!data.has_more || !data.next_cursor) break;
    next = String(data.next_cursor);
    page += 1;
  }

  // Log cookie header JSON như yêu cầu (cho domain edit-api)
  await logJar("https://edit-api-sg.capcut.com");

  // In ngắn gọn
  if (verbose) {
    for (const n of allNotices) {
      const id = n?.id;
      const t = n?.content?.title;
      const type = n?.notice_type;
      const created = n?.create_time;
      console.log(`- [${type}] ${id} | ${t} | create_time=${created}`);
    }
  }

  return allNotices;
}

// ====== MAIN ======
(async () => {
  try {
    // (Tuỳ chọn) nạp cookie thô copy từ DevTools
    if (BROWSER_COOKIE_STRING) {
      await seedCookiesFromString(BROWSER_COOKIE_STRING, "https://www.capcut.com");
      console.log("[SEED] Đã nạp cookie (capcut.com)");
      await seedCookiesFromString(
        BROWSER_COOKIE_STRING,
        "https://edit-api-sg.capcut.com"
      );
      console.log("[SEED] Đã nạp cookie (edit-api-sg.capcut.com)");
    }

    // 1) Preflight
    await preflight();

    // 2) Login
    await loginEmailPassword(EMAIL, PASSWORD);

    // 3) In cookie header JSON (có thể copy dán vào headers DevTools)
    await logJar("https://www.capcut.com");

    // 4) Gọi notice list
    const notices = await getNoticeList({
      notice_type: [2, 3],
      cursor: "0",
      count: 10,
      maxPages: 3,
      verbose: true,
    });

    console.log(`[TOTAL] notices = ${notices.length}`);
  } catch (e) {
    console.error("ERROR:", e?.message || e);
    process.exit(1);
  }
})();
