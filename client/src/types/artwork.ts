export interface Artwork {
  id: number;
  title: string;
  artist_id: number | null;
  artist_name: string | null;
  year_created: string | null;
  medium: string | null;
  image_url: string | null;
}

export interface ArtworkDetail extends Artwork {
  museum_id: number | null;
  museum_name: string | null;
  tags: string[] | null;
  artic_id: number | null;
  met_id: number | null;
}

export interface CreateArtworkData {
  title: string;
  artist_id: number | null;
  museum_id: number | null;
  year_created: number | null;
  medium: string | null;
  image_url: string | null;
}