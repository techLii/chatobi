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

async function updateSchema() {
    try {
        const messagesId = 'messages';
        console.log(`Updating schema for collection: ${messagesId}...`);

        // Add userAge attribute (integer, nullable)
        try {
            await databases.createIntegerAttribute(databaseId, messagesId, 'userAge', false);
            console.log('✓ Added "userAge" attribute');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ "userAge" attribute already exists');
            } else {
                console.error('Error creating userAge attribute:', error);
            }
        }

        // Add userSex attribute (string, nullable)
        try {
            await databases.createStringAttribute(databaseId, messagesId, 'userSex', 20, false);
            console.log('✓ Added "userSex" attribute');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ "userSex" attribute already exists');
            } else {
                console.error('Error creating userSex attribute:', error);
            }
        }

        // Add userLocation attribute (string, nullable)
        try {
            await databases.createStringAttribute(databaseId, messagesId, 'userLocation', 100, false);
            console.log('✓ Added "userLocation" attribute');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ "userLocation" attribute already exists');
            } else {
                console.error('Error creating userLocation attribute:', error);
            }
        }

        console.log('Schema update complete.');
    } catch (error) {
        console.error('Error updating schema:', error);
    }
}

updateSchema();
