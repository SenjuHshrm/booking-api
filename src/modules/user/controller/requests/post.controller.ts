import { IUserVerificationInput } from './../../user.interface';
import { profileImgStorageMedia, uploadUserVerification } from './../../../../middleware';
import { Request, Response, Router } from 'express';
import UserService from '../../user.service';
import passport from 'passport';
import { uploadDocsAuth, uploadSupportingDocs } from './../../../../middleware';

const postUserRoutes: Router = Router()
  .post('/add', (req: Request, res: Response) => {
    return UserService.register(res, req.body)
  })

  .post('/add/admin', passport.authenticate('jwt', { session: false }), profileImgStorageMedia.single('img'), (req: Request, res: Response) => {
    let user = {
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      password: req.body.password,
      imgFile: `/profile-img/${req.body.email}/${req.file?.originalname}`
    }
    return UserService.addAdmin(res, user)
  })

  .post('/add-to-wishlist', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.addToWishList(res, req.body.user, req.body.staycation)
  })

  /**
   * Accepts form data
   * 
   * fields:
   * 
   * id: userId
   * type: Identification Type
   * idFront: Image File Front ID
   * idBack: Image FIle Back ID
   * idFrontFilename: Filename of Image Front ID
   * idBackFilename: Filename of Image Back ID
   */
  .post('/upload-verification', passport.authenticate('jwt', { session: false }), uploadUserVerification.fields([{ name: 'idFront', maxCount: 1 }, { name: 'idBack', maxCount: 1 }]), (req: Request, res: Response) => {
    let data: IUserVerificationInput = {
      ...req.body,
      idFront: `/user-verification/${req.body.id}/${req.body.idFrontFilename}`,
      idBack: `/user-verification/${req.body.id}/${req.body.idBackFilename}`
    }
    return UserService.uploadVerification(res, data)
  })

  .post('/request-docs/:userId/:staycationId', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.requestSupportingDocs(res, req.params.userId, req.params.staycationId, req.body.date)
  })

  .post('/upload-docs/:id', uploadSupportingDocs.fields([{ name: 'docs' }]), (req: Request, res: Response) => {
    let docsArr = JSON.parse(req.body.documents)
    let docs = {
      staycationId: req.body.staycationId,
      docs: docsArr.map((d: string) => `/docs/${req.params.id}/${d}`)
    }
    return UserService.updatePropApplication(res, req.params.id, docs)
  })

export default postUserRoutes