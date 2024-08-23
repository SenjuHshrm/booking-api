import { Router, Request, Response } from 'express'
import MessageService from './../../message.service'

const getMessageRoutes: Router = Router()
  .get('/rooms/:id', (req: Request, res: Response) => {
    return MessageService.getMessageRooms(res, req.params.id)
  })

  .get('/message-thread/:roomId/:page/:limit', (req: Request, res: Response) => {
    let limit: number = parseInt(req.params.limit)
    let page: number = (parseInt(req.params.page) - 1) * limit
    return MessageService.getMessageThread(res, req.params.roomId, page, limit)
  })

export default getMessageRoutes