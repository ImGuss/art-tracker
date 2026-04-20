export interface Artwork {
  id: number;
  title: string;
  artist_id: number | null;
  name: string | null;
  year_created: string | null;
  medium: string | null;
  image_url: string | null;
  museum_id: number | null;
  museum_name: string | null;
  tags: string[] | null;
}