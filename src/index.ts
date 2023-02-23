import { Context, Schema } from 'koishi'
import axios from 'axios'

export const name = 'worker-proxy'

export interface Config {
  url: string,
  mode: boolean,
  list: string[]
}

export const Config: Schema<Config> = Schema.object({
  url: Schema.string().required().description('地址'),
  mode: Schema.union([
    Schema.const(true).description('白名单'),
    Schema.const(false).description('黑名单')
  ]).default(true).description('模式'),
  list: Schema.array(String).role('table').description('域名列表'),
})

export function apply(_ctx: Context, config: Config) {
  axios.interceptors.request.use((value) => {
    try {
      if (config.list.includes(new URL(value.url).hostname) === config.mode) {
        const url = new URL(config.url)
        url.searchParams.set('url', value.url)
        value.url = url.href
      }
    }
    finally {
      return value
    }
  })
}
