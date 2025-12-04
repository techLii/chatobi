import { Client, Account, Databases, Avatars } from 'appwrite';

export const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (endpoint && projectId) {
    client
        .setEndpoint(endpoint)
        .setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const CHAT_COLLECTION_ID = 'messages';
export const EVENTS_COLLECTION_ID = 'events';
export const DMS_COLLECTION_ID = 'dms';
export const PROFILES_COLLECTION_ID = 'profiles';
