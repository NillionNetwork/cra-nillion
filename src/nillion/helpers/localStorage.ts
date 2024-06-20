interface StoredItem {
  userId: string;
  storeId: string;
  secretType: string;
  name: string;
  usersWithRetrievePermissions: string[];
  usersWithUpdatePermissions: string[];
  usersWithDeletePermissions: string[];
  usersWithComputePermissions: string[];
}

const generateStorageKey = (userId: string, pageKey: string): string => {
  return `${userId}_${pageKey}`;
};

export const readStorageForUserAtPage = (
  userId: string,
  pageKey: string
): { [key: string]: StoredItem } => {
  const storageKey = generateStorageKey(userId, pageKey);
  const storedData = localStorage.getItem(storageKey);
  return storedData ? JSON.parse(storedData) : {};
};

export const resetStorageForUserAtPage = (
  userId: string,
  pageKey: string
): void => {
  const storageKey = generateStorageKey(userId, pageKey);
  localStorage.removeItem(storageKey);
};

export const updateStorageForUserAtPage = (
  userId: string,
  pageKey: string,
  newItem: StoredItem
): void => {
  const storageKey = generateStorageKey(userId, pageKey);
  const storedItems = readStorageForUserAtPage(userId, pageKey);
  storedItems[newItem.storeId] = newItem;
  localStorage.setItem(storageKey, JSON.stringify(storedItems));
};
