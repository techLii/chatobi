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

async function initProfiles() {
    try {
        const profilesId = 'profiles';
        console.log(`Checking collection: ${profilesId}...`);

        try {
            await databases.getCollection(databaseId, profilesId);
            console.log(`Collection ${profilesId} already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating collection ${profilesId}...`);
                await databases.createCollection(
                    databaseId,
                    profilesId,
                    'Profiles',
                    [
                        sdk.Permission.read(sdk.Role.any()),
                        sdk.Permission.create(sdk.Role.users()),
                        sdk.Permission.update(sdk.Role.users()),
                        sdk.Permission.delete(sdk.Role.users())
                    ]
                );

                console.log('Creating attributes for profiles...');
                // Link profile to user ID
                await databases.createStringAttribute(databaseId, profilesId, 'userId', 100, true);

                // Profile fields
                await databases.createIntegerAttribute(databaseId, profilesId, 'age', false);
                await databases.createStringAttribute(databaseId, profilesId, 'sex', 20, false);
                await databases.createStringAttribute(databaseId, profilesId, 'location', 100, false);

                console.log('Profiles collection created successfully.');
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error initializing profiles collection:', error);
    }
}

initProfiles();
