import test from 'ava'

import getUpdateCommand from './getUpdateCommand'

test('should throw if no package', (t) => {
  const error = t.throws(() => {
    return getUpdateCommand(null)
  }, Error)

  t.is(error.message, 'Missing package name')
})

test('should create a valid command', (t) => {
  const command = getUpdateCommand('foo')
  t.is(command, 'npm install --silent --global foo')
})
