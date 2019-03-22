import test from 'ava'
import sinon from 'sinon'
import { mock, test as require } from 'stu'
import stream from 'stream'

test.beforeEach((t) => {
  const spawn = mock('child_process').spawn

  const commandStreamStub = new stream.Readable()
  commandStreamStub._read = () => null
  spawn.returns(commandStreamStub)

  const respawnProcess = require('./respawnProcess').default

  t.context = {
    ...t.context,
    spawn,
    commandStreamStub,
    respawnProcess
  }
})

test('should call child_process.spawn appropriately', (t) => {
  const { spawn, respawnProcess } = t.context

  process.argv = ['coffee', 'foo', 'bar']

  respawnProcess()

  t.is(spawn.callCount, 1)
  t.deepEqual(spawn.args, [
    ['coffee', ['foo', 'bar'], { stdio: 'inherit' }]
  ])
})
