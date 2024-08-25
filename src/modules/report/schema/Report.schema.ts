import { Schema, model, Types } from 'mongoose';
import { IReportSchema } from '../report.interface';

let ReportSchema: Schema<IReportSchema> = new Schema<IReportSchema>({
  reporter: { type: Types.ObjectId, ref: 'user' },
  reported: { type: Types.ObjectId, ref: 'user' },
  msg: { type: String, required: true },
  action: { type: String, enum: { values: ['no-action', 'warning', 'suspend', 'terminate'] } }
}, {
  timestamps: true
})

const Report = model('report', ReportSchema)

export default Report