import { Response } from 'express';
import Report from './schema/Report.schema'
import { IReportSchema, IReport, IReportInput } from './report.interface'
import { logger } from './../../utils'

let addReport = async (res: Response, rep: IReportInput): Promise<Response<null | { code: string }>> => {
  try {
    await new Report({ ...rep }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('report.controller', 'addReport', e.message, 'REP-0001')
    return res.status(500).json({ code: 'REP-0001' })
  }
}

let getReportList = async (res: Response, page: number, limit: number, name?: string): Promise<Response> => {
  try {
    // let reports: IReportSchema[] = <IReportSchema[]>(await Report.find({}).populate('reporter', { path: "_id name" }).populate('reported', { path: '_id name' }).skip(page).limit(limit).exec())
    // return res.status(200).json(reports)
    let aggregate: any = [
      {
        $lookup: {
          from: 'users',
          localField: 'reporter',
          foreignField: '_id',
          as: 'reporterInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reported',
          foreignField: '_id',
          as: 'reportedInfo'
        }
      }
    ]
    if(name !== undefined) {
      aggregate.push({
        $or: [
          { $match: { 'reportedInfo.name.fName': { $regex: new RegExp(`${name}`), $options: 'imu' } } },
          { $match: { 'reportedInfo.name.lName': { $regex: new RegExp(`${name}`), $options: 'imu' } } }
        ]
      })
    }
    aggregate.push({
      $project: {
        _id: 1,
        'reportedInfo.name.fName': 1,
        'reportedInfo.name.mName': 1,
        'reportedInfo.name.lName': 1,
        'reportedInfo.img': 1,
        'reportedInfo.id': 1,
        'reporterInfo.id': 1,
        'reporterInfo.img': 1,
        'reporterInfo.name.lName': 1,
        'reporter.name.mName': 1,
        'reporterInfo.name.fName': 1,
        createdAt: 1,
        updatedAt: 1,
        action: 1
      }
    }, {
      $facet: {
        paginatedResults: [{ $skip: page }, { $limit: limit }],
        totalCount: [{ $count: 'count' }]
      }
    })
    let reports = await Report.aggregate(aggregate).exec()
    return res.status(200).json(reports)
  } catch(e: any) {
    logger('report.controller', 'getReportList', e.message, 'REP-0002')
    return res.status(500).json({ code: 'REP-0002' })
  }
}

let setReportAction = async (res: Response, id: string, action: 'warning' | 'suspend' | 'terminate'): Promise<Response> => {
  try {
    await Report.findByIdAndUpdate(id, { $set: { action } }).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('report.controller', 'setReportAction', e.message, 'REP-0003')
    return res.status(500).json({ code: 'REP-0003' })
  }
}

const ReportService = {
  addReport,
  getReportList,
  setReportAction
}

export default ReportService