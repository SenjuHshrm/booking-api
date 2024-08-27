import { Response } from 'express'
import { logger } from './../../utils'
import Auth from './../auth/schema/Auth.schema'
import Staycation from './../staycation/schema/Staycation.schema'

let getAllUserCounts = async (res: Response): Promise<Response> => {
  try {
    let all = await Auth.countDocuments({ role: { $ne: 'admin' } }).exec()
    let prop = await Auth.countDocuments({ role: 'host' }).exec()
    let guest = await Auth.countDocuments({ role: { $and: [{ $eq: 'customer' }, { $ne: 'host' }] } }).exec()
    let listing = await Staycation.countDocuments({ isListed: true }).exec()
    return res.status(200).json({ all, prop, guest, listing })
  } catch(e: any) {
    logger('dashboard.controller', 'getAllUserCounts', e.message, 'DSB-0001')
    return res.status(500).json({ code: 'DSB-0001' })
  }
}

const DashboardService = {
  getAllUserCounts
}

export default DashboardService