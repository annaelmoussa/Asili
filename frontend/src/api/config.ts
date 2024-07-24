import { Configuration, DefaultApi, AuthApi, WidgetsApi, UserApi, RGPDApi } from './index'
import api from './axiosConfig'

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL as string,
  baseOptions: {
    withCredentials: true,
    axios: api
  }
})

const defaultApi = new DefaultApi(configuration)
const authApi = new AuthApi(configuration)
const widgetsApi = new WidgetsApi(configuration)
const userApi = new UserApi(configuration)
const rgpdApi = new RGPDApi(configuration)
// @ts-ignore
defaultApi.axios = api
// @ts-ignore
authApi.axios = api
// @ts-ignore
widgetsApi.axios = api
// @ts-ignore
userApi.axios = api
// @ts-ignore
rgpdApi.axios = api

export { defaultApi, authApi, widgetsApi, userApi, rgpdApi }
