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

async function resetProfiles() {
    try {
        const profilesId = 'profiles';
        console.log(`Deleting collection: ${profilesId}...`);

        try {
            await databases.deleteCollection(databaseId, profilesId);
            console.log(`Collection ${profilesId} deleted.`);
        } catch (error) {
            console.log(`Collection ${profilesId} not found or could not be deleted: ${error.message}`);
        }
    } catch (error) {
        console.error('Error resetting profiles collection:', error);
    }
}

resetProfiles();
