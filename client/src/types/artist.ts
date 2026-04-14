export interface Artist {
  id: number,
  name: string,
  birth_year: number | null;
  death_year: number | null;
  birth_place: string | null;
  description: string | null;
  example_artwork_url: string | null;
  artic_id: number | null;
  met_reference_object_id: number | null;
}