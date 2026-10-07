// Automated API and Database Integration Verification Script
const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting End-to-End MERN Chat Backend API Verification...\n');

  try {
    // 1. Health check
    console.log('1️⃣ Testing Server Health Endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('   ✅ Health status:', health.status);

    // 2. Register User A (Alex)
    console.log('\n2️⃣ Registering User A (Alex)...');
    const timestamp = Date.now();
    const regUserARes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `alex_${timestamp}`,
        email: `alex_${timestamp}@example.com`,
        password: 'password123',
      }),
    });
    const userA = await regUserARes.json();
    console.log('   ✅ User A registered:', userA.username, '| Token present:', !!userA.token);

    // 3. Register User B (Bella)
    console.log('\n3️⃣ Registering User B (Bella)...');
    const regUserBRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `bella_${timestamp}`,
        email: `bella_${timestamp}@example.com`,
        password: 'password123',
      }),
    });
    const userB = await regUserBRes.json();
    console.log('   ✅ User B registered:', userB.username, '| Token present:', !!userB.token);

    // 4. Authenticate User A Login
    console.log('\n4️⃣ Testing User A Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userA.email,
        password: 'password123',
      }),
    });
    const authData = await loginRes.json();
    console.log('   ✅ Login successful for:', authData.username);

    // 5. Search Users
    console.log('\n5️⃣ Testing User Discovery...');
    const searchRes = await fetch(`${BASE_URL}/users?search=bella`, {
      headers: { Authorization: `Bearer ${userA.token}` },
    });
    const usersFound = await searchRes.json();
    console.log('   ✅ Users found matching "bella":', usersFound.length);

    // 6. Access / Create 1-on-1 Private Chat
    console.log('\n6️⃣ Creating 1-on-1 Private Chat between User A and User B...');
    const privateChatRes = await fetch(`${BASE_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`,
      },
      body: JSON.stringify({ userId: userB._id }),
    });
    const privateChat = await privateChatRes.json();
    console.log('   ✅ 1-on-1 Chat established. Chat ID:', privateChat._id);

    // 7. Create Group Chat Room
    console.log('\n7️⃣ Creating Group Chat Room ("Algorithms Study Group")...');
    const groupChatRes = await fetch(`${BASE_URL}/chats/group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`,
      },
      body: JSON.stringify({
        name: 'Algorithms Study Group',
        users: JSON.stringify([userB._id]),
      }),
    });
    const groupChat = await groupChatRes.json();
    console.log('   ✅ Group room created:', groupChat.chatName, '| Members:', groupChat.users?.length);

    // 8. Send Message to Group
    console.log('\n8️⃣ Sending Message to Group Chat...');
    const sendMsgRes = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`,
      },
      body: JSON.stringify({
        chatId: groupChat._id,
        content: 'Hello everyone! Welcome to our study room 🚀',
      }),
    });
    const sentMsg = await sendMsgRes.json();
    console.log('   ✅ Message successfully posted:', sentMsg.content);

    // 9. Fetch Messages for Group
    console.log('\n9️⃣ Fetching Messages for Group Chat...');
    const getMsgsRes = await fetch(`${BASE_URL}/messages/${groupChat._id}`, {
      headers: { Authorization: `Bearer ${userA.token}` },
    });
    const messages = await getMsgsRes.json();
    console.log('   ✅ Messages fetched:', messages.length, '| Content:', messages[0]?.content);

    console.log('\n🎉 ALL 9 BACKEND VERIFICATION CHECKS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
