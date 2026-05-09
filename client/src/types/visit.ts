import type { Artwork } from './artwork'

export interface Visit {
  id: number;
  user_id: number;
  museum_id: number;
  museum_name: string;
  visit_date: string;
}

export interface VisitArtwork {
  visit_id: number;
  artwork_id: number;
}

export interface VisitDetail extends Visit {
  artworks: Artwork[];
}

export interface AddVisitFormData {
  user_id: number;
  museum_id: number;
  visit_date: string;
}