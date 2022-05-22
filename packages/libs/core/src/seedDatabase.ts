import path from "path";
import { MikroORM } from "@mikro-orm/core";
import { LibraryEntity, LibraryType, UserEntity, UserRole } from "./entities";
import { GenreEntity } from "./entities/GenreEntity";

export async function seedDatabase(orm: MikroORM): Promise<void> {
  const generator = orm.getSchemaGenerator();
  try {
    await generator.createSchema();
  } catch {
    throw Error("Failed to create schema!");
  }
  try {
    await generator.updateSchema();
  } catch {
    throw Error("Failed to update schema!");
  }

  // create default admin user
  const userRepo = orm.em.getRepository(UserEntity);
  const user = userRepo.create({
    username: "admin",
    password: "admin",
    role: UserRole.ADMIN,
  });
  userRepo.persist(user);

  // create default media libraries
  const libraryRepo = orm.em.getRepository(LibraryEntity);
  const movieLibrary = libraryRepo.create({
    type: LibraryType.MOVIES,
    name: "Movies",
    titles: [],
    matcher: "*.{mkv,mp4,avi,xvid,mov,wmv}",
    path: path.resolve("G:\\My Drive\\media\\Movies"),
  });
  libraryRepo.persist(movieLibrary);

  const genreRepo = orm.em.getRepository(GenreEntity);

  const genres = {
    action: "Action",
    adventure: "Adventure",
    animation: "Animation",
    biography: "Biography",
    comedy: "Comedy",
    crime: "Crime",
    documentary: "Documentary",
    drama: "Drama",
    family: "Family",
    fantasy: "Fantasy",
    "film-noir": "Film Noir",
    "game-show": "Game-Show",
    history: "History",
    horror: "Horror",
    music: "Music",
    musical: "Musical",
    mystery: "Mystery",
    news: "News",
    "reality-tv": "Reality TV",
    romance: "Romance",
    "sci-fi": "Science Fiction",
    short: "Short",
    sport: "Sport",
    "talk-show": "Talk-Show",
    thriller: "Thriller",
    war: "War",
    western: "Western",
  };

  Object.entries(genres).forEach(([slug, name]) => {
    const genre = genreRepo.create({
      name,
      slug,
    });
    genreRepo.persist(genre);
  });

  await orm.em.flush();
  console.log(await userRepo.findAll());
}
