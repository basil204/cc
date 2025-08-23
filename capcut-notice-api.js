import fetch from "node-fetch";
import fs from "fs";

// Cookies từ request thực tế của bạn
const REAL_COOKIES = {
  'passport_csrf_token': '65d3f1f4944ab59f338c2bb85e68f1f7',
  'passport_csrf_token_default': '65d3f1f4944ab59f338c2bb85e68f1f7',
  '_gcl_au': '1.1.329728196.1753252620',
  '_ga': 'GA1.1.2144496623.1753252620',
  '_clck': '1ikjldh%7C2%7Cfy8%7C0%7C2030',
  '_uetvid': '6ffa28b0678f11f0bae15fd8a165858f',
  '_ga_F9J0QP63RB': 'GS2.1.s1754454625$o5$g1$t1754454654$j31$l0$h0',
  'odin_tt': '8fdf56843185c8dc874bc8c99801fc7c4b1bb4538aaeee652134c6990bb7be6f82e27093a9682dcfbf7301728d7b18c7',
  'sid_guard': 'd7f6de78959d984472651d15c7465bcd%7C1755878285%7C5184000%7CTue%2C+21-Oct-2025+15%3A58%3A05+GMT',
  'uid_tt': 'fda751784d19d89e95dd2763d3606f06597d3c5b8aa84d8e4981e4b5fe2f87b5',
  'uid_tt_ss': 'fda751784d19d89e95dd2763d3606f06597d3c5b8aa84d8e4981e4b5fe2f87b5',
  'sid_tt': 'd7f6de78959d984472651d15c7465bcd',
  'sessionid': 'd7f6de78959d984472651d15c7465bcd',
  'sessionid_ss': 'd7f6de78959d984472651d15c7465bcd',
  'sid_ucp_v1': '1.0.0-KGM4MzE4MWE5OGM3OGQ2MzBjZmFjNzI1MGY2NjIwNzE4MGNkODg4N2EKGQiQiNzSpe6rzmgQjaeixQYYnKAVOAFA6wcQAxoDbXkyIiBkN2Y2ZGU3ODk1OWQ5ODQ0NzI2NTFkMTVjNzQ2NWJjZA',
  'ssid_ucp_v1': '1.0.0-KGM4MzE4MWE5OGM3OGQ2MzBjZmFjNzI1MGY2NjIwNzE4MGNkODg4N2EKGQiQiNzSpe6rzmgQjaeixQYYnKAVOAFA6wcQAxoDbXkyIiBkN2Y2ZGU3ODk1OWQ5ODQ0NzI2NTFkMTVjNzQ2NWJjZA',
  'store-idc': 'no1a',
  'store-country-code': 'es',
  'store-country-code-src': 'uid',
  'cc-target-idc': 'alisg',
  'tt-target-idc-sign': 'CSR-atqnFKj-TxXl1kZcr-hmbI9GIMX1fhej25K4_gG52jcRZDv_TWZd09JIEvgTst7NAdd3kHjBufz_DAt8CwQthQOflTd6UrTT0vlOjROGr1wWw_do3WSU-TONyJ7Al8JjGmYq14s0J7uJF5PZewIak9q86WrJtY2pAQpHggPSIy40KqXnxu_OXLwNBFM8mDAoBQmDlIPGhkXExgpe9rk9yISXDAXNVGn5U-MNRMC-2pOC64U3bFEK99QlzCdejAVboAoO0fDHf4tNcsfB7QERejo8uqNbVpvUhs4KlYvtBugCvBbupmUU4ZrfmS3UZpWESDaxngt2pqIBRDQcwF8iq-dZ9vnfGHEYbHacvYXE91WmVDUfh3KJWglWuENABeXIDo7VpqrZTGOpV1iUaiieX2NmLCuCVqQdGpnromdn0RaWEO1RzQ5m7gvrrXvTnYklSxQAHPIOubkE4XpqIll0viu7-WszeBx7To3UY-lJrRL1ETD0NS6D83RZYfct',
  'ttwid': '1|_GjXy0yeh53xE2zKryPEkm-_hWRuyd8iOmLA4GKjgCE|1755878286|3f05dc59935e05a8f98cfdbf029b7540615ed6861473fd8894533d1a33018da3',
  'store-country-sign': 'MEIEDHlto-but1PUQVXfewQgUxkm0b0SaqbqxZ8dab2yNEuRd2JNTfgU8Haaq4i2SjMEEDin6C7TncAa0MG-bSI6VBw',
  'msToken': 'TTDvfxe4qgPD-4YUNiXuxHL3EA7MFLK-ItUxuiap7W4ZBvzMNW4tGHZ6Bmz3bE-00RdrxId-F5M_uWn2tnFwQYwAlo4p_nrOQY9SaT96lQ4cRMVfceR6FapNNVr4b298t8w6mNc='
};

// Hàm để tạo cookie string từ object
function createCookieString(cookies) {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}

// Hàm để lưu response vào file
function saveResponse(endpoint, response, responseData) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `capcut-${endpoint}-${timestamp}.json`;
    
    const responseInfo = {
      endpoint,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(filename, JSON.stringify(responseInfo, null, 2));
    console.log(`💾 Đã lưu response vào: ${filename}`);
    return filename;
  } catch (error) {
    console.error('❌ Lỗi khi lưu response:', error.message);
    return null;
  }
}

// Hàm gọi API notice
async function getNoticeList() {
  const url = "https://edit-api-sg.capcut.com/lv/v1/notice/get_notice_list";
  
  // Tạo cookie string
  const cookieString = createCookieString(REAL_COOKIES);
  
  // Headers cho API notice (từ request thực tế)
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'vi,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5,zh;q=0.4',
    'app-sdk-version': '48.0.0',
    'appid': '348188',
    'appvr': '5.8.0',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'cookie': cookieString,
    'device-time': Math.floor(Date.now() / 1000).toString(),
    'did': '7530162609912366593',
    'lan': 'vi-VN',
    'loc': 'sg',
    'origin': 'https://www.capcut.com',
    'pf': '7',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.capcut.com/',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sign': '5f46109c08bd048dd8b4d711f9d7df5f',
    'sign-ver': '1',
    'store-country-code': 'es',
    'store-country-code-src': 'uid',
    'tdid': '',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
  };
  
  // Request body (nếu cần)
  const requestBody = {
    // Thêm parameters cần thiết nếu có
  };
  
  try {
    console.log('🔄 Đang gọi API notice...');
    console.log(`📍 URL: ${url}`);
    console.log(`🍪 Cookies: ${cookieString.substring(0, 100)}...`);
    console.log(`📋 Headers count: ${Object.keys(headers).length}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    console.log('✅ API call thành công!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    console.log('📦 Response data:', responseData);
    
    // Lưu response vào file
    const savedFile = saveResponse('notice', response, responseData);
    
    return {
      success: true,
      status: response.status,
      data: responseData,
      savedFile
    };
    
  } catch (error) {
    console.error('❌ Lỗi khi gọi API notice:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Hàm để test các API khác của CapCut
async function testOtherAPIs() {
  const apis = [
    {
      name: 'Workspace List',
      url: 'https://commerce-api-sg.capcut.com/commerce/v1/subscription/workspace/space_list',
      method: 'POST'
    },
    {
      name: 'User Info',
      url: 'https://www.capcut.com/passport/web/user/info/',
      method: 'GET'
    }
  ];
  
  for (const api of apis) {
    console.log(`\n🧪 Testing API: ${api.name}`);
    console.log(`📍 URL: ${api.url}`);
    
    try {
      const cookieString = createCookieString(REAL_COOKIES);
      
      const headers = {
        'accept': 'application/json, text/plain, */*',
        'cookie': cookieString,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'referer': 'https://www.capcut.com/'
      };
      
      const config = {
        method: api.method,
        headers
      };
      
      if (api.method === 'POST') {
        config.body = JSON.stringify({});
      }
      
      const response = await fetch(api.url, config);
      const data = await response.json();
      
      console.log(`✅ ${api.name} - Status: ${response.status}`);
      console.log(`📦 Data:`, data);
      
      // Lưu response
      saveResponse(api.name.toLowerCase().replace(/\s+/g, '-'), response, data);
      
    } catch (error) {
      console.error(`❌ ${api.name} - Error:`, error.message);
    }
  }
}

// Hàm chính
async function main() {
  console.log('🚀 CAPCUT NOTICE API TOOL\n');
  console.log('📊 Sử dụng cookies từ request thực tế\n');
  
  // Gọi API notice
  const noticeResult = await getNoticeList();
  
  if (noticeResult.success) {
    console.log('\n🎉 Đã lấy được dữ liệu notice thành công!');
    console.log(`💾 File đã lưu: ${noticeResult.savedFile}`);
    
    // Test các API khác
    console.log('\n🧪 Bắt đầu test các API khác...');
    await testOtherAPIs();
    
  } else {
    console.log('\n❌ Không thể lấy dữ liệu notice:', noticeResult.error);
  }
  
  console.log('\n✨ Hoàn thành!');
}

// Chạy main function
main().catch(console.error);

// Export các hàm
export { 
  getNoticeList, 
  testOtherAPIs, 
  createCookieString,
  saveResponse 
};
