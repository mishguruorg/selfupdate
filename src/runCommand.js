/* @flow */

import { exec } from 'child-process-es6-promise'

/**
 * Run a command
 */

const runCommand = async (command: string) => {
  const result = await exec(command)
  return result
}

export default runCommand
