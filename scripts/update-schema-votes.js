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

        // Add upvotes attribute (array of strings)
        try {
            await databases.createStringAttribute(databaseId, messagesId, 'upvotes', 100, false, undefined, true);
            console.log('✓ Added "upvotes" attribute (array)');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ "upvotes" attribute already exists');
            } else {
                console.error('Error creating upvotes attribute:', error);
            }
        }

        // Add downvotes attribute (array of strings)
        try {
            await databases.createStringAttribute(databaseId, messagesId, 'downvotes', 100, false, undefined, true);
            console.log('✓ Added "downvotes" attribute (array)');
        } catch (error) {
            if (error.code === 409) {
                console.log('ℹ️ "downvotes" attribute already exists');
            } else {
                console.error('Error creating downvotes attribute:', error);
            }
        }

        console.log('Schema update complete.');
    } catch (error) {
        console.error('Error updating schema:', error);
    }
}

updateSchema();
