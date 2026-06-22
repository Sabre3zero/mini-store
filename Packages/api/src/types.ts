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
