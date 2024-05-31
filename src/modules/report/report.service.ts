import { Response } from 'express';
import Report from './schema/Report.schema'
import { IReportSchema, IReport, IReportInput } from './report.interface'
import { logger } from './../../utils'

let addReport = async (res: Response, rep: IReportInput): Promise<Response<null | { code: string }>> => {
  try {
    await new Report({ ...rep }).save()
    return res.sendStatus(201)
  } catch(e: any) {
    logger('report.controller', 'addReport', e.message, 'REP-0001')
    return res.status(500).json({ code: 'REP-0001' })
  }
}

let getReportList = async (res: Response, page: number, limit: number): Promise<Response<IReport[] | { code: string }>> => {
  try {
    let reports: IReportSchema[] = <IReportSchema[]>(await Report.find({}).populate('reporter', { path: "_id name" }).populate('reported', { path: '_id name' }).skip(page).limit(limit).exec())
    return res.status(200).json(reports)
  } catch(e: any) {
    logger('report.controller', 'getReportList', e.message, 'REP-0002')
    return res.status(500).json({ code: 'REP-0002' })
  }
}

let getReportCount = async (res: Response): Promise<Response<{ count: number } | { code: string }>> => {
  try {
    let count: number = <number>(await Report.countDocuments().exec())
    return res.status(200).json({ count })
  } catch(e: any) {
    logger('report.controller', 'getReportCount', e.message, 'REP-0003')
    return res.status(500).json({ code: 'REP-0003' })
  }
}

const ReportService = {
  addReport,
  getReportList,
  getReportCount
}

export default ReportService