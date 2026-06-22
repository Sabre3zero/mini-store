export type DataParams = {
  id: number;
  title: string;
  description: string;
  price: number;
  cover: {
    url: string;
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
  title: string, 
  slug: string, 
  description: string,
  price: number,
  categoryId: string
}

export type CreateAppArgs = {
  token: string;
  body: AppFields;
}