export type CategoryParams = {
  id: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  price: number;
};

export type DataParams = {
  id: number;
  title: string;
  description: string;
  price: number;
  cover: {
    url: string;
  };
  category: {
    id: string;
    title: string;
  };
};

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  email: string;
};

export type AppFields = {
  categoryId: string;
  description: string;
  price: number;
  slug: string;
  title: string;
  cover?: Cover | null;
  screenshots?: Screenshot[];
  platforms?: string[];
  releaseDate?: string | null;
  ownerId?: string | null;
};

export type CreateAppArgs = {
  token: string;
  body: AppFields;
};

export type DeleteAppArgs = {
  token: string;
  id: string | number;
};

export type UpdateAppArgs = {
  token: string;
  id: string | number;
  body: AppFields;
};

export type Cover = {
  url: string;
  storageKey?: string | null;
  alt?: string;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  size?: number | null;
};

export type Screenshot = {
  url: string;
  storageKey?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  size?: number | null;
};
