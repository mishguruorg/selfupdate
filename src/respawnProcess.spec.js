import test from 'ava'
import sinon from 'sinon'
import stu from 'stu'
import stream from 'stream'

test.beforeEach((t) => {
  stu((mock, require) => {
    const spawn = mock('child_process').spawn

    const commandStreamStub = new stream.Readable()
    commandStreamStub._read = () => null
    spawn.returns(commandStreamStub)

    const processExit = sinon.stub(process, 'exit')

    const respawnProcess = require('./respawnProcess').default

    t.context = {
      ...t.context,
      spawn,
      processExit,
      commandStreamStub,
      respawnProcess
    }
  }).mock()
})

test.afterEach((t) => {
  const { processExit } = t.context

  processExit.restore()
})

test.cb('should exit after the command finishes', (t) => {
  const { commandStreamStub, processExit, respawnProcess } = t.context

  commandStreamStub.on = (event, onDone) => {
    t.is(event, 'close')
    onDone(0)
    t.end()
  }

  respawnProcess()

  t.is(processExit.callCount, 1)
  t.deepEqual(processExit.args, [[0]])
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
