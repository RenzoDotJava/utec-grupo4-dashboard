interface HttpProps {
  url: string;
  body?: Object;
  error?: string;
}

export class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get({ url }: HttpProps) {
    const res = await fetch(this.baseUrl + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return res.json();
  }
}