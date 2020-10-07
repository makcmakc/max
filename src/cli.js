const arg = require('arg')
const inquirer = require('inquirer')
const { createProject } = require('./main')


function parseArgumentsIntoOptions(raw) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes'
    },
    {
      argv: raw.slice(2)
    }
  )

  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    // function: args._[0],
    runInstall: args['--install'] || false
  }
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'Default'

  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    }
  }

  const questions = []

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What’s the name of your project?',
      default: 'My Awesome App'
    })
  }
  if (!options.webpack) {
    questions.push({
      type: 'confirm',
      name: 'webpack',
      message: 'Use webpack dev server (hot reload)?',
      default: true
    })
  }
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['Default', 'JavaScript', 'TypeScript'],
      default: defaultTemplate
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: true
    })
  }

  const answers = await inquirer.prompt(questions)

  return {
    ...options,
    name: options.name || answers.name,
    template: options.template || answers.template,
    webpack: options.webpack || answers.webpack,
    git: options.git || answers.git
  } 
}


export async function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  // console.log(options)

  await createProject(options)
}
