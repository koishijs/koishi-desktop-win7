import del from 'del'
import { TaskFunction } from 'gulp'
import { info } from 'gulplog'
import * as lzma from 'lzma-native'
import StreamZip from 'node-stream-zip'
import * as fs from 'node:fs'
import stream from 'node:stream'
import { promisify } from 'node:util'
import * as tar from 'tar'
import { Exceptions } from '../../../utils/exceptions'
import { exists } from '../../../utils/fs'
import { dir } from '../../../utils/path'
import { destFileLinux, destFileMac, destFileWin, nameWin } from './path'

export const prepareNodeExtractWin = async () => {
  const nodeFolder = dir('buildPortableData', 'node')
  const cachedFile = dir('buildCache', destFileWin)

  info('Checking destination cache.')
  if (await exists(dir('buildPortableData', 'node/koishi.exe'))) return

  if (!(await exists(cachedFile))) {
    throw Exceptions.fileNotFound(cachedFile)
  }

  const zip = new StreamZip.async({ file: cachedFile })
  await zip.extract(nameWin, nodeFolder)
  await zip.close()

  await del(dir('buildPortableData', 'node/CHANGELOG.md'))
  await del(dir('buildPortableData', 'node/README.md'))
  await del(dir('buildPortableData', 'node/node_modules'))
  await del(dir('buildPortableData', 'node/node_etw_provider.man'))
  await del(dir('buildPortableData', 'node/install_tools.bat'))
  await del(dir('buildPortableData', 'node/nodevars.bat'))
  await del(dir('buildPortableData', 'node/corepack'))
  await del(dir('buildPortableData', 'node/corepack.cmd'))
  await del(dir('buildPortableData', 'node/npm'))
  await del(dir('buildPortableData', 'node/npm.cmd'))
  await del(dir('buildPortableData', 'node/npx'))
  await del(dir('buildPortableData', 'node/npx.cmd'))

  await fs.promises.rename(
    dir('buildPortableData', 'node/node.exe'),
    dir('buildPortableData', 'node/koishi.exe')
  )
}

export const prepareNodeExtractMac = async () => {
  const nodeFolder = dir('buildPortableData', 'node')
  const cachedFile = dir('buildCache', destFileMac)

  info('Checking destination cache.')
  if (await exists(dir('buildPortableData', 'node/bin/koishi'))) return

  if (!(await exists(cachedFile))) {
    throw Exceptions.fileNotFound(cachedFile)
  }

  await promisify(stream.finished)(
    fs
      .createReadStream(cachedFile)
      .pipe(tar.extract({ cwd: nodeFolder, strip: 1 }))
  )

  await del(dir('buildPortableData', 'node/CHANGELOG.md'))
  await del(dir('buildPortableData', 'node/README.md'))
  await del(dir('buildPortableData', 'node/bin/corepack'))
  await del(dir('buildPortableData', 'node/bin/npm'))
  await del(dir('buildPortableData', 'node/bin/npx'))
  await del(dir('buildPortableData', 'node/include'))
  await del(dir('buildPortableData', 'node/lib'))
  await del(dir('buildPortableData', 'node/share'))

  await fs.promises.rename(
    dir('buildPortableData', 'node/bin/node'),
    dir('buildPortableData', 'node/bin/koishi')
  )
}

export const prepareNodeExtractLinux = async () => {
  const nodeFolder = dir('buildPortableData', 'node')
  const cachedFile = dir('buildCache', destFileLinux)

  info('Checking destination cache.')
  if (await exists(dir('buildPortableData', 'node/bin/koishi'))) return

  if (!(await exists(cachedFile))) {
    throw Exceptions.fileNotFound(cachedFile)
  }

  await promisify(stream.finished)(
    fs
      .createReadStream(cachedFile)
      .pipe(lzma.createDecompressor())
      .pipe(tar.extract({ cwd: nodeFolder, strip: 1 }))
  )

  await del(dir('buildPortableData', 'node/CHANGELOG.md'))
  await del(dir('buildPortableData', 'node/README.md'))
  await del(dir('buildPortableData', 'node/bin/corepack'))
  await del(dir('buildPortableData', 'node/bin/npm'))
  await del(dir('buildPortableData', 'node/bin/npx'))
  await del(dir('buildPortableData', 'node/include'))
  await del(dir('buildPortableData', 'node/lib'))
  await del(dir('buildPortableData', 'node/share'))

  await fs.promises.rename(
    dir('buildPortableData', 'node/bin/node'),
    dir('buildPortableData', 'node/bin/koishi')
  )
}

const buildPrepareNodeExtract = (): TaskFunction => {
  switch (process.platform) {
    case 'win32':
      return prepareNodeExtractWin
    case 'darwin':
      return prepareNodeExtractMac
    case 'linux':
      return prepareNodeExtractLinux
    default:
      throw Exceptions.platformNotSupported()
  }
}

export const prepareNodeExtract = buildPrepareNodeExtract()
