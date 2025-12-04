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

async function listAttributes() {
    try {
        const collectionId = 'profiles';
        const response = await databases.listAttributes(databaseId, collectionId);
        console.log('Attributes for profiles collection:');
        response.attributes.forEach(attr => {
            console.log(`- ${attr.key} (${attr.type}): required=${attr.required}`);
        });
    } catch (error) {
        console.error('Error listing attributes:', error);
    }
}

listAttributes();
