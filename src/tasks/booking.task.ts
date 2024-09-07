import { IUserPrev } from './../modules/user/user.interface';
import { scheduleJob } from "node-schedule";
import moment from 'moment'
import Staycation from './../modules/staycation/schema/Staycation.schema'
import Booking from './../modules/booking/schema/Booking.schema'
import { IBookingSchema } from './../modules/booking/booking.interface';
import { IStaycationSchema } from './../modules/staycation/staycation.interface';
import NotificationService from "./../modules/notification/notification.service";
import { Types } from 'mongoose';
import { redisClient } from './../config';

/**
 * cron (0-59?, 0-59, 0-23, 1-31, 1-12, 0-7 (0/7=Sun))
 */

export function checkBookingArrivals() {
  scheduleJob('1 2 0 * * *', async () => {
    let currentDate = moment().format('MM/DD/YYYY')
    // let staycations: IStaycationSchema[] = <IStaycationSchema[]>(await Staycation.find({}).exec())
    // staycations.forEach(async (staycation: IStaycationSchema) => {
    //   // await Booking.updateMany({ bookTo: staycation._id, 'duration.start': currentDate }, { $set: { status: 'arriving' } }).exec()
    //   let booking: IBookingSchema[] = <IBookingSchema[]>(await Booking.find({ bookTo: staycation.id, 'duration.start': currentDate }).populate({ path: 'initiatedBy', select: '_id name' }).exec())
    //   booking.forEach((book: IBookingSchema) => {
    //     book.status = 'arriving'
    //     book.save()
        
    //   })
    // })
    let bookings: IBookingSchema[] = <IBookingSchema[]>(await Booking.find({ 'duration.start': currentDate, status: 'upcoming' }).populate([{ path: 'initiatedBy', select: '_id name' }, { path: 'bookTo', select: '_id host name' }]).exec())
    bookings.forEach(async (booking: IBookingSchema) => {
      booking.status = 'arriving'
      booking.save()
      let from = (<IUserPrev>booking.initiatedBy)._id,
          to = (<{ _id: typeof Types.ObjectId, host: typeof Types.ObjectId }>booking.bookTo).host.toString();
      let notif = await NotificationService.addNotification({
        from,
        to: [to],
        type: 'booking',
        link: '',
        msg: `Your guest ${(<IUserPrev>booking.initiatedBy).name.fName} will arrive today.`,
        isRead: false
      })
      let ln = await redisClient.lLen(to)
      let socketId = await redisClient.lRange(to, 0, ln)
      NotificationService.incrementNotifCount(to, 'notif')
      global.io.sockets.to(socketId).emit('main:notif-count', { count: 1 })
      global.io.of('/notification').to(`notif:${to}`).emit('notif:unshift', notif)
    })
  })
}