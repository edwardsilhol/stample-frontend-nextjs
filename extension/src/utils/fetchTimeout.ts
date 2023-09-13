export function fetchTimeout(
  resource: any,
  init = {},
  timeout: number,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new window.AbortController();
    const timer = !!timeout && setTimeout(() => controller.abort(), timeout);

    fetch(resource, {
      ...init,
      signal: controller.signal,
    })
      .then((result) => {
        if (timer) {
          clearTimeout(timer);
        }
        resolve(result);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          const timeoutError = new Error('Fetch timeout');

          timeoutError.name = 'FetchTimeout';
          reject(timeoutError);
        } else {
          if (timer) {
            clearTimeout(timer);
          }
          reject(error);
        }
      });
  });
}
