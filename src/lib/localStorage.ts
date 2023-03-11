export function getLocalStorageItem(key: string) {
  const value = localStorage.getItem(key);
  if (value === null) {
    console.log("There is no", key, "key stored in local storage...")
    return null;
  }
  return JSON.parse(value);
}

export function setLocalStorageItem(key: string, value: string | object) {
  localStorage.setItem(key, JSON.stringify(value));
}
