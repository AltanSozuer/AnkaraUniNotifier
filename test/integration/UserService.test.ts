import { configureEnvFile } from '../../src/utils/EnvConfig'
configureEnvFile();

import IUser from '../../src/models/dto/User.dto';
import UserService from '../../src/services/UserService';
import MongoDBService from '../../src/services/MongoDBService';
import { describe, afterAll, it, jest, expect, beforeAll, beforeEach} from '@jest/globals'


jest.setTimeout(5000);

beforeAll( async () => {
    await MongoDBService.connectDB();
})

afterAll( async () => {
    await MongoDBService.disconnect()
})

describe('create()',  () => {
    beforeEach( async () => {
        await MongoDBService.clearCollections();
    })

    it('create() function should create user in db', async () => {
        expect.assertions(4)
        const userObj: IUser = {
            name: 'Jack',
            surname: 'Jackson',
            email: 'jack@hotmail.com',
            password: 'samplepass123'
        }
        let userService = new UserService()
        const result = await userService.create(userObj);
       
        expect(result?.name).toBe(userObj.name);
        expect(result?.surname).toBe(userObj.surname);
        expect(result?.email).toBe(userObj.email);
        expect(result).toHaveProperty('_id')

    })
})

describe('fetchOne()',  () => {
    let userService: UserService;
    beforeEach( async () => {
        userService = new UserService();
        await MongoDBService.clearCollections();
    })

    it('fetchOne() function should return null when db is empty', async () => {
        expect.assertions(1)
        const sampleEmail = 'jack@hotmail.com'
        const users = await userService.fetchOneWithoutPassword(sampleEmail)
        expect(users).toBeNull();
    })

    it('fetchOne() function should return user who has given email', async () => {
        expect.assertions(3);
        
        const userObj: IUser = {
            name: 'Jack',
            surname: 'Jackson',
            email: 'jack@hotmail.com',
            password: 'jack123'
        }
        await userService.create(userObj);
        const userInDb = await userService.fetchOneWithoutPassword(userObj.email);

        expect(userInDb?.name).toBe(userObj.name);
        expect(userInDb?.surname).toBe(userObj.surname);
        expect(userInDb?.email).toBe(userObj.email);
    })

    

})

describe('update()',  () => {
    
    let userService: UserService;
    beforeEach( async () => {
        userService = new UserService();
        await MongoDBService.clearCollections();
    })

    it('update() function should update related user information who has given email', async () => {
        expect.assertions(4)
        const userObj: IUser = {
            name: 'Jack',
            surname: 'Jackson',
            email: 'jack@hotmail.com',
            password: 'jack123'
        }
        const result = await userService.create(userObj);
        
        const newUserObj = {
            name: 'NewJack',
            surname: 'NewJackson',
            email: 'jack@hotmail.com',
            password: 'newjack321'
        }

        const newUserInDb = await userService.update( userObj.email, newUserObj);
        
        expect(newUserInDb.name).toBe(newUserObj.name);
        expect(newUserInDb.surname).toBe(newUserObj.surname);
        expect(newUserInDb.email).toBe(newUserObj.email);
        expect(newUserInDb.email).toBe(result.email);
    })

    it('update() function should return null when given email address is not exist in db', async () => {
        expect.assertions(1);
        const newUserObj = {
            name: 'NewJack',
            surname: 'NewJackson',
            email: 'jack@hotmail.com',
            password: 'jack123'
        }

        const newUserInDb = await userService.update( newUserObj.email, newUserObj);
        expect(newUserInDb).toBeNull();        
    })
})

describe.only('delete()',  () => {
    
    let userService: UserService;
    beforeEach( async () => {
        userService = new UserService();
        await MongoDBService.clearCollections();
    })

    it('delete() function should delete related user information who has given email', async () => {
        expect.assertions(4)
        const userObj: IUser = {
            name: 'Jack',
            surname: 'Jackson',
            email: 'jack@hotmail.com',
            password: 'jack123'
        }
        await userService.create(userObj);

        const deletedUserInDb = await userService.delete( userObj.email);
        
        expect(deletedUserInDb.name).toBe(userObj.name);
        expect(deletedUserInDb.surname).toBe(userObj.surname);
        expect(deletedUserInDb.email).toBe(userObj.email);

        const afterDelete = await userService.fetchOneWithoutPassword(userObj.email)
        expect(afterDelete).toBeNull();
    })

    it('delete() function should return null when given email address is not exist in db', async () => {
        expect.assertions(1);
        const userObj = {
            name: 'NewJack',
            surname: 'NewJackson',
            email: 'jack@hotmail.com'
        }

        const deletedUser = await userService.delete( userObj.email);
        expect(deletedUser).toBeNull();        
    })
})