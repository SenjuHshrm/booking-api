export const port = (env: string) => {
  return env === 'development' ? 3000 : 4000;
}