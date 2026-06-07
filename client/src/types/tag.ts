import type { Artwork } from './artwork'

export interface Tag {
  id: number,
  name: string,
  artworks: Artwork[]
}