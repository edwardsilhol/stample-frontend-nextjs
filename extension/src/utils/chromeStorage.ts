export const setChromeStorageVariable = async (
  key: string,
  value: string,
): Promise<void> => {
  chrome.storage.local.set({ [key]: value });
};

export const getChromeStorageVariable = (key: string): Promise<string> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: 'getStorage', key },
      function (response) {
        resolve(response);
      },
    );
  });
};

export const removeChromeStorageVariable = (key: string): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove([key], () => {
      resolve();
    });
  });
};
