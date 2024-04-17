import {connectionToTestDatabase} from "../services/db.postgres";
import request from 'supertest';
import { userExa } from "../mock/static";
import app from "../app";
describe('user test',()=>{

beforeAll(async()=>{
    await connectionToTestDatabase();
})

describe('user sigin up with email and password test',()=>{
test("it should retun user create successfully",async()=>{
    const response=await request(app)
    .post('/api/v1/register')
    .send(userExa)
    .expect(201)
})

})


})