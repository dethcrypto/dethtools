export async function safeFetch<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  return fetch(...args).then(async (response) => {
    if (response.status === 200) {
      return response.json() as unknown as T;
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  });
}
