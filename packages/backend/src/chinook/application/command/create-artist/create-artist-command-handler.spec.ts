import { CreateArtistCommandHandler } from './create-artist-command-handler';
import { InmemoryArtistRepository } from '../../../infrastructure/persistence/inmemory-artist-repository';
import { ArtistRepository } from '../../../domainmodel/artist-repository';
import { Artist } from '../../../domainmodel/artist';
import { CreateArtistCommand } from './create-artist-command';

describe('CreateArtistCommandHandler', () => {
  let artistRepository: ArtistRepository;
  let createArtistCommandHandler: CreateArtistCommandHandler;

  beforeEach(() => {
    artistRepository = new InmemoryArtistRepository();
    createArtistCommandHandler = new CreateArtistCommandHandler(
      artistRepository,
    );
  });

  it('should throw an exception if an artist with the same name already exists', async () => {
    const existingArtist = new Artist('existingArtist');
    await artistRepository.add(existingArtist);

    await expect(async () => {
      await createArtistCommandHandler.execute(
        new CreateArtistCommand('existingArtist'),
      );
    }).rejects.toThrowError();
  });

  it('should throw an exception if the artist name is empty', () => {
    expect(() => {
      new Artist('');
    }).toThrowError();
  });

  it('should save the artists to the persistent store', async () => {
    await createArtistCommandHandler.execute(
      new CreateArtistCommand('nonExistingArtist'),
    );

    expect((await artistRepository.all(0, 10)).length).toBe(1);
  });
});
