import type { Artwork } from './artwork'
import type { ArtworkThumbnail } from './common'

export interface Visit {
  id: number;
  user_id: number;
  museum_id: number;
  museum_name: string;
  visit_date: string;
  artwork_thumbnails: ArtworkThumbnail[];
}

export interface VisitDetail extends Visit {
  artworks: Artwork[];
}

export interface AddVisitFormData {
  user_id: number;
  museum_id: number;
  visit_date: string;
}