import User from './models/User.js';
import Chat from './models/Chat.js';
import Message from './models/Message.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Seed] Database already contains ${userCount} users. Skipping auto-seed.`);
      return;
    }

    console.log('[Seed] Seeding sample data into database...');

    // 1. Create Sample Users
    const usersData = [
      {
        username: 'alex_rivers',
        email: 'alex@aptisure.edu',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexRivers&backgroundColor=b6e3f4',
        bio: 'Full-stack developer & CS Senior. Building real-time web apps with MERN & Socket.IO.',
        isOnline: true,
      },
      {
        username: 'bella_chen',
        email: 'bella@aptisure.edu',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BellaChen&backgroundColor=ffdfbf',
        bio: 'UI/UX Designer. Passionate about clean Google Stitch design systems.',
        isOnline: true,
      },
      {
        username: 'carlos_mendoza',
        email: 'carlos@aptisure.edu',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CarlosMendoza&backgroundColor=c0aede',
        bio: 'Backend & Cloud architect. Keeping databases fast and sockets alive.',
        isOnline: false,
      },
      {
        username: 'diana_prince',
        email: 'diana@aptisure.edu',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DianaPrince&backgroundColor=ffd5dc',
        bio: 'Data Science researcher & AI club president. Loving real-time tech.',
        isOnline: false,
      },
      {
        username: 'ethan_taylor',
        email: 'ethan@aptisure.edu',
        password: 'password123',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EthanTaylor&backgroundColor=d1d4f9',
        bio: 'Mobile and React specialist. Always open for coding sprints.',
        isOnline: true,
      },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const [alex, bella, carlos, diana, ethan] = createdUsers;
    console.log(`[Seed] Created ${createdUsers.length} sample users successfully.`);

    // 2. Create 1-on-1 Private Chats
    // Chat 1: Alex & Bella
    const chatAlexBella = await Chat.create({
      chatName: 'sender',
      isGroupChat: false,
      users: [alex._id, bella._id],
    });

    const now = Date.now();
    const min = 60 * 1000;
    const hour = 60 * min;

    const messagesAlexBella = [
      {
        sender: bella._id,
        content: 'Hey Alex! Did you check out the new Stitch design system guidelines for the chat workspace?',
        chat: chatAlexBella._id,
        createdAt: new Date(now - 3 * hour),
      },
      {
        sender: alex._id,
        content: 'Yes Bella! The elevations and color tokens look super clean. I love the smooth rounded cards.',
        chat: chatAlexBella._id,
        createdAt: new Date(now - 2 * hour - 45 * min),
      },
      {
        sender: bella._id,
        content: 'Awesome! I also prepared the active online indicator and typing animation states.',
        chat: chatAlexBella._id,
        createdAt: new Date(now - 1 * hour - 10 * min),
      },
      {
        sender: alex._id,
        content: 'Brilliant! The Socket.IO connection is running seamlessly. Ready for the demo!',
        chat: chatAlexBella._id,
        createdAt: new Date(now - 25 * min),
      },
    ];

    let lastMsgAlexBella = null;
    for (const m of messagesAlexBella) {
      lastMsgAlexBella = await Message.create(m);
    }
    await Chat.findByIdAndUpdate(chatAlexBella._id, { latestMessage: lastMsgAlexBella._id });

    // Chat 2: Alex & Carlos
    const chatAlexCarlos = await Chat.create({
      chatName: 'sender',
      isGroupChat: false,
      users: [alex._id, carlos._id],
    });

    const messagesAlexCarlos = [
      {
        sender: carlos._id,
        content: 'Hey Alex, are all the REST endpoints tested with JWT authentication?',
        chat: chatAlexCarlos._id,
        createdAt: new Date(now - 5 * hour),
      },
      {
        sender: alex._id,
        content: 'Yes Carlos, registration, login, group CRUD, and message retrieval all pass the test suite 100%!',
        chat: chatAlexCarlos._id,
        createdAt: new Date(now - 4 * hour),
      },
      {
        sender: carlos._id,
        content: 'Great job! The database schema indexing and error middlewares are solid.',
        chat: chatAlexCarlos._id,
        createdAt: new Date(now - 2 * hour),
      },
    ];

    let lastMsgAlexCarlos = null;
    for (const m of messagesAlexCarlos) {
      lastMsgAlexCarlos = await Message.create(m);
    }
    await Chat.findByIdAndUpdate(chatAlexCarlos._id, { latestMessage: lastMsgAlexCarlos._id });

    // 3. Create Group Chats
    // Group 1: MERN Stack Project Squad
    const groupMern = await Chat.create({
      chatName: '🚀 MERN Project Squad',
      isGroupChat: true,
      users: [alex._id, bella._id, carlos._id, diana._id],
      groupAdmin: alex._id,
      groupIcon: 'https://api.dicebear.com/7.x/identicon/svg?seed=MernSquad',
    });

    const messagesGroupMern = [
      {
        sender: alex._id,
        content: 'Welcome team! Let’s coordinate our final deliverables for the Real-Time Chat project.',
        chat: groupMern._id,
        createdAt: new Date(now - 12 * hour),
      },
      {
        sender: bella._id,
        content: 'UI components and responsive navigation drawer are completely polished!',
        chat: groupMern._id,
        createdAt: new Date(now - 8 * hour),
      },
      {
        sender: carlos._id,
        content: 'MongoDB aggregation pipelines and Socket presence tracking are deployed.',
        chat: groupMern._id,
        createdAt: new Date(now - 4 * hour),
      },
      {
        sender: diana._id,
        content: 'Tested multi-client simultaneous messaging and group broadcasting. Everything is ultra fast!',
        chat: groupMern._id,
        createdAt: new Date(now - 15 * min),
      },
    ];

    let lastMsgGroupMern = null;
    for (const m of messagesGroupMern) {
      lastMsgGroupMern = await Message.create(m);
    }
    await Chat.findByIdAndUpdate(groupMern._id, { latestMessage: lastMsgGroupMern._id });

    // Group 2: Algorithms & CS Study Room
    const groupAlgo = await Chat.create({
      chatName: '💡 Algorithms & CS Study',
      isGroupChat: true,
      users: [alex._id, carlos._id, diana._id, ethan._id],
      groupAdmin: diana._id,
      groupIcon: 'https://api.dicebear.com/7.x/identicon/svg?seed=AlgorithmsStudy',
    });

    const messagesGroupAlgo = [
      {
        sender: diana._id,
        content: 'Has everyone reviewed the Graph BFS/DFS traversal problems for tomorrow’s lab?',
        chat: groupAlgo._id,
        createdAt: new Date(now - 1 * hour - 40 * min),
      },
      {
        sender: ethan._id,
        content: 'Working through Dijkstra’s shortest path algorithm right now. Let’s do a group review soon!',
        chat: groupAlgo._id,
        createdAt: new Date(now - 50 * min),
      },
      {
        sender: alex._id,
        content: 'Sounds great, let’s hop into the study session after class!',
        chat: groupAlgo._id,
        createdAt: new Date(now - 10 * min),
      },
    ];

    let lastMsgGroupAlgo = null;
    for (const m of messagesGroupAlgo) {
      lastMsgGroupAlgo = await Message.create(m);
    }
    await Chat.findByIdAndUpdate(groupAlgo._id, { latestMessage: lastMsgGroupAlgo._id });

    console.log('[Seed] Sample users, 1-on-1 chats, group channels, and messages seeded successfully!');
  } catch (err) {
    console.error('[Seed Error]', err);
  }
};
