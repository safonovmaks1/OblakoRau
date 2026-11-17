export function createLocalStorageAdapter(storageKey) {
  function getStorage() {
    try {
      return globalThis.localStorage;
    } catch {
      return null;
    }
  }

  return {
    read() {
      const storage = getStorage();

      if (!storage) return null;

      try {
        const value = storage.getItem(storageKey);
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },

    write(value) {
      const storage = getStorage();

      if (!storage) return false;

      try {
        storage.setItem(storageKey, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove() {
      const storage = getStorage();

      if (!storage) return false;

      try {
        storage.removeItem(storageKey);
        return true;
      } catch {
        return false;
      }
    },
  };
}
