import { configureEnvFile } from '../../src/utils/EnvConfig'
configureEnvFile();
import MongoDBService from '../../src/services/MongoDBService';
import { NotificationService } from '../../src/services/NotificationService';
import INotification from '../../src/models/dto/Notification.dto';
import { FACULTY_DOMAINS, facultyNameList } from '../../src/constants/FacultyDomains';
import { isDateAfterThanOther } from '../../src/utils/ValidateHelpers'
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

        const result = await notifService.getLatestNotificationByDate(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);

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
                notificationTitle: "Sample Notification Title 1",
                from: FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name,
                notificationContent: "Sample Notification Content 1",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15492"
            },{
                date: new Date("2023-07-01T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 2",
                from: FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name,
                notificationContent: "Sample Notification Content 2",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15493"
            },
            {
                date: new Date("2024-09-26T16:00:00.100Z"),
                notificationTitle: "Sample Notification Title 3",
                from: FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name,
                notificationContent: "Sample Notification Content 3",
                link: "http://comp.eng.ankara.edu.tr/2023/04/12/fen-bilimleri-enstitusu-2022-yili-doktora-performans-odulleri/",
                guidLink: "http://comp.eng.ankara.edu.tr/?p=15494"
            },
            {
                date: new Date("2024-09-26T16:00:00.000Z"),
                notificationTitle: "Sample Notification Title 4",
                from: FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name,
                notificationContent: "Sample Notification Content 4",
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
        expect(result.map( res => res.guidLink)).toEqual(expect.arrayContaining(notifData.map(not => not.guidLink)))

    }) 

    it('002 - getNotifications() should return related notification data that has given "from" param', async () => {
        expect.assertions(3);

        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).getNotifications();

       
        expect(result).toHaveLength(1)
        expect(result[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);
        expect(result[0].guidLink).toBe("http://comp.eng.ankara.edu.tr/?p=15492");
    })

    it('003 - getNotifications() should return all exist notification data when empty array is given for byFacultyList', async () => {
        expect.assertions(2);

        const result = await notifService.byFacultyList([]).getNotifications();

        expect(result).toHaveLength(4)
        expect(result.map( res => res.guidLink)).toEqual(expect.arrayContaining(notifData.map(not => not.guidLink)))
    })
    
    it('004 - getNotifications() should return related notification data that has "date" param that greater than  given "date" param', async () => {
        expect.assertions(3);
        const dateString = "2023-06-06T16:00:00.000Z";
        const sampleFacultyNameList = [FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name]
        const result = await notifService.byTime(dateString).getNotifications();

        expect(result).toHaveLength(3);
        expect(result.every(_ => isDateAfterThanOther( _.date.toISOString(), dateString))).toBeTruthy();
        expect([...new Set(result.map( _ => _.from))]).toEqual(expect.arrayContaining(sampleFacultyNameList))
    })

    it('005 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(3);
        const timeString = "2023-01-06T16:00:00.000Z"
        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).byTime(timeString).getNotifications();

        expect(result).toHaveLength(1);
        expect(result[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name);
        expect(isDateAfterThanOther(result[0].date.toISOString(),timeString )).toBeTruthy();

    })

    it('006 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(2);

        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).byTime("2023-08-06T16:00:00.000Z").getNotifications();

        expect(result).toHaveLength(0);
        expect(result).toStrictEqual([]);

    })

    it('007 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(3);
        const timeString = "2024-09-23T16:00:00.100Z"
        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_OIDB.name]).byTime(timeString).getNotifications();

        expect(result).toHaveLength(1);
        expect(result[0].from).toBe(FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name);
        expect(isDateAfterThanOther(result[0].date.toISOString(),timeString )).toBeTruthy();

    })
    
    it('008 - getNotifications() should return related notification data that has given "from" and "date" params', async () => {
        expect.assertions(3);
        const sampleFacultyNameList = [FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name];
        const timeString = "2024-09-23T16:00:00.100Z"
        const result = await notifService.byFacultyList(sampleFacultyNameList).byTime(timeString).getNotifications();
 
        expect(result).toHaveLength(2);
        expect(result.map(_ => _.from)).toEqual(expect.arrayContaining(sampleFacultyNameList));
        expect(result.every(_ => isDateAfterThanOther(_.date.toISOString(),timeString ))).toBeTruthy();

    })

    it('009 - getNotifications() should return related notification data that has given "text" params', async () => {
        expect.assertions(4);
        const sampleTextForSearch = 'Title 2'
        const result = await notifService.byText(sampleTextForSearch).getNotifications();
        
        expect(result).toHaveLength(1);
        expect(notifData.filter(ntf => ntf.notificationTitle.search(sampleTextForSearch) >= 0 )).toHaveLength(1);
        expect(notifData.filter(ntf => ntf.notificationTitle.search(sampleTextForSearch) < 0 )).toHaveLength(3);
        expect(result[0].guidLink).toBe("http://comp.eng.ankara.edu.tr/?p=15493");
    })

    it('010 - getNotifications() should return empty array when titles of given faculty names do not have given "text" param', async () => {
        expect.assertions(2);
        const sampleTextForSearch = 'Title 2'
        const result = await notifService.byFacultyList([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name]).byText(sampleTextForSearch).getNotifications();
        
        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
    })

    it('011 - getNotifications() should return related notification data when titles of given faculty names have given "text" param', async () => {
        expect.assertions(4);
        const sampleTextForSearch = 'Title 1'
        const sampleFacultyNameList = [FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name, FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name];
        const result = await notifService.byText(sampleTextForSearch).byFacultyList(sampleFacultyNameList).getNotifications();
        
        expect(result).toHaveLength(1);
        expect(notifData.filter(ntf => ntf.notificationTitle.search(sampleTextForSearch) >= 0 )).toHaveLength(1);
        expect(notifData.filter(ntf => ntf.notificationTitle.search(sampleTextForSearch) < 0 )).toHaveLength(3);
        expect(result[0].guidLink).toBe("http://comp.eng.ankara.edu.tr/?p=15492");
    })

    it('012 - getNotifications() should return related notification data when titles of given faculty names have given "text" param', async () => {
        expect.assertions(3)
        const sampleTextForSearch = 'Notification Title';
        const sampleFacultyNameList = facultyNameList;
        const result = await notifService.byText(sampleTextForSearch).byFacultyList(sampleFacultyNameList).getNotifications();
        
        expect(result).toHaveLength(4);
        expect(notifData.filter(ntf => ntf.notificationTitle.search(sampleTextForSearch) >= 0 )).toHaveLength(4);
        expect([...new Set(result.map(ntf => ntf.from))]).toEqual(expect.arrayContaining([FACULTY_DOMAINS.ANKARA_UNI_BILGISAYAR.name, FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name]));
    })

    it('013 - getNotifications() should return related notification data when titles of given faculty names have given "text" param and "time" param that is in intended time period', async () => {
        expect.assertions(4);
        const sampleTextForSearch = 'Notification Title'
        const sampleFacultyNameList = facultyNameList;
        const sampleTime = '2023-07-01T16:10:00.000Z'

        const result = await notifService.byText(sampleTextForSearch).byFacultyList(sampleFacultyNameList).byTime(sampleTime).getNotifications();
        
        expect(result).toHaveLength(2);
        expect(notifData.filter(ntf => ntf.notificationTitle.search(sampleTextForSearch) >= 0 )).toHaveLength(4);
        expect([...new Set(result.map(ntf => ntf.from))]).toEqual(expect.arrayContaining([FACULTY_DOMAINS.ANKARA_UNI_ELEKTRIK_ELEKTRONIK.name, FACULTY_DOMAINS.ANKARA_UNI_OGR_DEKANLIK.name]));
        expect(result.every(ntf => isDateAfterThanOther(ntf.date.toISOString(),sampleTime))).toBeTruthy();
    })

})