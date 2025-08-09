import { expect } from 'chai';
import LoginAPI from '../api/LoginAPI.js';
import testData from '../testData/DataLogin.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

describe('Login API', function () {
  let loginApi;
  let positiveRes, negativeRes;

  before(async function () {
    loginApi = new LoginAPI(process.env.BASE_URL);
  });

  describe('🟢 Positive Tests - Valid Credentials', function () {

    before(async function () {
      positiveRes = await loginApi.login(testData.login.valid);
      // Debug log jika gagal
      if (positiveRes.status !== 200) {
        console.error('❌ Positive Test Failed');
        console.error('Status:', positiveRes.status);
        console.error('Body  :', positiveRes.body);
      }
    });

    it('Should return status code 200', function () {
      expect(positiveRes.status).to.equal(200);
    });

    it('Should have an accessToken (JWT format)', function () {
      expect(positiveRes.body).to.have.property('accessToken').that.is.a('string').and.not.empty;
      const parts = positiveRes.body.accessToken.split('.');
      expect(parts).to.have.lengthOf(3);
    });

    it('Should have a refreshToken (non-empty string)', function () {
      expect(positiveRes.body).to.have.property('refreshToken').that.is.a('string').and.not.empty;
    });

    it('Should have a numeric ID', function () {
      expect(positiveRes.body).to.have.property('id').that.is.a('number');
    });

    it('Username should match the request data', function () {
      expect(positiveRes.body.username).to.equal(testData.login.valid.username);
    });

    it('Should have a valid email address', function () {
      expect(positiveRes.body).to.have.property('email').that.is.a('string').and.not.empty;
      expect(positiveRes.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('Should have non-empty firstName and lastName', function () {
      expect(positiveRes.body).to.have.property('firstName').that.is.a('string').and.not.empty;
      expect(positiveRes.body).to.have.property('lastName').that.is.a('string').and.not.empty;
    });

    it('Should have gender either "male" or "female"', function () {
      expect(['male', 'female']).to.include(positiveRes.body.gender);
    });

    it('Should have a non-empty image URL', function () {
      expect(positiveRes.body).to.have.property('image').that.is.a('string').and.not.empty;
    });

  });

  describe('🔴 Negative Tests - Invalid Credentials', function () {

    describe('Case 1: Wrong username & password', function () {
      let negativeRes;

      before(async function () {
        negativeRes = await loginApi.login(testData.login.invalid[0]);
      });

      it('Should return status code 400 or 401', function () {
        expect([400, 401]).to.include(negativeRes.status);
      });

      it('Should contain an error message', function () {
        expect(negativeRes.body).to.have.property('message').that.is.a('string').and.not.empty;
      });

      it('Should not return an accessToken', function () {
        expect(negativeRes.body).to.not.have.property('accessToken');
      });

      it('Should not return sensitive data (id, username, email)', function () {
        expect(negativeRes.body).to.not.have.any.keys(['id', 'username', 'email']);
      });
    });

    describe('Case 2: Empty password', function () {
      let negativeRes;

      before(async function () {
        negativeRes = await loginApi.login(testData.login.invalid[1]);
      });

      it('Should return status code 400 or 401', function () {
        expect([400, 401]).to.include(negativeRes.status);
      });

      it('Should contain an error message', function () {
        expect(negativeRes.body).to.have.property('message').that.is.a('string').and.not.empty;
        expect(negativeRes.body).to.have.property('message').contain('Username and password required')
      });

      it('Should not return an accessToken', function () {
        expect(negativeRes.body).to.not.have.property('accessToken');
      });

      it('Should not return sensitive data (id, username, email)', function () {
        expect(negativeRes.body).to.not.have.any.keys(['id', 'username', 'email']);
      });

    });

  });


});
