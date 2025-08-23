import CapcutAPIManager from './capcut-api-manager.js';

// Hàm để parse cookies từ string
function parseCookies(cookieString) {
    const cookies = {};
    if (!cookieString) return cookies;
    
    cookieString.split(';').forEach(cookie => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
            cookies[key.trim()] = value.trim();
        }
    });
    
    return cookies;
}

// Hàm để cập nhật cấu hình từ request thực tế
async function updateCapcutConfig() {
    const manager = new CapcutAPIManager();
    
    console.log('🔄 Đang cập nhật cấu hình CapCut...\n');
    
    // Cookies từ request thực tế
    const realCookies = {
        'passport_csrf_token': '65d3f1f4944ab59f338c2bb85e68f1f7',
        'passport_csrf_token_default': '65d3f1f4944ab59f338c2bb85e68f1f7',
        '_gcl_au': '1.1.329728196.1753252620',
        '_ga': 'GA1.1.2144496623.1753252620',
        '_clck': '1ikjldh%7C2%7Cfy8%7C0%7C2030',
        'sid_guard': '318ac7ce15d66bb9ba7ed5f94736ed02%7C1754454638%7C5184000%7CSun%2C+05-Oct-2025+04%3A30%3A38+GMT',
        'uid_tt': '61b293ba584778794f57b0df061645ff74f3a302bbf7add29cb9a88198bb85c6',
        'uid_tt_ss': '61b293ba584778794f57b0df061645ff74f3a302bbf7add29cb9a88198bb85c6',
        'sid_tt': '318ac7ce15d66bb9ba7ed5f94736ed02',
        'sessionid': '318ac7ce15d66bb9ba7ed5f94736ed02',
        'sessionid_ss': '318ac7ce15d66bb9ba7ed5f94736ed02',
        'sid_ucp_v1': '1.0.0-KGI2MjQxMDMyMGM0MzBkZTViNGQ0ODFmMmJlZTFkOWVkYmRlY2I0NzUKGQiSiJqe3_C-vWgQ7rTLxAYYnKAVOAFA6wcQAxoCbXkiIDMxOGFjN2NlMTVkNjZiYjliYTdlZDVmOTQ3MzZlZDAy',
        'ssid_ucp_v1': '1.0.0-KGI2MjQxMDMyMGM0MzBkZTViNGQ0ODFmMmJlZTFkOWVkYmRlY2I0NzUKGQiSiJqe3_C-vWgQ7rTLxAYYnKAVOAFA6wcQAxoCbXkiIDMxOGFjN2NlMTVkNjZiYjliYTdlZDVmOTQ3MzZlZDAy',
        'store-idc': 'no1a',
        'store-country-code': 'es',
        'store-country-code-src': 'uid',
        '_uetvid': '6ffa28b0678f11f0bae15fd8a165858f',
        'odin_tt': 'd291bf37d7115193769bc4cc108b87e7d9f5c1d223859dcb686ca0b5a8b37c7b521398c7a199ac05e1b72cf0b53e5436',
        '_ga_F9J0QP63RB': 'GS2.1.s1754454625$o5$g1$t1754454654$j31$l0$h0',
        'cc-target-idc': 'alisg',
        'ttwid': '1|_GjXy0yeh53xE2zKryPEkm-_hWRuyd8iOmLA4GKjgCE|1755749855|a74943732a45fe42ba0bea70cb2975071f9c796d8240e5936f2baa6f022d1988',
        'msToken': 'J7ECqqsIAIk78lDS0a0GJ-e4_wWQVBD6cGnbUoVeeHx970Pw7h0DRduE7LoB061McNoX7ggUon4w3juXKZDinR-rFiD9pWZPlw8f-HpF69ETayQiFvd9AwqJdTJ9dyMS7gOyZpc=',
        'store-country-sign': 'MEIEDJMaYxYFK7Gw1YCg9wQg0uFTTsUyK5CmjhvXUYsdj32tigoSw7Vb5R_Zfkh-QQEEELxKAVvqQk9NcG_rfloj4bw'
    };
    
    // Headers từ request thực tế
    const realHeaders = {
        'device-time': '1755750190',
        'did': '7530162609912366593',
        'lan': 'vi-VN',
        'loc': 'ES',
        'pf': '7',
        'priority': 'u=1, i',
        'sign': 'b501238cbe9eaaaf37349eb3ebc87b73',
        'sign-ver': '1',
        'store-country-code': 'es',
        'store-country-code-src': 'uid',
        'tdid': ''
    };
    
    console.log('🍪 Đang cập nhật cookies...');
    manager.updateCookies(realCookies);
    
    console.log('📋 Đang cập nhật headers...');
    manager.updateHeaders(realHeaders);
    
    console.log('✅ Đã cập nhật cấu hình thành công!\n');
    
    // Test kết nối với cấu hình mới
    console.log('🧪 Đang test kết nối với cấu hình mới...');
    const connected = await manager.testConnection();
    
    if (connected) {
        console.log('🎉 Kết nối thành công! Bây giờ bạn có thể gọi API workspace list.');
        
        // Gọi API workspace list
        try {
            const workspaceData = await manager.getWorkspaceList();
            console.log('\n📊 Dữ liệu workspace:', workspaceData);
        } catch (error) {
            console.log('⚠️ Không thể lấy dữ liệu workspace:', error.message);
        }
    } else {
        console.log('❌ Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
    }
    
    return manager;
}

// Hàm để cập nhật cookies từ string
async function updateCookiesFromString(cookieString) {
    const manager = new CapcutAPIManager();
    
    console.log('🔄 Đang cập nhật cookies từ string...\n');
    
    const cookies = parseCookies(cookieString);
    console.log('🍪 Cookies đã parse:', cookies);
    
    manager.updateCookies(cookies);
    
    console.log('✅ Đã cập nhật cookies thành công!');
    
    return manager;
}

// Hàm để test API với cấu hình hiện tại
async function testCurrentConfig() {
    const manager = new CapcutAPIManager();
    
    console.log('🧪 Đang test cấu hình hiện tại...\n');
    
    try {
        const connected = await manager.testConnection();
        
        if (connected) {
            console.log('✅ Kết nối thành công!');
            
            // Test workspace list
            const workspaceData = await manager.getWorkspaceList();
            console.log('\n📊 Workspace data:', workspaceData);
            
        } else {
            console.log('❌ Kết nối thất bại!');
        }
        
    } catch (error) {
        console.error('💥 Test thất bại:', error.message);
    }
}

// Menu chính
async function showMenu() {
    console.log('🎯 CAPCUT API CONFIGURATION TOOL\n');
    console.log('1. Cập nhật cấu hình từ request thực tế');
    console.log('2. Cập nhật cookies từ string');
    console.log('3. Test cấu hình hiện tại');
    console.log('4. Gọi API workspace list');
    console.log('5. Thoát\n');
    
    const readline = await import('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question('Chọn option (1-5): ', async (answer) => {
            rl.close();
            
            switch (answer.trim()) {
                case '1':
                    await updateCapcutConfig();
                    break;
                case '2':
                    const cookieString = 'passport_csrf_token=65d3f1f4944ab59f338c2bb85e68f1f7; passport_csrf_token_default=65d3f1f4944ab59f338c2bb85e68f1f7; _gcl_au=1.1.329728196.1753252620; _ga=GA1.1.2144496623.1753252620; _clck=1ikjldh%7C2%7Cfy8%7C0%7C2030; sid_guard=318ac7ce15d66bb9ba7ed5f94736ed02%7C1754454638%7C5184000%7CSun%2C+05-Oct-2025+04%3A30%3A38+GMT; uid_tt=61b293ba584778794f57b0df061645ff74f3a302bbf7add29cb9a88198bb85c6; uid_tt_ss=61b293ba584778794f57b0df061645ff74f3a302bbf7add29cb9a88198bb85c6; sid_tt=318ac7ce15d66bb9ba7ed5f94736ed02; sessionid=318ac7ce15d66bb9ba7ed5f94736ed02; sessionid_ss=318ac7ce15d66bb9ba7ed5f94736ed02; sid_ucp_v1=1.0.0-KGI2MjQxMDMyMGM0MzBkZTViNGQ0ODFmMmJlZTFkOWVkYmRlY2I0NzUKGQiSiJqe3_C-vWgQ7rTLxAYYnKAVOAFA6wcQAxoCbXkiIDMxOGFjN2NlMTVkNjZiYjliYTdlZDVmOTQ3MzZlZDAy; ssid_ucp_v1=1.0.0-KGI2MjQxMDMyMGM0MzBkZTViNGQ0ODFmMmJlZTFkOWVkYmRlY2I0NzUKGQiSiJqe3_C-vWgQ7rTLxAYYnKAVOAFA6wcQAxoCbXkiIDMxOGFjN2NlMTVkNjZiYjliYTdlZDVmOTQ3MzZlZDAy; store-idc=no1a; store-country-code=es; store-country-code-src=uid; _uetvid=6ffa28b0678f11f0bae15fd8a165858f; odin_tt=d291bf37d7115193769bc4cc108b87e7d9f5c1d223859dcb686ca0b5a8b37c7b521398c7a199ac05e1b72cf0b53e5436; _ga_F9J0QP63RB=GS2.1.s1754454625$o5$g1$t1754454654$j31$l0$h0; cc-target-idc=alisg; ttwid=1|_GjXy0yeh53xE2zKryPEkm-_hWRuyd8iOmLA4GKjgCE|1755749855|a74943732a45fe42ba0bea70cb2975071f9c796d8240e5936f2baa6f022d1988; msToken=J7ECqqsIAIk78lDS0a0GJ-e4_wWQVBD6cGnbUoVeeHx970Pw7h0DRduE7LoB061McNoX7ggUon4w3juXKZDinR-rFiD9pWZPlw8f-HpF69ETayQiFvd9AwqJdTJ9dyMS7gOyZpc=; store-country-sign=MEIEDJMaYxYFK7Gw1YCg9wQg0uFTTsUyK5CmjhvXUYsdj32tigoSw7Vb5R_Zfkh-QQEEELxKAVvqQk9NcG_rfloj4bw';
                    await updateCookiesFromString(cookieString);
                    break;
                case '3':
                    await testCurrentConfig();
                    break;
                case '4':
                    const manager = new CapcutAPIManager();
                    await manager.getWorkspaceList();
                    break;
                case '5':
                    console.log('👋 Tạm biệt!');
                    process.exit(0);
                    break;
                default:
                    console.log('❌ Option không hợp lệ!');
            }
            
            console.log('\n' + '='.repeat(50) + '\n');
            await showMenu();
        });
    });
}

// Export các hàm
export { 
    updateCapcutConfig, 
    updateCookiesFromString, 
    testCurrentConfig, 
    showMenu 
};

// Chạy menu nếu file được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
    showMenu()
        .then(() => {
            console.log('\n✨ Hoàn thành!');
        })
        .catch((error) => {
            console.error('\n💀 Có lỗi xảy ra:', error.message);
            process.exit(1);
        });
}
