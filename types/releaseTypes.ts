export type ScanResponseType = {
  barcode: string;
  releases?: Array<ReleasesType>;
};

export type ArtistType = {
  name: string;
};

export type CoverType = {
  formats: string;
};

export type ReleasesType = {
  id: string;
  title?: string;
  artists?: ArtistType[];
  images?: [
    {
      uri: string;
    },
  ];
  year?: number;
  formats: [
    {
      name: string;
    },
  ];
};

export type ListReleasesType = {
  id: string;
  title?: string;
  artists?: ArtistType[];
  cover?: CoverType[];
  release_date?: string;
};
