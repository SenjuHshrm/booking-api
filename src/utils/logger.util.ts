import { writeFileSync, existsSync, appendFileSync } from "fs";
import moment from 'moment';

let logfile: string = `./logs/${moment(new Date()).format('MM-DD-YYYY')}.txt`

export const logger = (controller: string, fnName: string, desc: string, code?: string) => {
  try {
    if(!existsSync(logfile)) writeFileSync(logfile, `Request Logs\nDate: ${moment(new Date()).format('MM-DD-YYYY')}`)
    let info = (code === undefined) ? desc : `${code} - ${desc}`
    let logtxt: string = `
      ${moment(new Date()).format('MM-DD-YYYY hh:mm:ss A')}\n
      Controller: ${controller} -> ${fnName}\n
      Code: ${code}\n
      Info: ${info}`
    appendFileSync(logfile, logtxt)
  } catch(e) {
    console.log(e)
  }
}