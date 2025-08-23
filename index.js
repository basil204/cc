import { getDomains, createOrUseEmail, listMessages, getMessageDetail } from './tmail-client.js';
import chalk from 'chalk';
import { faker } from '@faker-js/faker';
import { promises as fs, readFileSync } from 'fs';
import { createInterface } from 'readline';
import fetch from "node-fetch";
import ipinfo from 'ipinfo';

// 1. Baca config
const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

function encryptToTargetHex(input) {
  let hexResult = "";
  for (const char of input) {
    const encryptedCharCode = char.charCodeAt(0) ^ 0x05;
    hexResult += encryptedCharCode.toString(16).padStart(2, "0");
  }
  return hexResult;
}

function getCurrentTime() {
  const now = new Date();
  return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}]`;
}

async function regist_sendRequest(encryptedEmail, encryptedPassword) {
  try {
    const url = new URL('https://www.capcut.com/passport/web/email/send_code/');
    url.search = new URLSearchParams({
      aid: '348188',
      account_sdk_source: 'web',
      language: 'en',
      verifyFp: 'verify_m7euzwhw_PNtb4tlY_I0az_4me0_9Hrt_sEBZgW5GGPdn',
      check_region: '1'
    });

    const body = new URLSearchParams({
      mix_mode: '1',
      email: encryptedEmail,
      password: encryptedPassword,
      type: '34',
      fixed_mix_mode: '1'
    });

    console.log(chalk.blue(`${getCurrentTime()} Sending registration request...`));
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
      body
    });

    const data = await res.json();
    console.log(chalk.blue(`${getCurrentTime()} Registration response:`), JSON.stringify(data).substring(0, 200));
    
    return data;
  } catch (error) {
    console.error(chalk.red(`${getCurrentTime()} Registration error:`), error.message);
    return { message: "error", error: error.message };
  }
}

async function verify_sendRequest(encryptedEmail, encryptedPassword, encryptedCode) {
  try {
    const birthday = faker.date.birthdate().toISOString().split('T')[0];

    const url = new URL('https://www.capcut.com/passport/web/email/register_verify_login/');
    url.search = new URLSearchParams({
      aid: '348188',
      account_sdk_source: 'web',
      language: 'en',
      verifyFp: 'verify_m7euzwhw_PNtb4tlY_I0az_4me0_9Hrt_sEBZgW5GGPdn',
      check_region: '1'
    });

    const body = new URLSearchParams({
      mix_mode: '1',
      email: encryptedEmail,
      code: encryptedCode,
      password: encryptedPassword,
      type: '34',
      birthday,
      force_user_region: 'ID',
      biz_param: '{}',
      check_region: '1',
      fixed_mix_mode: '1'
    });

    console.log(chalk.blue(`${getCurrentTime()} Sending verification request...`));
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      },
      body
    });

    const data = await res.json();
    console.log(chalk.blue(`${getCurrentTime()} Verification response:`), JSON.stringify(data).substring(0, 200));
    
    return data;
  } catch (error) {
    console.error(chalk.red(`${getCurrentTime()} Verification error:`), error.message);
    return { message: "error", error: error.message };
  }
}
async function checkIPLocation() {
  return new Promise((resolve) => {
    ipinfo((err, cLoc) => {
      if (err) {
        console.error(chalk.red(`${getCurrentTime()} Lỗi lấy thông tin IP:`), err.message);
        resolve({
          country: "Unknown",
          countryCode: "XX"
        });
        return;
      }
      
      console.log(chalk.blue(`${getCurrentTime()} IP Info:`));
      console.log(chalk.blue(`${getCurrentTime()} IP:`), cLoc.ip);
      console.log(chalk.blue(`${getCurrentTime()} Quốc gia:`), cLoc.country);
      console.log(chalk.blue(`${getCurrentTime()} Thành phố:`), cLoc.city);
      console.log(chalk.blue(`${getCurrentTime()} Vùng:`), cLoc.region);
      
      resolve({
        ip: cLoc.ip,
        country: cLoc.country,
        countryCode: cLoc.country,
        city: cLoc.city,
        region: cLoc.region
      });
    });
  });
}

async function saveAccountToGoogleSheet(accountData) {
  try {
    console.log(chalk.blue(`${getCurrentTime()} Sending account to Google Sheet...`));
    
    // Get location information
    const locationInfo = await checkIPLocation();
    
    // Parse the account data (format: email|password)
    const [email, password] = accountData.split('|');
    
    // Create JSON payload with email, password and country info
    const payload = {
      accounts: email, // Just the email
      password: password, // Password as a separate field
      country: locationInfo.country // Country code from ipinfo
    };
    
    const response = await fetch(
      config.googleScriptUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(JSON.stringify(payload))}`,
      }
    );
    
    const result = await response.text();
    console.log(chalk.green(`${getCurrentTime()} Google Sheet response:`), result.substring(0, 100));
    return true;
  } catch (error) {
    console.error(chalk.red(`${getCurrentTime()} Error sending to Google Sheet:`), error.message);
    return false;
  }
}


async function saveToFile(filename, data) {
  await fs.writeFile(filename, data, { flag: 'a' });
}

async function promptUserForCount() {
  return new Promise((resolve) => {
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question('How many accounts to create: ', (count) => {
      readline.close();
      resolve(count);
    });
  });
}

(async () => {
  const loopCount = parseInt(await promptUserForCount()) || 1;
  console.log(chalk.yellow(`${getCurrentTime()} Starting account creation (${loopCount} times)`));

  const domains = await getDomains();

  for (let i = 1; i <= loopCount; i++) {
    try {
      console.log(chalk.cyan(`${getCurrentTime()} [Account ${i}/${loopCount}]`));
      
      // Fix the deprecated faker function
      const username = faker.internet.username().toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      const emailRes = await createOrUseEmail(username, domain);
      console.log(chalk.blue(`${getCurrentTime()} Email API Response:`), JSON.stringify(emailRes).substring(0, 100) + '...');
      
      // Add error checking for the email response
      if (!emailRes || emailRes.error) {
        console.log(chalk.red(`${getCurrentTime()} Email creation failed:`), emailRes?.error || 'Unknown error');
        continue;
      }
      
      const email = emailRes.email;
      
      // Handle potential missing data structure
      if (!emailRes.data || !emailRes.inboxUrl) {
        console.log(chalk.red(`${getCurrentTime()} Invalid email response format`));
        continue;
      }
      
      const accountId = emailRes.data.id;
      const mailboxId = emailRes.inboxUrl.match(/mailboxId=([^&]+)/)?.[1];
      
      if (!accountId || !mailboxId) {
        console.log(chalk.red(`${getCurrentTime()} Could not extract account or mailbox ID`));
        continue;
      }

      console.log(chalk.green(`${getCurrentTime()} Email:`), email);

      const encryptedEmail = encryptToTargetHex(email);
      const encryptedPassword = encryptToTargetHex(config.password);

      const sendReq = await regist_sendRequest(encryptedEmail, encryptedPassword);

      if (sendReq && sendReq.message === "success") {
        console.log(chalk.blue(`${getCurrentTime()} Waiting for OTP...`));

        let code;
        let attempts = 0;
        do {
          try {
            const msgs = await listMessages(accountId, mailboxId);
            if (msgs && msgs.length > 0) {
              const detail = await getMessageDetail(accountId, mailboxId, msgs[0].id);
              if (detail && detail.subject) {
                // Try to find a 6-digit code in the subject
                const match = detail.subject.match(/\b\d{6}\b/);
                if (match) code = match[0];
                
                // If not found in subject, try to find in the body text
                if (!code && detail.text) {
                  const textMatch = detail.text.match(/verification code[:\s]+(\d+)/i) || 
                                   detail.text.match(/code[:\s]+(\d+)/i) || 
                                   detail.text.match(/\b(\d{6})\b/);
                  if (textMatch) code = textMatch[1];
                }
              }
            }
          } catch (msgErr) {
            console.log(chalk.yellow(`${getCurrentTime()} Message fetch error:`), msgErr.message);
          }
          
          if (!code) {
            console.log(chalk.blue(`${getCurrentTime()} Waiting for OTP (attempt ${attempts+1}/10)...`));
            await new Promise(res => setTimeout(res, 5000));
            attempts++;
          }
        } while (!code && attempts < 10);

        if (!code) {
          console.log(chalk.red(`${getCurrentTime()} ❌ Failed to get OTP`));
          continue;
        }

        console.log(chalk.green(`${getCurrentTime()} OTP:`), code);
        const encryptedCode = encryptToTargetHex(code);

        const verifyRes = await verify_sendRequest(encryptedEmail, encryptedPassword, encryptedCode);

        if (verifyRes && verifyRes.message === "success") {
          const accountData = `${email}|${config.password}`;
          
          // Send to Google Sheet instead of saving to file
          const saveResult = await saveAccountToGoogleSheet(accountData);
          
          if (saveResult) {
            console.log(chalk.green(`${getCurrentTime()} ✅ Account saved to Google Sheet`));
          } else {
            // Fallback to local file if Google Sheet fails
            await saveToFile("accounts.txt", `${accountData}\n`);
            console.log(chalk.yellow(`${getCurrentTime()} ⚠️ Saved to local file as fallback`));
          }
        } else {
          console.log(chalk.red(`${getCurrentTime()} ❌ Verify failed:`), verifyRes?.message || 'Unknown error');
          
          // Check if there's a specific error message that might help debug
          if (verifyRes && verifyRes.description) {
            console.log(chalk.red(`${getCurrentTime()} Error details:`), verifyRes.description);
          }
          
          // If there's a retry logic needed, we could add it here
          // For now, just log the detailed error
          console.log(chalk.yellow(`${getCurrentTime()} Full response:`), JSON.stringify(verifyRes).substring(0, 300));
        }

      } else {
        console.log(chalk.red(`${getCurrentTime()} ❌ Send Code Failed:`), sendReq.message);
      }

    } catch (err) {
      console.error(chalk.red(`${getCurrentTime()} ⚠️ Error:`), err.message);
    }

    if (i < loopCount) {
      // Get delay from config with fallback to 10000ms (10 seconds) if not specified
      const delay = config.delayBetweenAccounts || 10000;
      console.log(chalk.gray(`${getCurrentTime()} ⏳ Waiting ${delay/1000} seconds before next...`));
      await new Promise(res => setTimeout(res, delay));
    }
  }

  console.log(chalk.green(`${getCurrentTime()} 🎉 Done!`));
})();
