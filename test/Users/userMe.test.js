import { expect } from 'chai';
import LoginAPI from '../../api/LoginAPI.js';
import UserAPI from '../../api/UserAPI.js'; 
import testData from '../../testData/DataLogin.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

describe('User API', function () {
  const baseUrl = process.env.BASE_URL;
  let userApi;
  let accessToken;

  before(async function () {
    userApi = new UserAPI(baseUrl);
    const loginApi = new LoginAPI(baseUrl);

    const loginRes = await loginApi.login(testData.login.valid);

    if (loginRes.status === 200) {
      accessToken = loginRes.body.accessToken;
    } else {
      console.error('Status:', loginRes.status);
      console.error('Body  :', loginRes.body);
      throw new Error('Login failed, cannot get access token');
    }
  });

  it('should get user data with access token', async function () {
    const res = await userApi.getUserMe(accessToken);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('firstName');
  });
});
