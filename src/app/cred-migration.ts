// src/app/cred-migration.ts
import { Storage } from '@ionic/storage-angular';
import { Preferences } from '@capacitor/preferences';

export async function migrateCredsIfNeeded(storage: Storage) {
  const { value: done } = await Preferences.get({ key: 'creds_migrated_v1' });
  if (done === 'yes') return;

  const legacy = await storage.get('stored_accounts'); // stringified JSON
  if (legacy) {
    await Preferences.set({ key: 'stored_accounts', value: legacy });
  }

  // If you also store username/hashed_password separately in Storage, migrate them too:
  const u = await storage.get('username');
  if (u) await Preferences.set({ key: 'username', value: u });
  const hp = await storage.get('hashed_password');
  if (hp) await Preferences.set({ key: 'hashed_password', value: hp });

  await Preferences.set({ key: 'creds_migrated_v1', value: 'yes' });
}
