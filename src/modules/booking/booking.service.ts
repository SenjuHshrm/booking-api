import { Response } from 'express'
import Booking from './schema/Booking.schema'
import { IBookingSchema, IBookingInput, IBookingPayment } from './booking.interface'
import { logger } from './../../utils/logger.util';
import Transaction from './../payment/schema/Transaction.schema';

let addBooking = async (res: Response, data: IBookingInput): Promise<Response> => {
  try {
    new Booking({ ...data }).save()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'addBooking', e.message, 'BKNG-0001')
    return res.status(500).json({ code: 'BKNG-0001' })
  }
}

let addPaymentToBooking = async (res: Response, id: string, data: IBookingPayment): Promise<Response> => {
  try {
    await Booking.findByIdAndUpdate(id, { $push: { payment: { ...data } } }).exec()
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'addPaymentToBooking', e.message, 'BKNG-0002')
    return res.status(500).json({ code: 'BKNG-0002' })
  }
}

let listBookingByGuestId = async (res: Response, id: string): Promise<Response> => {
  try {
    let total = await Booking.countDocuments({ initiatedBy: id }).exec()
    let bookings: IBookingSchema[] = <IBookingSchema[]>(await Booking.find({ initiatedBy: id }).populate({ path: 'bookTo', select: '_id name media.cover' }).exec())
    return res.status(200).json({ total, bookings })
  } catch(e: any) {
    logger('booking.controller', 'listBookingByGuestId', e.message, 'BKNG-0003')
    return res.status(500).json({ code: 'BKNG-0003' })
  }
}

let listAllBookingsByHost = async (res: Response, id: string): Promise<Response> => {
  try {
    let total = await Booking.countDocuments({ bookTo: id }).exec()
    let bookings: IBookingSchema[] = <IBookingSchema[]>(await Booking.find({ bookTo: id }).populate({ path: 'initiatedBy', select: '_id name img' }).exec())
    return res.status(200).json({ total, bookings })
  } catch(e: any) {
    logger('booking.controller', 'listAllBookingsByHost', e.message, 'BKNG-0004')
    return res.status(500).json({ code: 'BKNG-0004' })
  }
}

let removeBooking = async (res: Response, id: string): Promise<Response> => {
  try {
    await Booking.findByIdAndDelete(id).exec()
    return res.status(200).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'removeBooking', e.message, 'BKNG-0005')
    return res.status(500).json({ code: 'BKNG-0005' })
  }
}

let getBookingDetails = async (res: Response, id: string): Promise<Response> => {
  try {
    let booking: IBookingSchema = <IBookingSchema>(await Booking.findById(id).populate([{ path: 'initiatedBy', select: '_id name img' }, { path: 'bookTo', select: '_id name media.cover' }]).exec())
    return res.status(200).json(booking)
  } catch(e: any) {
    logger('booking.controller', 'getBookingDetails', e.message, 'BKNG-0006')
    return res.status(500).json({ code: 'BKNG-0006' })
  }
}

let tempBooking = async (res: Response, data: IBookingInput, trn: any): Promise<Response> => {
  try {
    let newTrn = await new Transaction({ ...trn }).save()
    new Booking({ ...data, transaction: newTrn.id })
    return res.status(201).json({ success: true })
  } catch(e: any) {
    logger('booking.controller', 'tempBooking', e.message, 'BKNG-0007')
    return res.status(500).json({ code: 'BKNG-0007' })
  }
}

const BookingService = {
  addBooking,
  addPaymentToBooking,
  listBookingByGuestId,
  listAllBookingsByHost,
  removeBooking,
  getBookingDetails,
  tempBooking
}

export default BookingService