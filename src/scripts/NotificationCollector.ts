import cron from 'node-cron'
import { GMailService } from '../services/GmailService';
import RssService from '../services/RssService';
import { FACULTY_DOMAINS } from '../constants/FacultyDomains';
import { IMailOptions } from '../models/interfaces/IMailOptions';
import { isDateAfterThanOther } from '../utils/ValidateHelpers';
import { NotificationService } from '../services/NotificationService';
import INotification from '../models/dto/Notification.dto';
import { IRssFeedItem } from '../models/interfaces/IRssFeedItem';
import loggerFunc from '../utils/Logger';
const logger = loggerFunc(__filename)
// const { MAIL_SENDER } = process.env;


export function notificationCollector() {
    const task = cron.schedule("* * * * *", async () => {
        // const gmailService = new GMailService();
        const notifService = new NotificationService();
        const rssService = new RssService();
        Object.values(FACULTY_DOMAINS).forEach( async (facultyObj) => {
            const results = await rssService.parseURL(facultyObj.website);
            logger.debug('Related Faculty details:', {
                facultyObj
            })
            if(results.length > 0) {
                const lastAnnouncementOfRelatedWebsite = await notifService.getLatestNotificationByDate(facultyObj.name);
                logger.debug(`Last announcement of ${facultyObj.name} in db: `,{
                    lastAnnouncementOfRelatedWebsite
                })
                let lastNotifDataList: IRssFeedItem[] = [];
                if(lastAnnouncementOfRelatedWebsite.length){
                    // const lastNotifDataList = results.filter(( notif => new Date(notif.isoDate).getTime() > new Date(lastAnnouncementOfRelatedWebsite[0].date).getTime()))
                    lastNotifDataList = results.filter(( notif => isDateAfterThanOther(notif.isoDate , lastAnnouncementOfRelatedWebsite[0].date.toISOString())))                            
                }
                else { 
                    lastNotifDataList = results;
                }
                logger.debug('New notifications that are not exist in db: ', {
                    lastNotifDataList
                })
                if( !lastAnnouncementOfRelatedWebsite.length || lastNotifDataList.length){
                    logger.info('Raw list of notification data are ready to create..')
                    const rawNotifDataList = lastNotifDataList.map( notif => ({
                        date: new Date(notif.isoDate),
                        from: facultyObj.name,
                        notificationTitle: notif.title,
                        notificationContent: notif['content:encoded'],
                        link: notif.link,
                        guidLink: notif.guid.replace(" ","")
                    })).reverse() as INotification[];
                    const notifsInDb = await notifService.createNotifications(rawNotifDataList);
                    logger.debug('New notifications in db: ', {
                        notifsInDb
                    })
                }

            }
            else{
                console.log('Rss result is empty array. Result: ',results);
                logger.debug('Rss result is empty array. Result: ', {
                    results
                })
            }
        })
        
    }, {
        scheduled: false
    });

    task.start();

}