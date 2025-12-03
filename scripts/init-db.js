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

async function init() {
    try {
        // 1. Check/Create Database
        try {
            await databases.get(databaseId);
            console.log(`Database ${databaseId} already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating database ${databaseId}...`);
                await databases.create(databaseId, databaseId);
                console.log('Database created.');
            } else {
                throw error;
            }
        }

        // 2. Create Messages Collection
        const messagesId = 'messages';
        try {
            await databases.getCollection(databaseId, messagesId);
            console.log(`Collection ${messagesId} already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating collection ${messagesId}...`);
                await databases.createCollection(
                    databaseId,
                    messagesId,
                    'Messages',
                    [
                        sdk.Permission.read(sdk.Role.any()),
                        sdk.Permission.create(sdk.Role.users()),
                        sdk.Permission.update(sdk.Role.users()),
                        sdk.Permission.delete(sdk.Role.users())
                    ]
                );

                console.log('Creating attributes for messages...');
                await databases.createStringAttribute(databaseId, messagesId, 'body', 1000, true);
                await databases.createStringAttribute(databaseId, messagesId, 'userId', 100, true);
                await databases.createStringAttribute(databaseId, messagesId, 'username', 100, true);
                await databases.createStringAttribute(databaseId, messagesId, 'constituency', 100, true);
                console.log('Messages collection created.');
            } else {
                throw error;
            }
        }

        // 3. Create Events Collection
        const eventsId = 'events';
        try {
            await databases.getCollection(databaseId, eventsId);
            console.log(`Collection ${eventsId} already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating collection ${eventsId}...`);
                await databases.createCollection(
                    databaseId,
                    eventsId,
                    'Events',
                    [
                        sdk.Permission.read(sdk.Role.any()),
                        sdk.Permission.create(sdk.Role.users()),
                        sdk.Permission.update(sdk.Role.users()),
                        sdk.Permission.delete(sdk.Role.users())
                    ]
                );

                console.log('Creating attributes for events...');
                await databases.createStringAttribute(databaseId, eventsId, 'title', 200, true);
                await databases.createStringAttribute(databaseId, eventsId, 'description', 5000, true);
                await databases.createDatetimeAttribute(databaseId, eventsId, 'date', true);
                await databases.createStringAttribute(databaseId, eventsId, 'constituency', 100, true);
                await databases.createStringAttribute(databaseId, eventsId, 'location', 200, false);
                console.log('Events collection created.');
            } else {
                throw error;
            }
        }

        // 4. Create DMs Collection
        const dmsId = 'dms';
        try {
            await databases.getCollection(databaseId, dmsId);
            console.log(`Collection ${dmsId} already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating collection ${dmsId}...`);
                await databases.createCollection(
                    databaseId,
                    dmsId,
                    'DMs',
                    [
                        sdk.Permission.read(sdk.Role.any()),
                        sdk.Permission.create(sdk.Role.users()),
                        sdk.Permission.update(sdk.Role.users()),
                        sdk.Permission.delete(sdk.Role.users())
                    ]
                );

                console.log('Creating attributes for dms...');
                await databases.createStringAttribute(databaseId, dmsId, 'fromUser', 100, true);
                await databases.createStringAttribute(databaseId, dmsId, 'toUser', 100, true);
                await databases.createStringAttribute(databaseId, dmsId, 'text', 2000, true);
                await databases.createDatetimeAttribute(databaseId, dmsId, 'timestamp', true);
                console.log('DMs collection created.');
            } else {
                throw error;
            }
        }

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

init();
