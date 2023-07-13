export interface ApiDetail {
  title: string;
  description: string;
  image: string;
  swaggerUrl: string;
  contact: ApiContact;
}

export interface ApiDisplay {
  title: string;
  image: string;
  provider: string;
  service: string;
}

export interface ApiContact {
  email?: string;
  url?: string;
  name?: string;
}
