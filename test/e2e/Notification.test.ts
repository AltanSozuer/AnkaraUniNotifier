import app from '../../src/app'
import request from 'supertest';
import INotification from '../../src/models/dto/Notification.dto';
import { NotificationService } from '../../src/services/NotificationService';
import MongoDBService from '../../src/services/MongoDBService';
import { isDateAfterThanOther, serializeDateInJSON } from '../../src/utils/ValidateHelpers';
import { FACULTY_DOMAINS } from '../../src/constants/FacultyDomains';
import { describe, afterAll, it, jest, expect, beforeAll, beforeEach} from '@jest/globals'

jest.setTimeout(5000);


beforeAll( async () => {
    await MongoDBService.connectDB();
})

afterAll( async () => {
    await MongoDBService.disconnect();
})

describe('POST /notification', () => {
    let notifService: NotificationService;
    let notifData: INotification[];
    beforeEach( async () => {
        await MongoDBService.clearCollections();

        notifService = new NotificationService();
        notifData = [
            {
                date: new Date("2023-06-05T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title",
                from: FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name,
                notificationContent: "Sample Notification Content",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15492"
            },{
                date: new Date("2023-07-01T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 2",
                from: FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name,
                notificationContent: "Sample Notification Content 1",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15493"
            },
            {
                date: new Date("2024-09-26T16:00:00.100Z"),
                notificationTitle: "Sample Notification Title 3",
                from: FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name,
                notificationContent: "Sample Notification Content 2",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15494"
            },
            {
                date: new Date("2024-09-26T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 4",
                from: FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name,
                notificationContent: "Sample Notification Content 3",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15495"
            }
        ]

        await notifService.createNotifications(notifData);
    })

    it('001 - Should return 200 when there is not filter in request body', async () => {
        expect.assertions(2)
        const res = await request(app)
            .post('/notifications')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => res.data)
        
        expect(res).toHaveLength(4);
        expect(res.map( (_: INotification) => _.guidLink)).toEqual(expect.arrayContaining(notifData.map(not => not.guidLink)))
            
    })

    it('002 - Should return 200 and related data when facultyList is given in request body', async () => {
        expect.assertions(3)
        const res = await request(app)
            .post('/notifications')
            .send({
                facultyList: [FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => res.data)
        
        expect(res).toHaveLength(1);
        expect(res[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);
        expect(res[0].guidLink).toBe("http://comp.eng.ankara.edu.tr/?p=15492")
            
    })

    it('003 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(3)
        const dateString = "2023-06-10T16:00:00.000Z";
        const res = await request(app)
            .post('/notifications')
            .send({
                timeUntil: dateString
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        
        expect(res).toHaveLength(3);
        expect(res.every((_: INotification)=> isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();
        expect(res.map((_: INotification)=> _.from)).toEqual(expect.arrayContaining([FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name]));
    })

    it('004 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(2)
        const dateString = "2025-06-10T16:00:00.000Z";
        const res = await request(app)
            .post('/notifications')
            .send({
                timeUntil: dateString
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        
        expect(res).toHaveLength(0);
        expect(res).toEqual([]);
    })

    it('005 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(3)
        const dateString = "2022-06-10T16:00:00.000Z";
        const sampleFacultyList = [FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name ]
        const res = await request(app)
            .post('/notifications')
            .send({
                facultyList: sampleFacultyList,
                timeUntil: dateString
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        
        expect(res).toHaveLength(2);
        expect(res.map((_: INotification) => _.from)).toEqual(expect.arrayContaining(sampleFacultyList));
        expect(res.every((_: INotification)=> isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();

    })

    it('006 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(3)
        const dateString = "2022-06-10T16:00:00.000Z";
        const sampleFacultyList = [FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name ]
        const res = await request(app)
            .post('/notifications')
            .send({
                facultyList: sampleFacultyList,
                timeUntil: dateString
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        
        expect(res).toHaveLength(3);
        expect([...new Set(res.map((_: INotification) => _.from))]).toEqual(expect.arrayContaining(sampleFacultyList));
        expect(res.every((_: INotification)=> isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();

    })

    it('007 - Should return 200 and exist list of data when facultyList has invalid names and valid names', async () => {
        expect.assertions(3)
        const sampleInvalidName = 'invalidFacultyName';
        const sampleFacultyList = [sampleInvalidName, FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name ]
        const res = await request(app)
            .post('/notifications')
            .send({
                facultyList: sampleFacultyList
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        
        expect(res).toHaveLength(3);
        expect([...new Set(res.map((_: INotification) => _.from))]).toEqual(expect.arrayContaining([FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name]));
        expect(res.every((rs: INotification) => rs.from !== sampleInvalidName )).toBeTruthy()
    })
    it('008 - Should return 200 and exist list of data when facultyList has invalid names, valid names and timeUntil', async () => {
        expect.assertions(4)
        const sampleInvalidName = 'invalidFacultyName';
        const sampleTimeUntil = '2024-09-26T15:00:00.100Z'
        const sampleFacultyList = [sampleInvalidName, FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name ]
        
        const res = await request(app)
            .post('/notifications')
            .send({
                facultyList: sampleFacultyList,
                timeUntil: sampleTimeUntil
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        
        expect(res).toHaveLength(2);
        expect(res.map((_: INotification) => _.from)).toEqual(expect.arrayContaining([FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name]));
        expect(res.every((rs: INotification) => rs.from !== sampleInvalidName )).toBeTruthy();
        expect(res.every((_: INotification)=> isDateAfterThanOther( _.date.toISOString(), sampleTimeUntil))).toBeTruthy();

    })
    it('009 - Should return 400 and empty array when facultyList has only invalid names', async () => {
        expect.assertions(1)
        const sampleFacultyList = [ 'invalidFacultyName' ]
        
        const res = await request(app)
            .post('/notifications')
            .send({
                facultyList: sampleFacultyList,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.error)))
       
        expect(res).toEqual(expect.objectContaining({
            msg: `Given faculty names are not valid.`,
            facultyList: sampleFacultyList
        }))
    })
    it('010 - Should return 400 when given untilDate is invalid (not Date object)', async () => {
        expect.assertions(1)
        const sampleTime = "invalidTime"
        
        const res = await request(app)
            .post('/notifications')
            .send({
                timeUntil: sampleTime,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.error)))
       
        expect(res).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    location: 'body',
                    msg: "Invalid value",
                    path: "timeUntil",
                    type: 'field',
                    value: sampleTime
                })
            ])
        )
    })
    it.todo('011 - Should return 400 when given faculty name list is empty, null, array but its element is not string ( not undefined)')
    it.todo('012 - Should return 400 when given text param is not string')
    it.todo('013 - Should return 200 and related list of data when text is given in request body which has length > 2')
    it.todo('014 - Should return 200 and related list of data when valid facultyList and text are given in request body')
    it.todo('015 - Should return 200 and related list of data when valid facultyList, timeUntil and text are given in request body')
 
})