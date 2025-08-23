import fetch from "node-fetch"; // nếu Node 18+ có thể bỏ import này

const url = "https://edit-api-sg.capcut.com/lv/v1/notice/get_notice_list";

const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "vi,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5,zh;q=0.4",
  "app-sdk-version": "48.0.0",
  "appid": "348188",
  "appvr": "5.8.0",
  "cache-control": "no-cache",
  "content-type": "application/json",
  "device-time": "1755879126",
  "did": "7530162609912366593",
  "lan": "vi-VN",
  "loc": "sg",
  "pf": "7",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "sign": "36dfbee63db781f85b0545a8334edf67",
  "sign-ver": "1",
  "store-country-code": "es",
  "store-country-code-src": "uid",
  "tdid": "",
  "cookie": "passport_csrf_token=8fef1a3dc1006666dac62166a613e34a; passport_csrf_token_default=8fef1a3dc1006666dac62166a613e34a; sid_guard=5f879eeea6b285bd63d95783750aa77c%7C1755882262%7C5184000%7CTue%2C+21-Oct-2025+17%3A04%3A22+GMT; uid_tt=4da2d2dfd4c97b64566d255a01dc5c4f89316f414c4c56f3974e5b006cd273de; uid_tt_ss=4da2d2dfd4c97b64566d255a01dc5c4f89316f414c4c56f3974e5b006cd273de; sid_tt=5f879eeea6b285bd63d95783750aa77c; sessionid=5f879eeea6b285bd63d95783750aa77c; sessionid_ss=5f879eeea6b285bd63d95783750aa77c; sid_ucp_v1=1.0.0-KGJlYTVjOGM0MWIxYTVjYTk3ZGFkMWNjMmQ2ODNhZjg1MzllNDQ0MWYKGQiSiLeajJyA02gQlsaixQYYnKAVOAFA6wcQAxoCbXkiIDVmODc5ZWVlYTZiMjg1YmQ2M2Q5NTc4Mzc1MGFhNzdj; ssid_ucp_v1=1.0.0-KGJlYTVjOGM0MWIxYTVjYTk3ZGFkMWNjMmQ2ODNhZjg1MzllNDQ0MWYKGQiSiLeajJyA02gQlsaixQYYnKAVOAFA6wcQAxoCbXkiIDVmODc5ZWVlYTZiMjg1YmQ2M2Q5NTc4Mzc1MGFhNzdj; store-idc=no1a; store-country-code=es; store-country-code-src=uid; cc-target-idc=alisg; tt-target-idc-sign=NoSZraHPHTu67NCRjtUCsmxN2nu1BvojjTtJrGAkv-PwDOO5YhmkuRW22Y73fuXk3nMb8Lw8nFSy7b8Ztp58VVV902GKzko_VsZB4E0ceOSB1eNlBvkyz4-Rc8_iJlBEbWeZzO8IKH3-iuVJ8k4A5xdAInpxvDpvqpj4bCyj03BM94QYEdjBZQYyD83p9MlLWbelGRFkGWvYSygmShACI3307TGaEz5HQsBVDFzJ43WxOtAYO2jbn4EIJ5NMwNO6kGFnBE9Mz0sM62m2ntP6WrgbgF9GmRnDlxu0bjO6srAKpfdF7gOxnTZb8wZh8VE5gcbD9ncMAnBnpz0DGsh1FGiU3HEnM1D4tkDuqyEthsf6wY0HYYNqmRsVuATpG013AynCDRZ2lqTTH7AyIyFT27RYyuIxfqg4ODuO7AlDjZFbQ-C3NFSa0VQmAnJ9GplAlv5WX_pV74KjPJ8dW5Ya8rBntptvgoqzoUpzzJdpM29CgdFeDkj2oysaJ-Kn3Eyq; ttwid=1|C2GBDXdBztsUi8aW1KbWZV6IMF2aHidAhcA4me6Ppwk|1755882260|ca0450c5dd5771583d5f76e8099028ccd53b207037a80ff18cbc4bd6e31709ef; store-country-sign=MEIEDDHkSQ7IDnI2LgH_CAQgJex00O85FwBfxXsXmbFzq2OqGD4_vDlxiUFNM2RjfYoEEE3eOrm5SqN2LAQfpPZU2O0; msToken=ir6FtsasxexDNN3FSxgaXLrVHYZLToVjJ3rjfm-OTgbsdnTDWBOFgMe-9B8E0QXuFqa4fpCiHd2lcvLj3_zsYb03Bi41jjRWpwxDyXJks0Vb",
  "Referer": "https://www.capcut.com/"
};

const body = {
  notice_type: [2, 3],
  cursor: "0",
  count: 10
};

async function getNoticeList() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("Response:", data.data.notice_list);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

getNoticeList();
