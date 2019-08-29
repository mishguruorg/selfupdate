import anyTest, { TestInterface } from 'ava'
import * as stu from 'stu'
import { SinonStub } from 'sinon'

const NAME = '@mishguru/selfupdate'
const VERSION = '1.0.0'

const test = anyTest as TestInterface<{
  execa: {
    command: SinonStub,
  },
  installPackageVersion: (name: string, version: string) => Promise<void>,
}>

test.beforeEach((t) => {
  const execa = stu.mock('execa')
  const { default: installPackageVersion } = stu.test('./installPackageVersion')

  t.context = {
    ...t.context,
    execa,
    installPackageVersion,
  }
})

test('given running the command returns an error', async (t) => {
  const { execa, installPackageVersion } = t.context

  execa.command.rejects(new Error('npm error'))

  t.plan(2)

  try {
    await installPackageVersion(NAME, VERSION)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'npm error')
  }
})

test('given running the command prints to stderr => reject with stderr', async (t) => {
  const { execa, installPackageVersion } = t.context

  execa.command.resolves({ sdout: 'stdout', stderr: 'stderr' })

  t.plan(2)

  try {
    await installPackageVersion(NAME, VERSION)
  } catch (error) {
    t.true(error instanceof Error)
    t.is(error.message, 'stderr')
  }
})
