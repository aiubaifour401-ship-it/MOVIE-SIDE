import { Movie } from '../types';

export const ALL_GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Adventure',
  'Crime',
  'Animation',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Comedy'
];

export const SAMPLE_MOVIES: Movie[] = [
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'Way9Dexny3w',
    releaseYear: 2024,
    imdbRating: 8.6,
    rottenTomatoesScore: 92,
    runtimeMinutes: 166,
    director: 'Denis Villeneuve',
    writer: 'Denis Villeneuve, Jon Spaihts',
    genres: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    contentRating: 'PG-13',
    featured: true,
    trending: true,
    topRated: true,
    oscarWinner: true,
    budget: '$190 Million',
    boxOffice: '$711.8 Million',
    language: 'English',
    quotes: [
      'Power over spice is power over all.',
      'May thy knife chip and shatter.'
    ],
    cast: [
      { id: 'c1', name: 'Timothée Chalamet', role: 'Paul Atreides', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
      { id: 'c2', name: 'Zendaya', role: 'Chani', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' },
      { id: 'c3', name: 'Rebecca Ferguson', role: 'Lady Jessica', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop' },
      { id: 'c4', name: 'Javier Bardem', role: 'Stilgar', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Elena Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2024-03-05',
        comment: 'A monumental achievement in modern sci-fi filmmaking. Hans Zimmer sound design will make your soul tremble!',
        verifiedWatch: true,
        likes: 142
      },
      {
        id: 'r2',
        author: 'Marcus Brody',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
        rating: 9,
        date: '2024-03-12',
        comment: 'Denis Villeneuve delivers scale that feels breathtakingly tactile and real. Unforgettable cinematography.',
        verifiedWatch: true,
        likes: 89
      }
    ],
    similarMovieIds: ['interstellar', 'blade-runner-2049', 'oppenheimer']
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'zSWdZVtXT7E',
    releaseYear: 2014,
    imdbRating: 8.7,
    rottenTomatoesScore: 73,
    runtimeMinutes: 169,
    director: 'Christopher Nolan',
    writer: 'Jonathan Nolan, Christopher Nolan',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    contentRating: 'PG-13',
    featured: true,
    topRated: true,
    oscarWinner: true,
    budget: '$165 Million',
    boxOffice: '$773.8 Million',
    language: 'English',
    quotes: [
      'Love is the one thing that transcends time and space.',
      'Do not go gentle into that good night.'
    ],
    cast: [
      { id: 'c5', name: 'Matthew McConaughey', role: 'Cooper', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
      { id: 'c6', name: 'Anne Hathaway', role: 'Brand', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop' },
      { id: 'c7', name: 'Jessica Chastain', role: 'Murph', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Julian K.',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2023-11-10',
        comment: 'The docking scene alone with Zimmer score is pure cinematic perfection.',
        verifiedWatch: true,
        likes: 310
      }
    ],
    similarMovieIds: ['dune-part-two', 'inception', 'oppenheimer']
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'uYPbbksJxIg',
    releaseYear: 2023,
    imdbRating: 8.9,
    rottenTomatoesScore: 93,
    runtimeMinutes: 180,
    director: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    genres: ['Drama', 'History', 'Biography'],
    contentRating: 'R',
    featured: true,
    trending: true,
    topRated: true,
    oscarWinner: true,
    budget: '$100 Million',
    boxOffice: '$957 Million',
    language: 'English',
    quotes: [
      'Now I am become Death, the destroyer of worlds.',
      'They won\'t fear it until they understand it, and they won\'t understand it until they\'ve used it.'
    ],
    cast: [
      { id: 'c8', name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
      { id: 'c9', name: 'Emily Blunt', role: 'Katherine Oppenheimer', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop' },
      { id: 'c10', name: 'Robert Downey Jr.', role: 'Lewis Strauss', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Sarah Jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2023-08-01',
        comment: 'A 3-hour biographical dialogue film that grips you tighter than any action blockbuster.',
        verifiedWatch: true,
        likes: 215
      }
    ],
    similarMovieIds: ['interstellar', 'inception']
  },
  {
    id: 'inception',
    title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'YoHD9XEInc0',
    releaseYear: 2010,
    imdbRating: 8.8,
    rottenTomatoesScore: 87,
    runtimeMinutes: 148,
    director: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    genres: ['Action', 'Sci-Fi', 'Adventure', 'Mystery'],
    contentRating: 'PG-13',
    topRated: true,
    oscarWinner: true,
    budget: '$160 Million',
    boxOffice: '$836.8 Million',
    language: 'English',
    quotes: [
      'An idea is like a virus. Resilient. Highly contagious.',
      'You must not be afraid to dream a little bigger, darling.'
    ],
    cast: [
      { id: 'c11', name: 'Leonardo DiCaprio', role: 'Cobb', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
      { id: 'c12', name: 'Joseph Gordon-Levitt', role: 'Arthur', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
      { id: 'c13', name: 'Elliot Page', role: 'Ariadne', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r5',
        author: 'David Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2022-05-14',
        comment: 'Mind bending narrative layered with insane practical effects.',
        verifiedWatch: true,
        likes: 180
      }
    ],
    similarMovieIds: ['interstellar', 'blade-runner-2049']
  },
  {
    id: 'spider-man-across-the-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'With great power comes great responsibility.',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'cqGjhVJWtEg',
    releaseYear: 2023,
    imdbRating: 8.7,
    rottenTomatoesScore: 95,
    runtimeMinutes: 140,
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    writer: 'Phil Lord, Christopher Miller, Dave Callaham',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    contentRating: 'PG',
    featured: true,
    trending: true,
    topRated: true,
    budget: '$100 Million',
    boxOffice: '$690.9 Million',
    language: 'English',
    quotes: [
      'Everyone keeps telling me how my story is supposed to go. Nah. Imma do my own thing.',
      'You have a choice between saving one person and saving every world.'
    ],
    cast: [
      { id: 'c14', name: 'Shameik Moore', role: 'Miles Morales', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
      { id: 'c15', name: 'Hailee Steinfeld', role: 'Gwen Stacy', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' },
      { id: 'c16', name: 'Oscar Isaac', role: 'Miguel O\'Hara', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Maya Lin',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2023-06-10',
        comment: 'An explosive visual masterpiece that pushes animation boundaries to unimaginable heights.',
        verifiedWatch: true,
        likes: 290
      }
    ],
    similarMovieIds: ['spirited-away', 'inception']
  },
  {
    id: 'spirited-away',
    title: 'Spirited Away',
    tagline: 'The tunnel led to a world beyond belief.',
    synopsis: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'ByXuk9QqQkk',
    releaseYear: 2001,
    imdbRating: 8.6,
    rottenTomatoesScore: 97,
    runtimeMinutes: 125,
    director: 'Hayao Miyazaki',
    writer: 'Hayao Miyazaki',
    genres: ['Animation', 'Adventure', 'Fantasy', 'Family'],
    contentRating: 'PG',
    topRated: true,
    oscarWinner: true,
    budget: '$19 Million',
    boxOffice: '$395.8 Million',
    language: 'Japanese',
    quotes: [
      'Once you\'ve met someone you never really forget them.',
      'Welcome to the bathhouse of the gods.'
    ],
    cast: [
      { id: 'c17', name: 'Rumi Hiiragi', role: 'Chihiro / Sen', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop' },
      { id: 'c18', name: 'Miyu Irino', role: 'Haku', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r7',
        author: 'Kaito T.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2023-01-15',
        comment: 'Studio Ghibli at its finest. Enchanting, melancholic, and deeply beautiful.',
        verifiedWatch: true,
        likes: 198
      }
    ],
    similarMovieIds: ['spider-man-across-the-spider-verse']
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    tagline: 'The key to the future is finally unearthed.',
    synopsis: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'gCcx85zbxz4',
    releaseYear: 2017,
    imdbRating: 8.0,
    rottenTomatoesScore: 88,
    runtimeMinutes: 164,
    director: 'Denis Villeneuve',
    writer: 'Hampton Fancher, Michael Green',
    genres: ['Sci-Fi', 'Mystery', 'Drama', 'Action'],
    contentRating: 'R',
    topRated: true,
    oscarWinner: true,
    budget: '$150 Million',
    boxOffice: '$267.5 Million',
    language: 'English',
    quotes: [
      'All the best memories are hers.',
      'Dying for the right cause is the most human thing we can do.'
    ],
    cast: [
      { id: 'c19', name: 'Ryan Gosling', role: 'K', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
      { id: 'c20', name: 'Harrison Ford', role: 'Rick Deckard', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
      { id: 'c21', name: 'Ana de Armas', role: 'Joi', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r8',
        author: 'Leo Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop',
        rating: 9,
        date: '2023-04-20',
        comment: 'Roger Deakins cinematography is legendary. Every frame is a museum painting.',
        verifiedWatch: true,
        likes: 164
      }
    ],
    similarMovieIds: ['dune-part-two', 'inception']
  },
  {
    id: 'parasite',
    title: 'Parasite',
    tagline: 'Act like you own the place.',
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: '5xH0HfJHsaY',
    releaseYear: 2019,
    imdbRating: 8.5,
    rottenTomatoesScore: 99,
    runtimeMinutes: 132,
    director: 'Bong Joon Ho',
    writer: 'Bong Joon Ho, Han Jin-won',
    genres: ['Drama', 'Thriller', 'Comedy'],
    contentRating: 'R',
    topRated: true,
    oscarWinner: true,
    budget: '$15.5 Million',
    boxOffice: '$263.1 Million',
    language: 'Korean',
    quotes: [
      'You know what kind of plan never fails? No plan at all.',
      'So metaphorical!'
    ],
    cast: [
      { id: 'c22', name: 'Song Kang-ho', role: 'Kim Ki-taek', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
      { id: 'c23', name: 'Choi Woo-shik', role: 'Kim Ki-woo', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r9',
        author: 'Grace Park',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
        rating: 10,
        date: '2023-09-02',
        comment: 'Masterpiece of tension, satire, and social commentary. The shift in tone halfway through is flawless.',
        verifiedWatch: true,
        likes: 240
      }
    ],
    similarMovieIds: ['oppenheimer']
  },
  {
    id: 'alien-romulus',
    title: 'Alien: Romulus',
    tagline: 'In space no one can hear you scream.',
    synopsis: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying lifeform in the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    trailerYoutubeId: 'x0XDEhP4MQs',
    releaseYear: 2024,
    imdbRating: 7.3,
    rottenTomatoesScore: 80,
    runtimeMinutes: 119,
    director: 'Fede Alvarez',
    writer: 'Fede Alvarez, Rodo Sayagues',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    contentRating: 'R',
    trending: true,
    budget: '$80 Million',
    boxOffice: '$350 Million',
    language: 'English',
    quotes: [
      'There is something in the cargo bay.',
      'Run!'
    ],
    cast: [
      { id: 'c24', name: 'Cailee Spaeny', role: 'Rain Carradine', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' },
      { id: 'c25', name: 'David Jonsson', role: 'Andy', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' }
    ],
    reviews: [
      {
        id: 'r10',
        author: 'Tom Hardy Jr.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
        rating: 8,
        date: '2024-09-01',
        comment: 'Tactile practical animatronics and relentless tension from start to finish.',
        verifiedWatch: true,
        likes: 95
      }
    ],
    similarMovieIds: ['dune-part-two', 'interstellar']
  }
];
