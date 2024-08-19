import { logger } from './../utils'
import { env } from './environment.config'
import { model, Schema } from 'mongoose'

const authBasic = `Basic ${Buffer.from(env.PAYMONGO_SK + ':').toString('base64')}`
const baseURL = `${env.PAYMONGO_URL}/${env.PAYMONGO_URL_VER}`
const webhookURL = `${env.HOST}/api/payment/post/payment-process`

const webhookSchema = new Schema({
  webhookId: String,
  webhookSecret: String,
  active: Boolean,
  url: String
})

const Webhook = model('webhook', webhookSchema)

export default Webhook

// ======================================================== //

const createWebhook = async (url: string) => {
  try {
    let opt = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: authBasic
      },
      body: JSON.stringify({
        data: {
          attributes: {
            url,
            events: [
              'payment.paid',
              'payment.failed',
              'payment.refunded',
              'payment.refund.updated'
            ]
          }
        }
      })
    }
    let req = await fetch(`${baseURL}/webhooks`, opt)
    let res = await req.json()
    await new Webhook({ webhookId: res.data.id, webhookSecret: res.data.attributes.secret_key, active: res.data.attributes.status === 'enabled', url }).save()
  } catch(e: any) {
    logger('createWebhook', 'config', e.message, 'CFG-WBHK-0001')
  }
}

const getWebhook = async (webhookId: string) => {
  try {
    let opt = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: authBasic
      }
    }
    let req = await fetch(`${baseURL}/webhooks/${webhookId}`, opt)
    let res = await req.json()
    return res.data
  } catch(e: any) {
    logger('getWebhook', 'config', e.message, 'CFG-WBHK-0002')
  }
}

const updateWebhook = async (webhookId: string, url: string, events: string[]) => {
  try {
    let opt = {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: authBasic
      },
      body: JSON.stringify({
        data: {
          attributes: {
            url,
            events
          }
        }
      })
    }
    let req = await fetch(`${baseURL}/webhooks/${webhookId}`, opt)
    let res = await req.json()
    await Webhook.findOneAndUpdate({ webhookId }, { $set: { url } }).exec()
  } catch(e: any) {
    logger('updateWebhook', 'config', e.message, 'CFG-WBHK-0003')
  }
}

export const webhook = async () => {
  try {
    // let url = `${env.HOST}/api/payment/post/payment-process`
    let wh = await Webhook.findOne({ active: true }).exec()
    if(!wh) {
      createWebhook(webhookURL)
      return;
    }
    let data = await getWebhook(<string>wh.webhookId)
    if(data.attributes.url !== webhookURL) {
      updateWebhook(<string>wh.webhookId, webhookURL, data.attributes.events)
    }
  } catch (e: any) {
    logger('webhook', 'config', e.message, 'CFG-WBHK-0004')
  }
}