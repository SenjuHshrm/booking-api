import { IFAQsSchema } from './../faqs.interface';
import { model, Schema, Types } from 'mongoose'

let faqsSchema: Schema<IFAQsSchema> = new Schema<IFAQsSchema>({
  addedBy: { type: Types.ObjectId, ref: 'user' },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isActive: { type: Boolean, default: false }
})

const FAQs = model('faq', faqsSchema)

export default FAQs