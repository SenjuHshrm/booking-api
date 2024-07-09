import { Response } from "express";
import GlobalStatic from './schema/GlobalStatic.schema'
import { IGlobalStaticSchema } from './global-static.interface'
import { logger } from './../../utils'

let addStatic = async (res: Response, type: string, values: any): Promise<Response<null>> => {
  try {
    let statics: IGlobalStaticSchema = <IGlobalStaticSchema>(await GlobalStatic.findOne({ type }).exec())
    if(!statics) {
      new GlobalStatic({ type, values: [...values] }).save()
    } else {
      values.forEach((i: any) => {
        (<any>statics.values).push(i)
      })
      statics.markModified('values')
      statics.save()
    }
    return res.status(201).json({ success: true })
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

let getStaticByType = async (res: Response, type: string): Promise<Response<any>> => {
  try {
    let statics: IGlobalStaticSchema = <IGlobalStaticSchema>(await GlobalStatic.findOne({ type }).exec())
    if(!statics) {
      let gs: IGlobalStaticSchema = await new GlobalStatic({ type, values: [] }).save()
      return res.status(200).json({ data: gs.values })
    }
    return res.status(200).json({ data: statics.values })
  } catch(e: any) {
    logger('global-static.controller', 'getStaticByType', e.message, 'GST-0005')
    return res.status(500).json({ code: 'GST-0005' })
  }
}

let deleteValueFromStatic = async (res: Response, type: string, val: any): Promise<Response<any>> => {
  try {
    let s: IGlobalStaticSchema = <IGlobalStaticSchema>(await GlobalStatic.findOne({ type }).exec())
    s.values = (<any>s.values).filter((v: any) => JSON.stringify(v) !== JSON.stringify(val))
    s.markModified('values')
    s.save()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('global-static.controller', 'deleteValueFromStatic', e.message, 'GST-0006')
    return res.status(500).json({ code: 'GST-0006' })
  }
}

const GlobalStaticService = {
  addStatic,
  getStatic,
  updateStatic,
  deleteStatic,
  getStaticByType,
  deleteValueFromStatic
}

export default GlobalStaticService