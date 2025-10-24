// Mock data for development when services are not available
export const mockMovies = [
  {
    id: 1,
    name: "Avatar: The Way of Water",
    genre: "Sci-Fi",
    description: "Jake Sully lives with his newfound family formed on the planet of Pandora.",
    time: 192,
    ageRestriction: "PG-13",
    premiere: true,
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    showTimes: [
      {
        id: 1,
        startTime: "2025-01-15T14:00:00.000Z",
        precio: 15.50,
        cinemaIdExt: "cine-001",
        salaIdExt: "sala-001",
        salaNumber: 1
      },
      {
        id: 2,
        startTime: "2025-01-15T18:00:00.000Z",
        precio: 18.00,
        cinemaIdExt: "cine-001",
        salaIdExt: "sala-002",
        salaNumber: 2
      }
    ]
  },
  {
    id: 2,
    name: "Black Panther: Wakanda Forever",
    genre: "Action",
    description: "The people of Wakanda fight to protect their home from intervening world powers.",
    time: 161,
    ageRestriction: "PG-13",
    premiere: true,
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
    showTimes: [
      {
        id: 3,
        startTime: "2025-01-15T16:00:00.000Z",
        precio: 16.00,
        cinemaIdExt: "cine-002",
        salaIdExt: "sala-003",
        salaNumber: 3
      }
    ]
  },
  {
    id: 3,
    name: "Top Gun: Maverick",
    genre: "Action",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    time: 131,
    ageRestriction: "PG-13",
    premiere: false,
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    showTimes: [
      {
        id: 4,
        startTime: "2025-01-15T20:00:00.000Z",
        precio: 17.50,
        cinemaIdExt: "cine-001",
        salaIdExt: "sala-001",
        salaNumber: 1
      }
    ]
  },
  {
    id: 4,
    name: "Spider-Man: No Way Home",
    genre: "Action",
    description: "Spider-Man seeks help from Doctor Strange to forget his revealed identity.",
    time: 148,
    ageRestriction: "PG-13",
    premiere: false,
    poster: "https://image.tmdb.org/t/p/w500/1g6dh6Tw6l9i2b8q1K6Q1v6Q1v6.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    showTimes: [
      {
        id: 5,
        startTime: "2025-01-15T19:00:00.000Z",
        precio: 16.50,
        cinemaIdExt: "cine-002",
        salaIdExt: "sala-004",
        salaNumber: 4
      }
    ]
  },
  {
    id: 5,
    name: "The Batman",
    genre: "Action",
    description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
    time: 176,
    ageRestriction: "PG-13",
    premiere: false,
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qqHQsStV6exghCM7zbObuYBiYxw.jpg",
    showTimes: [
      {
        id: 6,
        startTime: "2025-01-15T21:00:00.000Z",
        precio: 18.50,
        cinemaIdExt: "cine-001",
        salaIdExt: "sala-002",
        salaNumber: 2
      }
    ]
  }
];

export const mockCinemas = [
  {
    id: 1,
    nombre: "Cine Plaza Norte",
    ciudad: "Lima",
    distrito: "Independencia",
    nro_salas: 5
  },
  {
    id: 2,
    nombre: "Cine Jockey Plaza",
    ciudad: "Lima",
    distrito: "Santiago de Surco",
    nro_salas: 8
  },
  {
    id: 3,
    nombre: "Cine Mall del Sur",
    ciudad: "Lima",
    distrito: "Chorrillos",
    nro_salas: 6
  },
  {
    id: 4,
    nombre: "Cine Real Plaza",
    ciudad: "Arequipa",
    distrito: "Cayma",
    nro_salas: 4
  },
  {
    id: 5,
    nombre: "Cine Open Plaza",
    ciudad: "Trujillo",
    distrito: "La Esperanza",
    nro_salas: 3
  }
];

export const mockBookings = [
  {
    _id: "b-001",
    showtime_id: "s-100",
    movie_id: "m-100",
    cinema_id: "c-200",
    sala_id: "room-7",
    sala_number: 7,
    seats: [
      { seat_row: "A", seat_number: 10 },
      { seat_row: "A", seat_number: 11 }
    ],
    user: {
      user_id: "u-123",
      name: "Luciana",
      email: "l@x.com"
    },
    payment_method: "yape",
    source: "web",
    status: "CONFIRMED",
    price_total: 32.5,
    currency: "PEN"
  }
];
