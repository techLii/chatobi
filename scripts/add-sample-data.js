require('dotenv').config({ path: '.env.local' });
const sdk = require('node-appwrite');

const client = new sdk.Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'tvet_swap_id';

if (!endpoint || !projectId || !apiKey) {
    console.error('Missing environment variables.');
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new sdk.Databases(client);
const users = new sdk.Users(client);

async function addSampleData() {
    try {
        // 1. Create a sample user
        console.log('Creating sample user...');
        let userId;
        const sampleEmail = 'demo@chatobi.com';
        const samplePassword = 'demo1234';
        const sampleName = 'Demo User';

        try {
            const user = await users.create(
                sdk.ID.unique(),
                sampleEmail,
                undefined, // phone
                samplePassword,
                sampleName
            );
            userId = user.$id;
            console.log(`✓ Sample user created: ${sampleName} (${sampleEmail})`);
            console.log(`  User ID: ${userId}`);
        } catch (error) {
            if (error.code === 409) {
                // User already exists, get the user
                console.log('Sample user already exists, fetching...');
                const usersList = await users.list([sdk.Query.equal('email', sampleEmail)]);
                if (usersList.users.length > 0) {
                    userId = usersList.users[0].$id;
                    console.log(`✓ Using existing user: ${sampleName}`);
                } else {
                    throw new Error('Could not find or create sample user');
                }
            } else {
                throw error;
            }
        }

        // 2. Create sample chat messages
        console.log('\nCreating sample chat messages...');
        const messages = [
            {
                body: 'Hello everyone! Great to be part of the Westlands community.',
                username: sampleName,
                userId: userId,
                constituency: 'westlands'
            },
            {
                body: 'Has anyone noticed the new developments on Waiyaki Way? Looking great!',
                username: sampleName,
                userId: userId,
                constituency: 'westlands'
            },
            {
                body: 'Looking forward to connecting with more neighbors here.',
                username: sampleName,
                userId: userId,
                constituency: 'westlands'
            }
        ];

        for (const message of messages) {
            await databases.createDocument(
                databaseId,
                'messages',
                sdk.ID.unique(),
                message
            );
            console.log(`✓ Posted: "${message.body.substring(0, 50)}..."`);
        }

        // 3. Create sample events
        console.log('\nCreating sample events...');
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const events = [
            {
                title: 'Community Clean-Up Day',
                description: 'Join us for a community clean-up event at Karura Forest. Bring your gloves and let\'s make our neighborhood beautiful!',
                date: nextWeek.toISOString(),
                location: 'Karura Forest Main Entrance',
                constituency: 'westlands'
            },
            {
                title: 'Westlands Town Hall Meeting',
                description: 'Monthly town hall meeting to discuss local issues, development projects, and community concerns. All residents welcome!',
                date: nextMonth.toISOString(),
                location: 'Sarit Centre Conference Room',
                constituency: 'westlands'
            },
            {
                title: 'Youth Football Tournament',
                description: 'Annual youth football tournament for ages 10-18. Register your team today! Prizes for winners.',
                date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Parklands Sports Club',
                constituency: 'westlands'
            }
        ];

        for (const event of events) {
            await databases.createDocument(
                databaseId,
                'events',
                sdk.ID.unique(),
                event
            );
            console.log(`✓ Created event: "${event.title}"`);
        }

        console.log('\n✅ Sample data added successfully!');
        console.log('\n📝 Login credentials:');
        console.log(`   Email: ${sampleEmail}`);
        console.log(`   Password: ${samplePassword}`);
        console.log('\n🌐 Visit: http://localhost:3000/chat/westlands');

    } catch (error) {
        console.error('Error adding sample data:', error);
    }
}

addSampleData();
