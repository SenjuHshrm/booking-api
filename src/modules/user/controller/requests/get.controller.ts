import { Request, Response, Router } from 'express'
import passport from 'passport'
import UserService from './../../user.service'

const getUserRoutes: Router = Router()
  .get('/users/:access/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return UserService.getUsersByAccess(res, req.params.access, page, limit)
  })

  // .get('/proprietor-application/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
  .get('/proprietor-application/:page/:limit', (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return UserService.getProprietorApplications(res, page, limit, <string>req.query.isApproved)
  })

  .get('/profile/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.getUserProfile(res, req.params.id)
  })

  .get('/wishlist/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.getWishlistByUser(res, req.params.id)
  })

  .get('/profile-img/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.getUserProfileImg(res, req.params.id)
  })

  .get('/check-in-wishlist/:user/:staycation', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.checkWishList(res, req.params.user, req.params.staycation)
  })

  .get('/user-identification/:page/:limit', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return UserService.getUserIDVerification(res, page, limit, <string>req.query.name)
  })

  .get('/user-verification-status/:id', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.getUserVerificationStatus(res, req.params.id)
  })

export default getUserRoutes