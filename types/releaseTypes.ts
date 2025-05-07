export type ScanResponseType = {
  data: {
    barcode: string;
    releases?: Array<ScanReleaseType>;
  };
};

export type ScanReleaseType = {
  id: number;
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

export type ArtistType = {
  id: number;
  name: string;
};

export type CoverType = {
  formats: string;
};

export type FormatType = {
  id: number;
  name: string;
};

export type ListReleaseType = {
  id: number;
  title?: string;
  release_date?: string;
  cover?: string;
  barcode?: string;
  artists?: ArtistType[];
  shelf: {
    id: number;
    location: string;
  };
  format: FormatType;
};
