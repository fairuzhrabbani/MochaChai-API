import request from 'supertest';

class LoginAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async login(data) {
    const endpoint = '/auth/login';
    const body = data;
    // const url = `${this.baseUrl}${endpoint}`;

    // Debug log
    // console.log('=== API REQUEST DEBUG ===');
    // console.log('URL     :', url);
    // console.log('Method  : POST');
    // console.log('Headers : { Content-Type: application/json }');
    // console.log('Body    :', JSON.stringify(body, null, 2));
    // console.log('=========================');

    return await request(this.baseUrl)
      .post(endpoint)
      .send(body)
      .set('Content-Type', 'application/json');
  }
}

export default LoginAPI;
