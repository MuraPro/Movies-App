export default class SessionService {
  constructor() {
    this.API_KEY = '8686551b095b566101694eafefebd764';
    this.BASE_URL = 'https://api.themoviedb.org/3';
  }

  async getGuestSessionId() {
    /* eslint-disable*/
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Njg2NTUxYjA5NWI1NjYxMDE2OTRlYWZlZmViZDc2NCIsInN1YiI6IjYzOTU4YTE3OGE4OGIyMDA4YTJmZjgxOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IHBIX5wfJoOvk-lvzZaMqRuEscuFEaYy5jl7nE08s6I',
      },
    };
    const url = `https://api.themoviedb.org/3/authentication/guest_session/new`;

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error('server error');
    }

    return res.json();
  }
}
