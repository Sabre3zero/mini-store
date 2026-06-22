import { AppFields, DataParams, LoginParams, LoginResponse, CreateAppArgs } from "./types";

const API_BASE_URL = "https://ministor.ru";

export async function getData() {
  const response = await fetch(new URL("/api/apps", API_BASE_URL));
  const data = await response.json();
  return data.items.filter((item: DataParams) => item.cover !== null);
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
  method: 'POST' | 'PATCH' | 'DELETE';
  body: AppFields | null
}

async function sendRequest ({token, url, method, body}: SendRequestArgs) {
  
  const response = await fetch(new URL(url, API_BASE_URL), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error("Не удалось получить приложения");
  }
}

export async function createApp({token, body}: CreateAppArgs) {
  await sendRequest({
    body,
    method: 'POST',
    token,
    url: '/api/me/apps'
  })
}