export type ScanResponseType = {
  barcode: string;
  releases?: Array<ReleasesType>;
};

export type ArtistType = {
  name: string;
};

export type MediaType = {
  format: string;
};

export type ReleasesType = {
  id: string;
  title?: string;
  "artist-credit"?: ArtistType[];
  cover?: string;
  date?: string;
  media?: MediaType[];
};
