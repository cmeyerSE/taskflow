const API_BASE_URL = "http://localhost:3000";

export const signup = async (email: string, password: string, passwordConfirmation: string) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch(`${API_BASE_URL}/users/sign_in`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
    throw new Error(data.message || "Failed to log in");
  }

  return data;
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/users/sign_out`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }
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