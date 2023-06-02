export type ListAdvertisersRequestQuery = {
  fulltext?: string;
  page?: number;
};
export type ListAdvertisersResultBody = {
  results: {
    // Advertiser
    _id: string;
    name: string;
    logo?: string;
    about?: string;
    web?: string;
  }[];
  meta: {
    total: number;
    page: number;
    pages: number;
  };
};
