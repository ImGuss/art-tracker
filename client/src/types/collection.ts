import type { Artwork } from './artwork'
import type { ArtworkThumbnail } from './common'

export interface Collection {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  artwork_thumbnails: ArtworkThumbnail[];
}

export interface CollectionDetail extends Collection {
  artworks: Artwork[];
}