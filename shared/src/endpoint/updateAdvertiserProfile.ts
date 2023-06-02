export type UpdateAdvertiserProfileRequestBody = {
  // Advertiser
  advertiserId: string;
  name?: string;
  about?: string;
  web?: string;
  logo?: string;
};

export type UpdateAdvertiserProfileResultBody = void;
