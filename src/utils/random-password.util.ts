
const alphaNumeric: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+<>?'

export const randomPassword = () => {
  let ln: number = alphaNumeric.length
  let res: string = ''
  for(let i: number = 0; i < 10; i++) {
    res += alphaNumeric.charAt(Math.floor(Math.random() * ln))
  }
  return res
}