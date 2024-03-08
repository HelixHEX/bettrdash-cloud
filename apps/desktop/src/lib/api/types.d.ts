//MUTATIONS
type CreateProjectProps = {
  id?: string;
  name: string;
  github_url?: string;
  description: string;
  language: string;
  active: boolean;
  url?: string;
  environment?: string;
  image_url?: string;
};

type LoginProps = {
  email: string;
  password: string;
};

type ProjectProps = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  github_url?: string;
  language: string;
  description: string;
  active: boolean;
  image_url: string;
  status: string;
  websites?: WebsiteProps[];
  defaultWebsiteId?: number;
  live_url?: string;
};

type WebsiteProps = {
  createdAt: string;
  environment: string;
  id: number;
  ownerId: number;
  projectId?: number;
  status: string;
  updatedAt: string;
  url: string;
  default: boolean;
  tracking: boolean;
};
