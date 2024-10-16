import { ServiceAccount } from 'firebase-admin';
import firebaseCredentials from '../../firebase-credentials.json';

export const serviceAccount: ServiceAccount = {
  projectId: firebaseCredentials.project_id,
  privateKey: firebaseCredentials.private_key,
  clientEmail: firebaseCredentials.client_email,
};
