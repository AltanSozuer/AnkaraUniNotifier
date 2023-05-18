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

describe('GET /notification', () => {
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
                from: FACULTY_DOMAINS.ANKARA_UNI_ORIGINAL.name,
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
            .get('/notifications')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => res.data)
        
        expect(res).toHaveLength(4);
        expect(res.map( (_: INotification) => _.guidLink)).toStrictEqual(notifData.map(not => not.guidLink))
            
    })

    it('002 - Should return 200 and related data when facultyList is given in request body', async () => {
        expect.assertions(3)
        const res = await request(app)
            .get('/notifications')
            .send({
                facultyList: [FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => res.data)
        console.log('002 result: ',res);
        
        expect(res).toHaveLength(1);
        expect(res[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);
        expect(res[0].guidLink).toBe("http://comp.eng.ankara.edu.tr/?p=15492")
            
    })

    it.only('003 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(3)
        const dateString = "2023-06-10T16:00:00.000Z";
        const res = await request(app)
            .get('/notifications')
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
        expect(res.map((_: INotification)=> _.from)).toEqual(expect.arrayContaining([FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_ORIGINAL.name]));
    })

    it.only('004 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(2)
        const dateString = "2025-06-10T16:00:00.000Z";
        const res = await request(app)
            .get('/notifications')
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

    it.only('005 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(3)
        const dateString = "2022-06-10T16:00:00.000Z";
        const sampleFacultyList = [FACULTY_DOMAINS.ANKARA_UNI_ORIGINAL.name, FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name ]
        const res = await request(app)
            .get('/notifications')
            .send({
                facultyList: sampleFacultyList,
                timeUntil: dateString
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        console.log('005 - result: ',res);
        
        expect(res).toHaveLength(2);
        expect(res.map((_: INotification) => _.from)).toEqual(expect.arrayContaining(sampleFacultyList));
        expect(res.every((_: INotification)=> isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();

    })

    it.only('006 - Should return 200 and related list of data when timeUntil is given in request body', async () => {
        expect.assertions(3)
        const dateString = "2022-06-10T16:00:00.000Z";
        const sampleFacultyList = [FACULTY_DOMAINS.ANKARA_UNI_ORIGINAL.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name ]
        const res = await request(app)
            .get('/notifications')
            .send({
                facultyList: sampleFacultyList,
                timeUntil: dateString
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => JSON.parse(JSON.stringify(res.data), serializeDateInJSON))
        console.log('006 - result: ',res);
        
        expect(res).toHaveLength(3);
        expect([...new Set(res.map((_: INotification) => _.from))]).toEqual(expect.arrayContaining(sampleFacultyList));
        expect(res.every((_: INotification)=> isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();

    })
})