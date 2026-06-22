import { DataParams, LoginParams } from "./types";

const API_BASE_URL = 'https://ministor.ru'


export async function getData() {
  const response = await fetch(new URL('/api/apps', API_BASE_URL));
  const data = await response.json();
  return data.items.filter((item: DataParams) => item.cover !== null);
}

export async function login({ email, password }: LoginParams):Promise<string> {

  const response = await fetch(new URL('/api/auth/login', API_BASE_URL), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Не удалось войти. Провертье почту и пароль.')
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error('Сервер не вернул token.')
  }

  return data.token
}