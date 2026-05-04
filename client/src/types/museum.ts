import type { Artwork } from "./artwork";

export interface Museum {
  id: number;
  name: string;
  city: string;
  country: string;
  image_url: string | null;
}

export interface MuseumDetail extends Museum {
  artworks: Artwork[];
}

export interface CreateMuseumData {
  name: string;
  city: string;
  country: string;
  image_url: string | null;
}