import { Router, Request, Response } from "express";
import passport from "passport";
import StaycationService from "../../staycation.service";
import { getToken } from "../../../../utils/token-payload";
import validatePaginationParams from "../../../../utils/validate-pagination";

const getStaycationRoutes: Router = Router()
  .get("/list/:page/:limit", (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit);
    let page: number = (parseInt(req.params.page) - 1) * limit;
    let query: {
      isListed: boolean;
      placeType?: string;
      descriptionFilter?: string;
    } = {
      isListed: req.query.listed === "true",
      placeType: <string>req.query.placeType,
      descriptionFilter: <string>req.query.descriptionFilter,
    };
    console.log(req.query.placeType);
    return StaycationService.getListings(res, page, limit, query);
  })

  .get(
    "/host-list/:userId/:page/:limit",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      let limit: number = parseInt(req.params.limit);
      let page: number = (parseInt(req.params.page) - 1) * limit;
      return StaycationService.getHostListing(
        res,
        req.params.userId,
        page,
        limit
      );
    }
  )

  .get("/details/:id", (req: Request, res: Response) => {
    return StaycationService.getDetails(res, req.params.id);
  })

  .get("/gallery/:id", (req: Request, res: Response) => {
    return StaycationService.getGallery(res, req.params.id);
  })

  .get(
    "/recent-search/:id",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      return StaycationService.getRecentSearches(res, req.params.id);
    }
  )

  .get(
    "/all/:page/:limit",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      let limit: number = parseInt(req.params.limit);
      let page: number = (parseInt(req.params.page) - 1) * limit;
      return StaycationService.getAllStaycations(
        res,
        page,
        limit,
        <string>req.query.name
      );
    }
  )

  .get("/average-rating/:staycationId", (req: Request, res: Response) => {
    return StaycationService.averageRatingPerStaycation(
      res,
      req.params.staycationId
    );
  })

  .get(
    "/did-checkout/:staycationId",
    passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
      const authId = <string>getToken(req)?.sub;
      const staycationId = req.params.staycationId;
      return StaycationService.checkDidCheckout(res, authId, staycationId);
    }
  )

  .get("/reviews/:staycationId/:page/:limit", (req: Request, res: Response) => {
    const { limit, offset } = validatePaginationParams(
      req.params.limit,
      req.params.page
    );
    return StaycationService.listReviewsByStaycation(
      res,
      req.params.staycationId,
      offset,
      limit
    );
  });

export default getStaycationRoutes;
