import execa from 'execa'

/**
 * Update an NPM package
 */

const installPackageVersion = async (name: string, version: string) => {
  const command = `npm install --silent --global ${name}@${version}`
  const result = await execa.command(command)

  if (result.stderr.trim().length > 0) {
    throw new Error(result.stderr)
  }
}

export default installPackageVersion
