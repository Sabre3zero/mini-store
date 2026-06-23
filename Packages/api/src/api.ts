import { AppFields, DataParams, LoginParams, LoginResponse, CreateAppArgs, CategoryParams, DeleteAppArgs } from "./types";

const API_BASE_URL = "https://ministor.ru";

  export async function getData() {
  try {
    const response = await fetch(new URL("/api/apps", API_BASE_URL));
    const data = await response.json();
    const filtered = data.items.filter((item: DataParams) => item.cover !== null);
    return filtered;
  } catch (error) {
    throw error;
  }
}

export async function getCategories(): Promise<CategoryParams[]> {
  try {
    const response = await fetch(new URL("/api/categories", API_BASE_URL));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.items)) {
      throw new Error("Invalid categories response format");
    }
    
    return data.items;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
  const response = await fetch(new URL("/api/auth/login", API_BASE_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Не удалось войти. Провертье почту и пароль.");
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error("Сервер не вернул token.");
  }

  return {token: data.token, email: data.user.email}
}

export async function getApps(token: string): Promise<Array<DataParams>> {
  const url = new URL("/api/me/apps", API_BASE_URL);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Не удалось получить приложения");
  }

  const data = await response.json();

  if (!data.success || !Array.isArray(data.items)) {
    throw new Error("Некорректный формат ответа с приложениями");
  }

  return data.items;
}

type SendRequestArgs = {
  token: string,
  url: string;
  method: 'POST' | 'PATCH' | 'DELETE' | 'GET';
  body?: AppFields | null  // Make it optional for DELETE/GET
}

async function sendRequest ({token, url, method, body}: SendRequestArgs) {
  const stringifiedBody = body ? JSON.stringify(body) : undefined;
  
  const response = await fetch(new URL(url, API_BASE_URL), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: stringifiedBody  // undefined for DELETE/GET
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Ошибка: ${response.status}`);
  }

  return response.json();
}

export async function createApp({token, body}: CreateAppArgs) {
  await sendRequest({
    token,
    body, 
    method: 'POST',
    url: '/api/me/apps'
  })
}

export async function deleteApp({token, id}: DeleteAppArgs) {
  // DELETE requests usually don't have a body
  const response = await fetch(new URL(`/api/me/apps/${id}`, API_BASE_URL), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Не удалось удалить приложение");
  }

  return response.json();
}