import { Configuration, DefaultApi, AuthApi } from './index'

const configuration = new Configuration({
  basePath: 'http://localhost:3000'
})

export const defaultApi = new DefaultApi(configuration)
export const authApi = new AuthApi(configuration)
