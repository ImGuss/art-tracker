import type { Artwork } from './artwork'

export interface Visit {
  id: number;
  user_id: number;
  museum_id: number;
  museum_name: string;
  visit_date: string;
  artwork_thumbnails: VisitArtwork[];
}

export interface VisitArtwork {
  id: number;
  title: string;
  image_url: string | null;
}

export interface VisitDetail extends Visit {
  artworks: Artwork[];
}

export interface AddVisitFormData {
  user_id: number;
  museum_id: number;
  visit_date: string;
}