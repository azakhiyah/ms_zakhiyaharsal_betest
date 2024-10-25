// tests/userController.test.js
import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import * as userController from '../controller/userController.js';
import redisClient from '../config/redisClient.js';

// Mock request and response objects
const req = { body: {}, params: {} };
const res = {
  status: sinon.stub().returnsThis(),
  json: sinon.stub()
};

describe('User Controller - getUsers', () => {
  beforeEach(() => {
    sinon.restore(); // Reset stubbed functions before each test
  });

  it('should return users from Redis cache', async () => {
    const cachedUsers = [{ userName: 'John Doe', emailAddress: 'john@example.com' }];
    
    sinon.stub(redisClient, 'get').resolves(JSON.stringify(cachedUsers));

    await userController.getUsers(req, res);

    expect(redisClient.get.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ success: true, data: cachedUsers })).to.be.true;
  });

  it('should fetch users from MongoDB if Redis cache is empty', async () => {
    const users = [{ userName: 'Jane Doe', emailAddress: 'jane@example.com' }];

    sinon.stub(redisClient, 'get').resolves(null); // Redis cache miss
    sinon.stub(User, 'find').resolves(users); // Mock MongoDB query
    sinon.stub(redisClient, 'setEx').resolves(); // Stub Redis cache setEx

    await userController.getUsers(req, res);

    expect(User.find.calledOnce).to.be.true;
    expect(redisClient.setEx.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ success: true, data: users })).to.be.true;
  });
});

describe('User Controller - createUser', () => {
  beforeEach(() => {
    sinon.restore(); // Reset stubbed functions before each test
  });

  it('should create a new user and store it in Redis', async () => {
    const newUser = { userName: 'Joko suranto',accountNumber: '98076',emailAddress: 'jokosuranto@example.com' , identityNumber: '8765', password: 'joko'};
    req.body = newUser;

    // Stub bcrypt hash function
    sinon.stub(bcrypt, 'genSalt').resolves('salt');
    sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
    
    // Stub User model's save method
    sinon.stub(User.prototype, 'save').resolves(newUser);

    // Stub Redis set function
    sinon.stub(redisClient, 'set').resolves();

    await userController.createUser(req, res);

    expect(bcrypt.hash.calledOnce).to.be.true;
    expect(User.prototype.save.calledOnce).to.be.true;
    expect(redisClient.set.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith({ success: true, data: newUser })).to.be.true;
    //console.log('Response object:', res);
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = {}; // Missing fields

    await userController.createUser(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ success: false, message: "Please provide all fields" })).to.be.true;
  });
});
