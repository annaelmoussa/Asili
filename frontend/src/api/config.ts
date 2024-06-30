// api/config.ts
import { Configuration, DefaultApi, AuthApi, WidgetsApi, UserApi } from './index'
import api from './axiosConfig'
import { useUserStore } from '@/stores/user'

const configuration = new Configuration({
  basePath: 'http://localhost:3000',
  baseOptions: {
    withCredentials: true,
    axios: api
  }
})

const defaultApi = new DefaultApi(configuration)
const authApi = new AuthApi(configuration)
const widgetsApi = new WidgetsApi(configuration)
const userApi = new UserApi(configuration)

// @ts-ignore
defaultApi.axios = api
// @ts-ignore
authApi.axios = api
// @ts-ignore
widgetsApi.axios = api
// @ts-ignore
userApi.axios = api

export { defaultApi, authApi, widgetsApi, userApi }
