import { google } from 'googleapis';

const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
const DELEGATED_ADMIN_EMAIL = process.env.DELEGATED_ADMIN_EMAIL || '';

// Define the required scopes
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user'];

export function convertEmail(email: string): string {
  const [username] = email.split('@');
  return `${username}@wecloudstorage.in`;
}

export async function createGoogleUser(firstName: string, lastName: string, email: string, password: string, planStorage: string) {
  const convertedEmail = convertEmail(email);

  const jwtClient = new google.auth.JWT(
    SERVICE_ACCOUNT_KEY.client_email,
    undefined,
    SERVICE_ACCOUNT_KEY.private_key,
    SCOPES,
    DELEGATED_ADMIN_EMAIL
  );

  await jwtClient.authorize();

  const admin = google.admin({ version: 'directory_v1', auth: jwtClient });

  const userInfo = {
    name: {
      givenName: firstName,
      familyName: lastName,
    },
    password: password,
    primaryEmail: convertedEmail,
    orgUnitPath: `/public/${planStorage}`
  };

  try {
    const result = await admin.users.insert({ requestBody: userInfo });
    return { success: true, email: result.data.primaryEmail };
  } catch (error) {
    console.error('Error creating Google user:', error);
    throw new Error('Failed to create Google user');
  }
}

