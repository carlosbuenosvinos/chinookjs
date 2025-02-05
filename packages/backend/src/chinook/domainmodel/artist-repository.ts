import { Artist } from './artist';

export interface ArtistRepository {
  byId(id: number): Promise<Artist | null>;
  add(artist: Artist): Promise<void>;
  all(offset: number, limit: number): Promise<Artist[]>;
  byName(name: string): Promise<Artist | null>;
}
