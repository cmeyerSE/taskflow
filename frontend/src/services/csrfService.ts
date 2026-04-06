import { API_BASE_URL } from "./apiConfig";

let csrfToken: string | null = null;

export const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;

  const response = await fetch(`${API_BASE_URL}/api/v1/csrf_token`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await response.json();
  if (!data.csrfToken || typeof data.csrfToken !== "string") {
    throw new Error("Invalid CSRF token response");
  }

  csrfToken = data.csrfToken;
  return data.csrfToken;
};

export const clearCsrfTokenCache = () => {
  csrfToken = null;
};
