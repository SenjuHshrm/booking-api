import { Request, Response, Router } from 'express'
import MessageService from './../../message.service'

const postMessageRoutes: Router = Router()
  .post('/send-msg/:receiverId', (req: Request, res: Response) => {
    return MessageService.saveMsgAndCreateRoom(res, req.params.receiverId, req.body)
  })

export default postMessageRoutes