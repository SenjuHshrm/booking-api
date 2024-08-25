import { model, Types, Schema } from 'mongoose';
import { INotificationSchema } from '../notification.interface';

let notificationSchema: Schema<INotificationSchema> = new Schema<INotificationSchema>({
  from: { type: Types.ObjectId, ref: 'user' },
  to: { type: [Types.ObjectId], ref: 'user' },
  type: { type: String, required: true },
  link: String,
  msg: { type: String, required: true },
  isRead: { type: Boolean, required: true, default: false }
}, {
  timestamps: true
})

const Notification = model('notification', notificationSchema)

export default Notification