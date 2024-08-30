import { Schema, Types, model } from 'mongoose'
import { INotificationCountSchema } from '../notification.interface'

let notifCount: Schema<INotificationCountSchema> = new Schema<INotificationCountSchema>({
  user: { type: Types.ObjectId, ref: 'user' },
  notif: { type: Number, default: 0 },
  msg: { type: Number, default: 0 }
})

const NotificationCount = model('notif-count', notifCount)

export default NotificationCount