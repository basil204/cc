import fetch from 'node-fetch';

const BASE_URL = 'http://160.30.21.47:3000';

export async function getDomains() {
  try {
    // Only use these specific domains instead of fetching all domains
    // thay domain vào đây nma domain nào khác gửi em để e thêm vào server
    const specificDomains = ["manhnl.dev"];

    console.log("Using specific domains:", specificDomains.join(", "));
    return specificDomains;

    // Original API call is commented out
    // const res = await fetch(`${BASE_URL}/domains`);
    // const data = await res.json();
    // return data.domains;
  } catch (error) {
    console.error("Error in getDomains:", error.message);
    // Fallback to hardcoded domains if there's an error
    return ["manhnl.dev"];
  }
}

export async function createOrUseEmail(address = '', domain = '') {
  try {
    const res = await fetch(`${BASE_URL}/create-or-use-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, domain }),
    });

    const data = await res.json();

    // Check if we got an error about invalid email
    if (data.error && (data.error.includes("không hợp lệ") || data.error.includes("invalid"))) {
      // Try creating a completely random email without specifying an address
      console.log("Email address invalid, trying with random address...");
      const randomRes = await fetch(`${BASE_URL}/create-or-use-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }), // Only send domain, let API generate address
      });
      return await randomRes.json();
    }

    return data;
  } catch (error) {
    console.error("Error creating email:", error.message);
    return { error: error.message };
  }
}

export async function listMessages(accountId, mailboxId) {
  try {
    const res = await fetch(`${BASE_URL}/list-messages?accountId=${accountId}&mailboxId=${mailboxId}&page=1`);
    const data = await res.json();

    if (!data || !data.data || !data.data.member) {
      console.log("No messages found or invalid response format");
      return [];
    }

    return data.data.member || [];
  } catch (error) {
    console.error("Error listing messages:", error.message);
    return [];
  }
}

export async function getMessageDetail(accountId, mailboxId, messageId) {
  try {
    const res = await fetch(`${BASE_URL}/message-detail?accountId=${accountId}&mailboxId=${mailboxId}&messageId=${messageId}`);
    return await res.json();
  } catch (error) {
    console.error("Error getting message detail:", error.message);
    return {};
  }
}
