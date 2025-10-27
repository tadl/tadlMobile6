// src/app/cred-migration.ts
import { Storage } from '@ionic/storage-angular';
import { Preferences } from '@capacitor/preferences';

export async function migrateCredsIfNeeded(storage: Storage) {
  const { value: done } = await Preferences.get({ key: 'creds_migrated_v1' });
  if (done === 'yes') return;

  let migrated = false;

  // stored_accounts (may be string or object depending on past writes)
  const legacyAccounts = await storage.get('stored_accounts');
  if (legacyAccounts) {
    const value = typeof legacyAccounts === 'string' ? legacyAccounts : JSON.stringify(legacyAccounts);
    await Preferences.set({ key: 'stored_accounts', value });
    migrated = true;
  }

  // primary creds
  const u = await storage.get('username');
  if (u) {
    await Preferences.set({ key: 'username', value: String(u) });
    migrated = true;
  }

  const hp = await storage.get('hashed_password');
  if (hp) {
    await Preferences.set({ key: 'hashed_password', value: String(hp) });
    migrated = true;
  }

  // Only mark done if we actually moved something (harmless either way)
  if (migrated) {
    await Preferences.set({ key: 'creds_migrated_v1', value: 'yes' });
  }
}
