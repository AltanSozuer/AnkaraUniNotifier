import { configureEnvFile } from '../../src/utils/EnvConfig'
configureEnvFile();
import MongoDBService from "../../src/services/MongoDBService";
import TokenService from "../../src/services/TokenService";
import IUser from '../../src/models/dto/User.dto';
import UserService from '../../src/services/UserService';

import { describe, afterAll, it, jest, expect, beforeAll, beforeEach} from '@jest/globals'

jest.setTimeout(3000);


beforeAll( async () => {
    await MongoDBService.connectDB();
})

afterAll( async () => {
    await MongoDBService.disconnect();
})

describe('createToken()', () => {

    beforeEach( async () => {
        await MongoDBService.clearCollections();
    })

    it('001 - createToken() should create token in db for given user', async () => {
        expect.assertions(2);
        const userObj: IUser = {
            name: 'Jack',
            surname: 'Jackson',
            email: 'jack@hotmail.com',
            password: 'samplepass123'
        }
        const sampleTokenData = {
            refreshToken: 'sample refresh token',
            createdAt: new Date()
        }

        let userService = new UserService()
        const tokenService = new TokenService();

        const userInDb = await userService.create(userObj);
        
        const tokens = await tokenService.fetchAll();
        expect(tokens).toHaveLength(0);

        const tokenInDb = await tokenService.createToken({...sampleTokenData, userId: userInDb._id })
        
        expect(tokenInDb).toEqual(expect.objectContaining({
            _id: expect.any(Object),
            refreshToken: expect.any(String),
            userId: expect.any(Object),
            createdAt: expect.any(Date),
        }))
        

    }) 
})

describe('generateTokens()', () => {

    beforeEach( async () => {
        await MongoDBService.clearCollections();
    })

    it('001 - generateTokens() should create access and refresh tokens for given user', async () => {
        expect.assertions(6);
        const userObj: IUser = {
            name: 'Jack',
            surname: 'Jackson',
            email: 'jack@hotmail.com',
            password: 'samplepass123'
        }
        let userService = new UserService()
        const userInDb = await userService.create(userObj);
        
        const tokens = await new TokenService().generateTokens(userInDb._id, userInDb.email);
        
        expect(tokens).toHaveProperty('accessToken');
        expect(tokens).toHaveProperty('refreshToken');
        expect(typeof tokens.accessToken).toBe("string")
        expect(typeof tokens.refreshToken).toBe("string")
        expect(tokens.accessToken.length).toBeGreaterThan(200)
        expect(tokens.refreshToken.length).toBeGreaterThan(200)

    }) 
})


describe.only('deleteTokenRefreshToken()', () => {
    const userObj: IUser = {
        name: 'Jack',
        surname: 'Jackson',
        email: 'jack@hotmail.com',
        password: 'samplepass123'
    }
    const sampleTokenData = {
        refreshToken: 'sample refresh token3t',
        createdAt: new Date()
    }
    let userService: UserService;
    let tokenService: TokenService;
    let userInDb: any;
    let tokenInDb: any;
    beforeEach( async () => {
        await MongoDBService.clearCollections();
        userService = new UserService()
        tokenService = new TokenService();

        userInDb = await userService.create(userObj);
        tokenInDb = await tokenService.createToken({...sampleTokenData, userId: userInDb._id })        
        
    })

    it('001 - deleteTokenByUserId() should delete token in db for given user id', async () => {
        expect.assertions(3);

        const deletedtoken = await tokenService.deleteTokenByUserId(userInDb._id)
        expect(deletedtoken.refreshToken).toBe(tokenInDb.refreshToken);
        expect(deletedtoken.userId).toStrictEqual(tokenInDb.userId);
        
        const tokens = await tokenService.fetchAll();
        expect(tokens).toHaveLength(0);
    })
    
    it('002 - deleteTokenRefreshToken() should delete token in db for given refresh token', async () => {
        const deletedtoken = await tokenService.deleteTokenByRefreshToken(tokenInDb.refreshToken)
        expect(deletedtoken.refreshToken).toBe(tokenInDb.refreshToken);
        expect(deletedtoken.userId).toStrictEqual(tokenInDb.userId);
        
        const tokens = await tokenService.fetchAll();
        expect(tokens).toHaveLength(0);
    })
})

