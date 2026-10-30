describe('ReqRes API Automation Test Suite - 12 Requests', () => {

  // 1. GET List Users
  it('TC-01: GET List Users Page 2', () => {
    cy.request('GET', 'https://reqres.in/api/users?page=2').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('page', 2);
      expect(response.body.data).to.be.an('array').that.is.not.empty;
      expect(response.body.data[0]).to.have.property('email');
    });
  });

  // 2. GET Single User
  it('TC-02: GET Single User Success', () => {
    cy.request('GET', 'https://reqres.in/api/users/2').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('id', 2);
      expect(response.body.data).to.have.property('first_name', 'Janet');
      expect(response.body.data).to.have.property('email', 'janet.weaver@reqres.in');
    });
  });

  // 3. GET Single User Not Found
  it('TC-03: GET Single User Not Found', () => {
    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/users/23',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.deep.eq({});
    });
  });

  // 4. GET List Resource
  it('TC-04: GET List Resource', () => {
    cy.request('GET', 'https://reqres.in/api/unknown').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.be.an('array').that.is.not.empty;
      expect(response.body.data[0]).to.have.property('name');
    });
  });

  // 5. GET Single Resource
  it('TC-05: GET Single Resource Success', () => {
    cy.request('GET', 'https://reqres.in/api/unknown/2').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('id', 2);
      expect(response.body.data).to.have.property('name', 'fuchsia rose');
    });
  });

  // 6. GET Single Resource Not Found
  it('TC-06: GET Single Resource Not Found', () => {
    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/unknown/23',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.deep.eq({});
    });
  });

  // 7. POST Create User
  it('TC-07: POST Create User', () => {
    cy.request('POST', 'https://reqres.in/api/users', {
      name: 'Wahyu',
      job: 'QA Automation Engineer'
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('name', 'Wahyu');
      expect(response.body).to.have.property('job', 'QA Automation Engineer');
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });
  });

  // 8. PUT Update User
  it('TC-08: PUT Update User', () => {
    cy.request('PUT', 'https://reqres.in/api/users/2', {
      name: 'Wahyu',
      job: 'Senior QA Engineer'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name', 'Wahyu');
      expect(response.body).to.have.property('job', 'Senior QA Engineer');
      expect(response.body).to.have.property('updatedAt');
    });
  });

  // 9. PATCH Update User
  it('TC-09: PATCH Update User', () => {
    cy.request('PATCH', 'https://reqres.in/api/users/2', {
      job: 'Lead QA'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('job', 'Lead QA');
      expect(response.body).to.have.property('updatedAt');
    });
  });

  // 10. DELETE User
  it('TC-10: DELETE User', () => {
    cy.request('DELETE', 'https://reqres.in/api/users/2').then((response) => {
      expect(response.status).to.eq(204);
      expect(response.body).to.be.empty;
    });
  });

  // 11. POST Register Successful
  it('TC-11: POST Register Successful', () => {
    cy.request('POST', 'https://reqres.in/api/register', {
      email: 'eve.holt@reqres.in',
      password: 'pistol'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 4);
      expect(response.body).to.have.property('token').that.is.a('string');
    });
  });

  // 12. POST Register Unsuccessful
  it('TC-12: POST Register Unsuccessful (Missing Password)', () => {
    cy.request({
      method: 'POST',
      url: 'https://reqres.in/api/register',
      body: { email: 'sydney@fife' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'Missing password');
    });
  });

});