import type { Artist } from "../types/artist"

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {

  return (
    <article>Name is {artist.name}</article>
  )
}

export default ArtistCard