import app from '../../src/app'
import request from 'supertest';
import INotification from '../../src/models/dto/Notification.dto';
import { NotificationService } from '../../src/services/NotificationService';
import MongoDBService from '../../src/services/MongoDBService';
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
    let notifData: INotification[] 
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
            .get('/notification')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => res.body)
            .then(res => res.data)
        
        expect(res).toHaveLength(4);
        expect(res.map( (_: INotification) => _.guidLink)).toStrictEqual(notifData.map(not => not.guidLink))
            
    })
})