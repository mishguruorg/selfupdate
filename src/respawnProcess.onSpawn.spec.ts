import anyTest, { TestInterface } from 'ava'
import * as stu from 'stu'
import stream from 'stream'
import { SinonStub } from 'sinon'

const test = anyTest as TestInterface<{
  spawn: SinonStub,
  respawnProcess: () => void,
}>

test.beforeEach((t) => {
  const spawn = stu.mock('child_process').spawn

  const commandStreamStub = new stream.Readable()
  commandStreamStub._read = () => null
  spawn.returns(commandStreamStub)

  const { default: respawnProcess } = stu.test('./respawnProcess')

  t.context = {
    ...t.context,
    spawn,
    respawnProcess,
  }
})

test('should call child_process.spawn appropriately', (t) => {
  const { spawn, respawnProcess } = t.context

  process.argv = ['coffee', 'foo', 'bar']

  respawnProcess()

  t.is(spawn.callCount, 1)
  t.deepEqual(spawn.args, [['coffee', ['foo', 'bar'], { stdio: 'inherit' }]])
})
