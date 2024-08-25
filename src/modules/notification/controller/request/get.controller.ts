import { Request, Response, Router } from 'express';
import NotificationService from './../../../notification/notification.service';

const getNotifRoutes: Router = Router()
  .get('/notifications/:id/:page/:limit', (req: Request, res: Response) => {
    global.io.of('/notification').in('general-notification').fetchSockets()
  })