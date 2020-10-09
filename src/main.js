const chalk = require('chalk')
const fs = require('fs')
const ncp = require('ncp')
const path = require('path')
const { promisify } = require('util')
const execa = require('execa')
const Listr = require('listr')
const { projectInstall } = require('pkg-install')

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  })
}

export async function createProject(options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = options.name === '.'
  const name = inCurrent ? path.relative('../', cwd) : options.name
  const targetDir = path.resolve(cwd, options.name || '.')

  options = {
    ...options,
    targetDirectory: options.targetDirectory || targetDir
  }

 const templateDir = path.resolve(
   new URL(import.meta.url).pathname,
   '../../templates',
   options.template
 );
 options.templateDirectory = templateDir

 try {
   await access(templateDir, fs.constants.R_OK)
 } catch (err) {
   console.error('%s Invalid template name', chalk.red.bold('ERROR'))
   process.exit(1)
 }

 console.log('Copy project files')
 await copyTemplateFiles(options)

 console.log(`🎉  Successfully created project ${chalk.yellow(name)}.`)

 return true
}


