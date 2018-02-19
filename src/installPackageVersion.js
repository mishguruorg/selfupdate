/* @flow */

import { exec } from 'child-process-es6-promise'

/**
 * Update an NPM package
 */

const installPackageVersion = async (name: string, version: string) => {
  const command = `npm install --silent --global ${name}@${version}`
  const result = await exec(command)

  if (result.stderr != null) {
    throw new Error(result.stderr)
  }
}

export default installPackageVersion
