import { profileImgStorageMedia } from "./../../../../middleware";
import { Request, Response, Router } from "express";
import UserService from "../../user.service";

const putUserRoutes: Router = Router()
  .put("/set-as-host/:propAppId", (req: Request, res: Response) => {
    return UserService.setAsProprietor(
      res,
      req.body.userId,
      req.body.staycationId,
      req.params.propAppId
    );
  })

  .put(
    "/update-profile/:id",
    profileImgStorageMedia.single("img"),
    (req: Request, res: Response) => {
      let { body } = req;
      let data = {
        name: {
          fName: body.fName,
          mName: body.mName,
          lName: body.lName,
          xName: body.xName,
        },
        contact: body.contact,
        desc: {
          description: body.desc,
          hobbies: body.hobbies,
          work: body.work,
          favFood: body.favFood,
          favPlace: body.favPlace,
        },
        img: req.file
          ? `/profile-img/${body.email}/${req.file?.originalname}`
          : req.body.img,
      };
      return UserService.updateUserProfile(res, data, req.params.id);
    }
  )

  .put("/verification/update-profile/:id", (req: Request, res: Response) => {
    return UserService.verificationUpdateProfile(res, req.body, req.params.id);
  })

  .put('/update-user-verification/:id', (req: Request, res: Response) => {
    return UserService.setUserVerificationStatus(res, req.params.id, req.body.status)
  })

export default putUserRoutes;
