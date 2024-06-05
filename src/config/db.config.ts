import mongoose, { MongooseError } from "mongoose"
import { env } from "./environment.config"
import User from './../modules/user/schema/User.schema';
import { IUserSchema } from './../modules/user/user.interface';
import Auth from './../modules/auth/schema/Auth.schema';
import { IAuthSchema } from './../modules/auth/auth.interface';

export const dbConfig = () => {
  mongoose.connect(env.MONGODB_URI, {
    auth: {
      username: env.MONGODB_USER,
      password: env.MONGODB_PASS
    },
    dbName: env.MONGODB_NAME
  }).then(async () => {
    console.log(`Connected to Database ${env.MONGODB_NAME}`)
    let admin: IAuthSchema | null = <IAuthSchema | null>(await Auth.findOne({ email: env.ADMIN_EMAIL }).exec())
    if(!admin) {
      let u: IUserSchema = new User({
        name: {
          fName: env.ADMIN_FIRSTNAME,
          mName: env.ADMIN_MIDDLENAME,
          lName: env.ADMIN_LASTNAME,
          xName: env.ADMIN_EXTNAME
        },
        img: env.ADMIN_IMG,
        address: env.ADMIN_ADDRESS,
        status: 'active',
        identificationStat: 'approved'
      })
      u.setImg(env.ADMIN_IMG, env.ADMIN_EMAIL)
      u.save().then((user: IUserSchema) => {
        let auth: IAuthSchema = new Auth({
          userId: user.id,
          email: env.ADMIN_EMAIL,
          access: ['admin']
        })
        auth.generateHash(env.ADMIN_PASS)
        auth.save()
      })
    }
  }).catch((e: MongooseError) => {
    console.log('Unable to connect to Database')
    console.error(e)
  })
}