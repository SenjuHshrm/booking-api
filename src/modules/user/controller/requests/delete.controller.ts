import { Request, Response, Router } from 'express'
import passport from 'passport'
import UserService from './../../user.service'

const deleteUserRoutes: Router = Router()
  .delete('/remove-to-wishlist/:user/:staycation', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
    return UserService.removeToWishlist(res, req.params.user, req.params.staycation)
  })

export default deleteUserRoutes