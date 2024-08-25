import { INotificationInput, INotificationSchema } from './notification.interface';
import Notification from './schema/Notification.schema'
import { logger } from './../../utils'
import { Response } from 'express'

let addNotification = async (data: INotificationInput): Promise<void> => {
  try {
    new Notification({ ...data }).save()
  } catch(e: any) {
    logger('notification', 'addNotification', e.message, 'NTF-0001')
  }
}

let markAsRead = async (res: Response, id: string): Promise<Response> => {
  try {
    await Notification.findByIdAndUpdate(id, { $set: { isRead: true } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('notification.controller', 'markAsRead', e.message, 'NTF-0002')
    return res.status(500).json({ code: 'NTF-0002' })
  }
}

let getNotification = async (res: Response, userId: string, page: number, limit: number): Promise<Response> => {
  try {
    let notifs: INotificationSchema[] = <INotificationSchema[]>(await Notification.find({ to: userId }).populate({ path: 'from', select: '_id name img' }).skip(page).limit(limit).sort({ createdAt: -1 }).exec())
    return res.status(200).json(notifs)
  } catch(e: any) {
    logger('notification.controller', 'getNotification', e.message, 'NTF-0003')
    return res.status(500).json({ code: 'NTF-0003' })
  }
}

let deleteNotification = async (res: Response, id: string): Promise<Response> => {
  try {
    await Notification.findByIdAndDelete(id).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('notification.controller', 'deleteNotification', e.message, 'NTF-0004')
    return res.status(500).json({ code: 'NTF-0004' })
  }
}

const NotificationService = {
  addNotification,
  markAsRead,
  getNotification,
  deleteNotification
}

export default NotificationService