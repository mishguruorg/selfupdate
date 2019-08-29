import { spawn } from 'child_process'

/**
 * Restart the current process using process.argv.
 * The current process exits only when the child
 * process does, so you must make sure the current
 * process does not run any further code.
 */

const respawnProcess = () => {
  const command = process.argv[0]
  const args = process.argv.slice(1)

  const child = spawn(command, args, {
    stdio: 'inherit',
  })

  child.on('close', process.exit)

  return child
}

export default respawnProcess
