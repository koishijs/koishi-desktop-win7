import { info } from 'gulplog'
import fs from 'node:fs/promises'
import { sourceGitHub, versionAppimagetool } from '../../utils/config'
import { exists } from '../../utils/fs'
import { download } from '../../utils/net'
import { dir } from '../../utils/path'

const src = `${sourceGitHub}/AppImage/AppImageKit/releases/download/${versionAppimagetool}/appimagetool-x86_64.AppImage`
const destFile = 'appimagetool.AppImage'

export const prepareAppimagetoolDownload = async () => {
  info('Checking temporary cache.')
  if (await exists(dir('buildCache', destFile))) return

  info('Now downloading appimagetool.')
  await download(src, dir('buildCache'), destFile)
  await fs.chmod(dir('buildCache', destFile), 0o755)
}

export const prepareAppimagetool =
  process.platform === 'linux'
    ? prepareAppimagetoolDownload
    : async () => {
        /* No need to do anything */
      }
