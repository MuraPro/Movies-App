export default class SessionService {
  constructor() {
    this.API_KEY = '282e31062bfb9d0dbaeaf8fdb2231950';
    this.BASE_URL = 'https://api.themoviedb.org/3';
  }

  async getGuestSessionId() {
    const { BASE_URL, API_KEY } = this;

    const url = `${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('server error');
    }

    return res.json();
  }
}
