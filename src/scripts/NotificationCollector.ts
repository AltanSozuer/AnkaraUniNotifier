import cron from 'node-cron'
import { GMailService } from '../services/GmailService';
import RssService from '../services/RssService';
import { FACULTY_DOMAINS } from '../constants/FacultyDomains';
import { IMailOptions } from '../models/interfaces/IMailOptions';
import { NotificationService } from '../services/NotificationService';
import INotification from '../models/dto/Notification.dto';

// const { MAIL_SENDER } = process.env;


export function main() {
    const task = cron.schedule("*/3 * * * *", async () => {
        // const gmailService = new GMailService();
        const notifService = new NotificationService();
        const rssService = new RssService();
        Object.values(FACULTY_DOMAINS).forEach( async (facultyObj) => {
            const results = await rssService.parseURL(facultyObj.website);
            if(results.length > 0) {
                const lastAnnouncement = await notifService.getLatestNotificationByDate();

                const lastNotifDataList = results.filter(( notif => new Date(notif.isoDate).getTime() > new Date(lastAnnouncement[0].date).getTime()))
            
                if(lastNotifDataList.length){
                    const rawNotifDataList = lastNotifDataList.map( notif => ({
                        date: new Date(notif.isoDate),
                        from: facultyObj.name,
                        notificationTitle: notif.title,
                        notificationContent: notif['content:encoded'],
                        link: notif.link,
                        guidLink: notif.guid.replace(" ","")
                    })).reverse() as INotification[];
                    await notifService.createNotifications(rawNotifDataList);

                }

            }
            else{
                console.log('Rss result is empty array. Result: ',results);
                
            }
        })
        
    }, {
        scheduled: false
    });

    task.start();

}