export interface ApiDetails {
  title: string;
  description: string;
  image: string;
  swaggerUrl: string;
  contact: ApiContact;
}

export interface ApiContact {
  email?: string;
  url?: string;
  name?: string;
}
