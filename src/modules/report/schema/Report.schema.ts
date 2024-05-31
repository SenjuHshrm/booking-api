import { Schema, model, Types } from 'mongoose';
import { IReportSchema } from '../report.interface';

let ReportSchema: Schema<IReportSchema> = new Schema<IReportSchema>({
  reporter: { type: Types.ObjectId, ref: 'user' },
  reported: { type: Types.ObjectId, ref: 'user' },
  msg: { type: String, required: true },
  resolved: { type: Boolean, required: true }
})

const Report = model('report', ReportSchema)

export default Report