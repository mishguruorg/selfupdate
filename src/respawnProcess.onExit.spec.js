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

  const processExit = sinon.stub(process, 'exit')

  t.context = {
    ...t.context,
    spawn,
    processExit,
    commandStreamStub,
    respawnProcess
  }
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
