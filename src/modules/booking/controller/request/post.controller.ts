import { Router, Request, Response } from "express";
import { IBookingInput } from "modules/booking/booking.interface";
import BookingService from "./../../booking.service";
import { getToken } from "../../../../utils/token-payload";
import { TokenPayload } from "interfaces/token.interface";

const postBookingRoutes: Router = Router()
  .post("/add-booking", (req: Request, res: Response) => {
    return BookingService.addBooking(res, <IBookingInput>req.body);
  })

  .post("/temp-add-booking", (req: Request, res: Response) => {
    return BookingService.tempBooking(
      res,
      req.body.booking,
      req.body.transaction
    );
  })

  .post("/request-cancellation/:booking", (req: Request, res: Response) => {
    return BookingService.requestCancellation(
      res,
      req.params.booking,
      req.body.reason
    );
  })

  .post("/update-cancel-status/:booking", (req: Request, res: Response) => {
    return BookingService.updateCancelRequest(res, req.params.booking);
  })

  /**
   * req.body
   *
   * { name: string, checkInDate: string, checkInTime: string }
   */
  .post("/add-guest/:booking", (req: Request, res: Response) => {
    return BookingService.addGuest(res, req.params.booking, req.body);
  })

  .post("/checkout-guest/:booking", (req: Request, res: Response) => {
    return BookingService.checkOutGuest(
      res,
      req.params.booking,
      req.body.checkOutDate,
      req.body.checkOutTime
    );
  })

  .post("/update-booking-status/:booking", (req: Request, res: Response) => {
    return BookingService.updateBookStatus(
      res,
      req.params.booking,
      req.body.status
    );
  })

  .post(
    "/cancel-booking",
    (req: Request, res: Response) => {
      const token: TokenPayload = getToken(req) as TokenPayload;
      const { bookingId, reason } = req.body;
      return BookingService.guestCancelBooking(
        res,
        token.sub,
        bookingId,
        reason
      );
    }
  );

export default postBookingRoutes;
