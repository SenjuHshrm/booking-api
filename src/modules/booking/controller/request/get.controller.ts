import { Request, Response, Router } from "express";
import BookingService from "../../booking.service";
import passport from "passport";
import { getToken } from "../../../../utils/token-payload";
import validatePaginationParams from "../../../../utils/validate-pagination";

const getBookingRoutes: Router = Router()
  .get(
    "/list/:id/:page/:limit/:type",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      const { limit, offset } = validatePaginationParams(
        req.params.limit,
        req.params.page
      );

      return BookingService.getBookingByType(
        res,
        req.params.type,
        limit,
        offset,
        <string>req.query?.search,
        req.params.id
      );
    }
  )

  .get(
    "/trips",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      const type = (req.query.type as string) || "upcoming";
      const { limit, offset } = validatePaginationParams(
        req.query?.limit as string | null,
        req.query?.page as string | null
      );
      const authId = getToken(req)?.sub as string;
      return BookingService.listBookingByGuestId(
        res,
        type,
        limit,
        offset,
        <string>req.query?.search,
        authId
      );
    }
  )

  .get(
    "/guest-list/:bookingId",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      return BookingService.listGuestFromBooking(res, req.params.bookingId);
    }
  )

  .get(
    "/cancelled/:id/:page/:limit",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      const { limit, offset } = validatePaginationParams(
        req.params.limit,
        req.params.page
      );

      return BookingService.getCancelledRequest(
        res,
        limit,
        offset,
        <string>req.query?.search,
        req.params.id
      );
    }
  );

export default getBookingRoutes;
