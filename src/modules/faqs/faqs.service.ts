import { IFAQsSchema, IFAQs, IFAQsInput } from './faqs.interface'
import FAQs from './schema/FAQs.schema'
import { Response } from 'express'
import { logger } from './../../utils';

let addFAQ = async (res: Response, data: IFAQsInput): Promise<Response> => {
  try {
    new FAQs({ ...data }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('faqs.controller', 'addFAQ', e.message, 'FAQ-0001')
    return res.status(500).json({ code: 'FAQ-0001' })
  }
}

let updateFAQ = async (res: Response, id: string, data: IFAQsInput): Promise<Response> => {
  try {
    await FAQs.findByIdAndUpdate(id, { $set: { ...data } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('faqs.controller', 'updateFAQ', e.message, 'FAQ-0002')
    return res.status(500).json({ code: 'FAQ-0002' })
  }
}

let deleteFAQ = async (res: Response, id: string): Promise<Response> => {
  try {
    await FAQs.findByIdAndDelete(id).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('faqs.controller', 'deleteFAQ', e.message, 'FAQ-0003')
    return res.status(500).json({ code: 'FAQ-0003' })
  }
}

let getFAQs = async (res: Response, page: number, limit: number): Promise<Response> => {
  try {
    let total = await FAQs.countDocuments({}).exec()
    let faqs: IFAQsSchema[] = <IFAQsSchema[]>(await FAQs.find({}).populate({ path: 'addedBy', select: '_id name img' }).skip(page).limit(limit).exec())
    return res.status(200).json({ total, faqs })
  } catch(e: any) {
    logger('faqs.controller', 'getFAQs', e.message, 'FAQ-0004')
    return res.status(500).json({ code: 'FAQ-0004' })
  }
}

let getActiveFAQs = async (res: Response): Promise<Response> => {
  try {
    let faqs: IFAQsSchema[] = <IFAQsSchema[]>(await FAQs.find({ isActive: true }).exec())
    return res.status(200).json(faqs)
  } catch(e: any) {
    logger('faqs.controller', 'getActiveFAQs', e.message, 'FAQ-0005')
    return res.status(500).json({ code: 'FAQ-0005' })
  }
}

const FAQsService = {
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQs,
  getActiveFAQs
}

export default FAQsService