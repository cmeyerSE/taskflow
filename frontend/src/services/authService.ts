import { clearCsrfTokenCache, getCsrfToken } from "./csrfService";
import { API_BASE_URL } from "./apiConfig";

export const signup = async (email: string, password: string, passwordConfirmation: string) => {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({
      user: {
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || "Failed to sign up");
  }

  return data;
};

export const login = async (email: string, password: string) => {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/users/sign_in`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({
      user: {
        email,
        password,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to log in");
  }

  // Devise rotates the session on sign-in, so clear the cached CSRF token
  // to force a fresh fetch on the next state-changing request.
  clearCsrfTokenCache();

  return data;
};

export const logout = async () => {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/users/sign_out`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }

  clearCsrfTokenCache();
};

export const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/current_user`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  return data.user ?? data;
};
