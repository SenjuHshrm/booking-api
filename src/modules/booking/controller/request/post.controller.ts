import { Router, Request, Response } from 'express'
import { IBookingInput } from 'modules/booking/booking.interface'
import BookingService from './../../booking.service'


const postBookingRoutes: Router = Router()
  .post('/add-booking', (req: Request, res: Response) => {
    return BookingService.addBooking(res, <IBookingInput>req.body)
  })


  .post('/temp-add-booking', (req: Request, res: Response) => {
    return BookingService.tempBooking(res, req.body.booking, req.body.transaction)
  })

export default postBookingRoutes;