/* @flow */

const getUpdateCommand = (name: string) => {
  if (name == null) {
    throw new Error('Missing package name')
  }
  return `npm install --silent --global ${name}`
}

export default getUpdateCommand
