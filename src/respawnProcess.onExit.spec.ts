import anyTest, { TestInterface } from 'ava'
import sinon, { SinonStub } from 'sinon'
import * as stu from 'stu'
import stream, { Stream } from 'stream'

const test = anyTest as TestInterface<{
  processExit: SinonStub,
  commandStreamStub: Stream,
  respawnProcess: () => void,
}>

test.beforeEach((t) => {
  const spawn = stu.mock('child_process').spawn

  const commandStreamStub = new stream.Readable()
  commandStreamStub._read = () => null
  spawn.returns(commandStreamStub)

  const { default: respawnProcess } = stu.test('./respawnProcess')

  const processExit = sinon.stub(process, 'exit')

  t.context = {
    ...t.context,
    processExit,
    commandStreamStub,
    respawnProcess,
  }
})

test.cb('should exit after the command finishes', (t) => {
  const { commandStreamStub, processExit, respawnProcess } = t.context

  commandStreamStub.on = (event, onDone) => {
    t.is(event, 'close')
    onDone(0)
    t.end()
    return commandStreamStub
  }

  respawnProcess()

  t.is(processExit.callCount, 1)
  t.deepEqual(processExit.args, [[0]])
})
