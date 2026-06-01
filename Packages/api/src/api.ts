import { Data } from "./types";

export async function getData() {
  const response = await fetch("https://ministor.ru/api/apps");
  const data = await response.json();
  return data.items.filter((item: Data) => item.cover !== null);
}
