import { writeFileSync, existsSync, appendFileSync } from "fs";
import moment from 'moment';
import { resolve } from 'path'

let logFolder = resolve(__dirname, '../logs')
let logfile: string = `${logFolder}/${moment(new Date()).format('MM-DD-YYYY')}.txt`

export const logger = (controller: string, fnName: string, desc: string, code?: string) => {
  try {
    if(!existsSync(logfile)) writeFileSync(logfile, `Request Logs\nDate: ${moment(new Date()).format('MM-DD-YYYY')}\n\n`)
    let info = (code === undefined) ? desc : `${code} - ${desc}`
    let logtxt: string = `${moment(new Date()).format('MM-DD-YYYY hh:mm:ss A')}\nController: ${controller} -> ${fnName}\nCode: ${code}\nInfo: ${info}\n\n`
    appendFileSync(logfile, logtxt)
  } catch(e) {
    console.log(e)
  }
}