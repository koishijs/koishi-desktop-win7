import { info } from 'gulplog'
import { spawnOut } from './utils'

export const nodeVersion = '12.22.12'

export const defaultInstance = 'adace8ea4130c619a7376e8e117780102e67dca7'

export const defaultNpmrc = `
registry=https://registry.npmmirror.com/
prefix=\${HOME}/../node
cache=\${HOME}/../tmp/npm-cache
tmp=\${HOME}/../tmp
`.trim()

export const defaultKoiConfig = `
mode: portable
target: ${defaultInstance}
`.trim()

let koiVersionTemp = ''

export async function getKoiVersion(): Promise<string> {
  if (koiVersionTemp) return koiVersionTemp
  try {
    koiVersionTemp =
      'v' + (await spawnOut('git', ['describe', '--tags', '--dirty']))
  } catch (error) {
    koiVersionTemp = 'v0.0.1'
  }
  info(`Use koi version ${koiVersionTemp}`)
  return koiVersionTemp
}
