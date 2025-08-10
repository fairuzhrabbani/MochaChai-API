import request from 'supertest';

class UserAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getUserMe(accessToken) {
        const endpoint = '/user/me';

        return await request(this.baseUrl)
            .get(endpoint)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'application/json');
    }

    async getAllUsers() {
        const endpoint = '/users';

        return await request(this.baseUrl)
            .get(endpoint)
            .set('Content-Type', 'application/json');
    }

    async getSingleUser(id) {
        const endpoint = `/user/${id}`;

        return await request(this.baseUrl)
            .get(endpoint)
            .set('Content-Type', 'application/json');
    }

    async getSearchUser(search) {
        // const endpoint = `/user/search?q=${encodeURIComponent(search)}`;
        const endpoint = '/user/search';

        return await request(this.baseUrl)
            .get(endpoint)
            .query({q : search})
            .set('Content-Type', 'application/json');
    }

}

export default UserAPI;
