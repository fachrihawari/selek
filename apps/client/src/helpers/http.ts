const localStorageKey = "__selek_token__";

interface HttpConfig extends RequestInit {
  body?: any;
  headers?: HeadersInit;
}

export interface IHttpResponse {
  message: string;
}

export async function http<T = IHttpResponse>(
  endpoint: string,
  { body, ...customConfig }: HttpConfig = {}
): Promise<T> {
  // Basic headers
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  //  assign token to headers if exists in localstorage
  const token = window.localStorage.getItem(localStorageKey);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: HttpConfig = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return window
    .fetch(import.meta.env.VITE_API_URL + endpoint, config)
    .then(async (response) => {
      // if token is expired, remove it from localstorage and redirect to login
      if (response.status === 401) {
        window.localStorage.removeItem(localStorageKey);
        window.location.assign("/");
        return;
      }

      // if response is ok, return data
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(JSON.parse(errorMessage));
      }
    });
}
