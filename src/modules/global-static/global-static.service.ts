import { Response } from "express";
import GlobalStatic from './schema/GlobalStatic.schema'
import { IGlobalStaticSchema } from './global-static.interface'
import { logger } from './../../utils'

let addStatic = async (res: Response, type: string, values: any): Promise<Response<null>> => {
  try {
    new GlobalStatic({ type, values }).save()
    return res.sendStatus(201)
  } catch(e: any) {
    logger('global-static.controller', 'addStatic', e.message, 'GST-0001')
    return res.status(500).json({ code: 'GST-0001' })
  }
}

let getStatic = async (res: Response, id: string): Promise<Response<any>> => {
  try {
    let statics: IGlobalStaticSchema = <IGlobalStaticSchema>(await GlobalStatic.findById(id).exec())
    return res.status(200).json({ data: statics.values })
  } catch(e: any) {
    logger('global-static.controller', 'getStatic', e.messsage, 'GST-0002')
    return res.status(500).json({ code: 'GST-0002' })
  }
}

let updateStatic = async (res: Response, id: string, values: any): Promise<Response<null>> => {
  try {
    await GlobalStatic.findByIdAndUpdate(id, { $set: { values } }).exec()
    return res.sendStatus(200)
  } catch(e: any) {
    logger('global-static.controller', 'updateStatic', e.message, 'GST-0003')
    return res.status(500).json({ code: 'GST-0003' })
  }
}

let deleteStatic = async (res: Response, id: string): Promise<Response<null>> => {
  try {
    await GlobalStatic.findByIdAndDelete(id).exec()
    return res.sendStatus(200)
  } catch(e: any) {
    logger('global-static.controller', 'deleteStatic', e.message, 'GST-0004')
    return res.status(500).json({ code: 'GST-0004' })
  }
}

const GlobalStaticService = {
  addStatic,
  getStatic,
  updateStatic,
  deleteStatic
}

export default GlobalStaticService