interface User {
  name: string;
  profile_img: string;
  email: string;
  id: number;
}

type Breadcrumb = {
  path: string;
  label: string;
  color?: string;
};

type BreadcrumbProps = {
  breadcrumbs: Array<Breadcrumb>;
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Array<Breadcrumb>>>;
};

type OutletContext = {
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  setBreadcrumbs: BreadcrumbProps["setBreadcrumbs"];
};
