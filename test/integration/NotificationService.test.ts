import { configureEnvFile } from '../../src/utils/EnvConfig'
configureEnvFile();
import MongoDBService from '../../src/services/MongoDBService';
import { NotificationService } from '../../src/services/NotificationService';
import INotification from '../../src/models/dto/Notification.dto';
import { FACULTY_DOMAINS } from '../../src/constants/FacultyDomains';
import { isDateBeforeThanOther, isDateAfterThanOther } from '../../src/utils/ValidateHelpers'
import { describe, afterAll, it, jest, expect, beforeAll, beforeEach} from '@jest/globals'

jest.setTimeout(3000);


beforeAll( async () => {
    await MongoDBService.connectDB();
})

afterAll( async () => {
    await MongoDBService.disconnect();
})

describe('create()', () => {

    beforeEach( async () => {
        await MongoDBService.clearCollections();
    })

    it('001 - create() should create notification data in db', async () => {
        expect.assertions(3);

        const notifService = new NotificationService();
        const notifData: INotification[] = [
            {
                date: new Date("2023-06-05T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15492"
            },{
                date: new Date("2023-07-01T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 2",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content 1",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15493"
            },
            {
                date: new Date("2024-09-26T16:00:00.100Z"),
                notificationTitle: "Sample Notification Title 3",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content 2",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15494"
            },
        ]

        const result = await notifService.createNotifications(notifData);
        
        expect(result).toHaveLength(3);
        expect(result.map(res => res.date)).toStrictEqual(notifData.map( notif => notif.date))
        expect(result.map(res => res.guidLink)).toStrictEqual(notifData.map( notif => notif.guidLink))

    }) 
})

describe('getLastNotificationByDate()', () => {

    let notifService: NotificationService;
    beforeEach( async () => {
        await MongoDBService.clearCollections();

        notifService = new NotificationService();
        const notifData: INotification[] = [
            {
                date: new Date("2023-06-05T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15492"
            },{
                date: new Date("2023-07-01T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 2",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content 1",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15493"
            },
            {
                date: new Date("2024-09-26T16:00:00.100Z"),
                notificationTitle: "Sample Notification Title 3",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content 2",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15494"
            },
            {
                date: new Date("2024-09-26T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 3",
                from: "Ankara Üniversitesi Bilgisayar Mühendisliği",
                notificationContent: "Sample Notification Content 3",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15495"
            }
        ]

        await notifService.createNotifications(notifData);
    })

    it('001 - getLatestNotificationByDate() should return notification data that has latest date property', async () => {
        expect.assertions(2);

        const result = await notifService.getLatestNotificationByDate();

        expect(result).toHaveLength(1)
        expect(result[0].date).toStrictEqual(new Date('2024-09-26T16:00:00.100Z'))

    }) 
})

describe('getNotifications()', () => {

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

    it('001 - getNotifications() should return all notification data when there is no filter applied', async () => {
        expect.assertions(2);

        const result = await notifService.getNotifications();

        expect(result).toHaveLength(4)
        expect(result.map( res => res.guidLink)).toStrictEqual(notifData.map(not => not.guidLink))

    }) 

    it('002 - getNotifications() should return related notification data that has given "from" param', async () => {
        expect.assertions(3);

        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).getNotifications();

       
        expect(result).toHaveLength(1)
        expect(result[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);
        expect(result[0].guidLink).toBe("http://comp.eng.ankara.edu.tr/?p=15492");
    })

    it.only('002 - getNotifications() should return all exist notification data when empty array is given for byFacultyList', async () => {
        expect.assertions(2);

        const result = await notifService.byFacultyList([]).getNotifications();

        expect(result).toHaveLength(4)
        expect(result.map( res => res.guidLink)).toStrictEqual(notifData.map(not => not.guidLink))
    })
    
    it('003 - getNotifications() should return related notification data that has "date" param that greater than  given "date" param', async () => {
        expect.assertions(3);
        const dateString = "2023-06-06T16:00:00.000Z";
        const result = await notifService.byTime(dateString).getNotifications();

        expect(result).toHaveLength(3);
        expect(result.every(_ => isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();
        expect([...new Set(result.map( _ => _.from))]).toStrictEqual([FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_ORIGINAL.name])
    })

    it('004 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(3);
        const timeString = "2023-01-06T16:00:00.000Z"
        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).byTime(timeString).getNotifications();

        expect(result).toHaveLength(1);
        expect(result[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);
        expect(isDateAfterThanOther(result[0].date.toISOString(),timeString )).toBeTruthy();

    })

    it('005 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(2);

        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).byTime("2023-08-06T16:00:00.000Z").getNotifications();

        expect(result).toHaveLength(0);
        expect(result).toStrictEqual([]);

    })

    it('006 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(3);
        const timeString = "2024-09-23T16:00:00.100Z"
        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_OIDB.name]).byTime(timeString).getNotifications();

        expect(result).toHaveLength(1);
        expect(result[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name);
        expect(isDateAfterThanOther(result[0].date.toISOString(),timeString )).toBeTruthy();

    })
    
    it('007 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(3);
        const sampleFacultyNameList = [FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_ORIGINAL.name];
        const timeString = "2024-09-23T16:00:00.100Z"
        const result = await notifService.byFacultyList(sampleFacultyNameList).byTime(timeString).getNotifications();
 
        expect(result).toHaveLength(2);
        expect(result.map(_ => _.from)).toEqual(expect.arrayContaining(sampleFacultyNameList));
        expect(result.every(_ => isDateAfterThanOther(_.date.toISOString(),timeString ))).toBeTruthy();

    })
})