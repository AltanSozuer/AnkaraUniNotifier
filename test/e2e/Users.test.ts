import app from '../../src/app'
import request from 'supertest';
import IUser from '../../src/models/dto/User.dto';
import UserService from '../../src/services/UserService';
import MongoDBService from '../../src/services/MongoDBService';
import { describe, afterAll, it, jest, expect, beforeAll, beforeEach} from '@jest/globals'
const REGISTER_ENDPOINT = '/register';
jest.setTimeout(5000);


beforeAll( async () => {
    await MongoDBService.connectDB();
})

afterAll( async () => {
    await MongoDBService.disconnect();
})


describe('POST /register Success', () => {
    let userData: IUser= {
        name: 'samplename',
        surname: 'sampleSurname',
        email: 'sampleUserName@gmail.com',
        password: 'samplePassword'
    }
    beforeEach( async () => {
        await MongoDBService.clearCollections();
    })

    it('Should create a user in db and return 201 when given params are valid', async () => {
        expect.assertions(5);
        const result = await request(app)
            .post(REGISTER_ENDPOINT)
            .send(userData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then( res => res.body.data)
 
        expect(result).toHaveProperty('_id');
        expect(result?.name).toBe(userData.name);
        expect(result?.surname).toBe(userData.surname);
        expect(result?.email).toBe(userData.email);
        expect(result).not.toHaveProperty('password');
    })
})


describe.only('POST /register Validation Tests', () => {
    
    const funcToRun = async (param: any, msg: string, field: string) => {
        const result = await request(app)
            .post(REGISTER_ENDPOINT)
            .send(param)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then( res => res.body.error)

            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        location: 'body',
                        msg: msg,
                        path: field,
                        type: 'field',
                        value: param[field]
                    })
                ])
            )  
    }

    beforeEach( async () => {
        await MongoDBService.clearCollections();
    })

    it('001 - Should return 400 when given "name" param is not valid', async () => {
        expect.assertions(4);
        // invalid user data that has no name property
        let invalidUserData = {
            surname: 'sampleSurname',
            email: 'sampleUserName@gmail.com',
            password: 'samplePassword'
        }
        const expectedErrMesg = 'name must be string'
       
        await Promise.all([
            funcToRun({...invalidUserData, name: null}, expectedErrMesg ,"name"),
            funcToRun({...invalidUserData, name: 12}, expectedErrMesg , "name"),
            funcToRun({...invalidUserData, name: []}, expectedErrMesg , "name"),
            funcToRun({...invalidUserData, name: true}, expectedErrMesg , "name"),
        ])
    })

    it('002 - Should return 400 when given "name" param is not given in body', async () => {
        expect.assertions(1);
        // invalid user data that has no name property
        let invalidUserData = {
            surname: 'sampleSurname',
            email: 'sampleUserName@gmail.com',
            password: 'samplePassword'
        }
        const expectedErrMesg = 'name must be exist'
        const result = await request(app)
            .post(REGISTER_ENDPOINT)
            .send(invalidUserData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then( res => res.body.error)

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    location: 'body',
                    msg: expectedErrMesg,
                    path: "name",
                    type: 'field'
                })
            ])
        )
    })

    it('003 - Should return 400 when given "surname" param is not valid', async () => {
        expect.assertions(4);
        // invalid user data that has no surname property
        let invalidUserData = {
            name: 'samplename',
            email: 'sampleUserName@gmail.com',
            password: 'samplePassword'
        }
        const expectedErrMesg = 'surname must be string'
       
        await Promise.all([
            funcToRun({...invalidUserData, surname: null},expectedErrMesg , "surname"),
            funcToRun({...invalidUserData, surname: 12},expectedErrMesg , "surname"),
            funcToRun({...invalidUserData, surname: []},expectedErrMesg , "surname"),
            funcToRun({...invalidUserData, surname: true},expectedErrMesg , "surname")
        ])
    })

    it('004 - Should return 400 when given "surname" param is not given in body', async () => {
        expect.assertions(1);
        // invalid user data that has no surname property
        let invalidUserData = {
            name: 'samplename',
            email: 'sampleUserName@gmail.com',
            password: 'samplePassword'
        }
        const expectedErrMesg = 'surname must be exist'
        const result = await request(app)
            .post(REGISTER_ENDPOINT)
            .send(invalidUserData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then( res => res.body.error)

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    location: 'body',
                    msg: expectedErrMesg,
                    path: "surname",
                    type: 'field'
                })
            ])
        )
    })

    it('005 - Should return 400 when given "email" param is not valid', async () => {
        expect.assertions(4);
        // invalid user data that has no email property
        let invalidUserData = {
            name: 'samplename',
            surname: 'sampleSurname',
            password: 'samplePassword'
        }
        const expectedErrMesg = 'email format is invalid'
       
        await Promise.all([
            funcToRun({...invalidUserData, email: null},expectedErrMesg, "email"),
            funcToRun({...invalidUserData, email: 12}, expectedErrMesg, "email"),
            funcToRun({...invalidUserData, email: []}, expectedErrMesg, "email"),
            funcToRun({...invalidUserData, email: true}, expectedErrMesg,"email")
        ])
    })

    it('006 - Should return 400 when given "email" param is not given in body', async () => {
        expect.assertions(1);
        // invalid user data that has no email property
        let invalidUserData = {
            name: 'samplename',
            surname: 'sampleSurname',
            password: 'samplePassword'
        }
        const expectedErrMesg = 'email must be exist'
        const result = await request(app)
            .post(REGISTER_ENDPOINT)
            .send(invalidUserData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then( res => res.body.error)

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    location: 'body',
                    msg: expectedErrMesg,
                    path: "email",
                    type: 'field'
                })
            ])
        )
    })

    it('007 - Should return 400 when given "password" param is not valid', async () => {
        expect.assertions(4);
        // invalid user data that has no password property
        let invalidUserData = {
            name: 'samplename',
            surname: 'sampleSurname',
            email: 'sampleEmail@gmail.com'
        }
        const expectedErrMesg = "password must be string"
        await Promise.all([
            funcToRun({...invalidUserData, password: null}, expectedErrMesg, "password"),
            funcToRun({...invalidUserData, password: 12}, expectedErrMesg, "password"),
            funcToRun({...invalidUserData, password: []}, expectedErrMesg, "password"),
            funcToRun({...invalidUserData, password: true}, expectedErrMesg,"password")
        ])
    })

    it('008 - Should return 400 when given "password" param is not given in body', async () => {
        expect.assertions(1);
        // invalid user data that has no password property
        let invalidUserData = {
            name: 'samplename',
            surname: 'sampleSurname',
            email: 'sampleEmail@gmail.com'
        }
        const expectedErrMesg = 'password must be exist'
        const result = await request(app)
            .post(REGISTER_ENDPOINT)
            .send(invalidUserData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then( res => res.body.error)

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    location: 'body',
                    msg: expectedErrMesg,
                    path: "password",
                    type: 'field'
                })
            ])
        )
    })
    
    
})