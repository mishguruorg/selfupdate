president = require('president')
child_process = require('child_process')
chai = require('chai')
expect = chai.expect
sinon = require('sinon')
chai.use(require('sinon-chai'))
utils = require('../lib/utils')

describe 'Utils:', ->

	describe '.getUpdateCommand()', ->

		it 'should throw if no package', ->
			expect ->
				utils.getUpdateCommand(null)
			.to.throw('Missing package')

		it 'should create a valid command', ->
			command = utils.getUpdateCommand('foo')
			expect(command).to.equal('npm install --silent --global foo')

	describe '.isPermissionError()', ->

		it 'should return false if no error', ->
			expect(utils.isPermissionError(null)).to.be.false

		it 'should return true if error code is EPERM', ->
			error = new Error()
			error.code = 'EPERM'
			expect(utils.isPermissionError(error)).to.be.true

		it 'should return true if error code is EACCES', ->
			error = new Error()
			error.code = 'EACCES'
			expect(utils.isPermissionError(error)).to.be.true

		it 'should return true if error code is ACCES', ->
			error = new Error()
			error.code = 'ACCES'
			expect(utils.isPermissionError(error)).to.be.true

		it 'should return true if error code is 3', ->
			error = new Error()
			error.code = 3
			expect(utils.isPermissionError(error)).to.be.true

		it 'should return true if error errno is 3', ->
			error = new Error()
			error.errno = 3
			expect(utils.isPermissionError(error)).to.be.true

		it 'should return true if error is not about permissions', ->
			error = new RangeError()
			expect(utils.isPermissionError(error)).to.be.false

		describe 'given a permission related stderr error on Ubuntu Linux', ->

			beforeEach ->
				@stderr = new Error '''
					npm ERR! Error: EACCES, mkdir '/usr/lib/node_modules/selfupdate-test'
					npm ERR!  { [Error: EACCES, mkdir '/usr/lib/node_modules/selfupdate-test']
					npm ERR!   errno: 3,
					npm ERR!   code: 'EACCES',
					npm ERR!   path: '/usr/lib/node_modules/selfupdate-test',
					npm ERR!   fstream_type: 'Directory',
					npm ERR!   fstream_path: '/usr/lib/node_modules/selfupdate-test',
					npm ERR!   fstream_class: 'DirWriter',
					npm ERR!   fstream_stack:
					npm ERR!    [ '/usr/lib/node_modules/npm/node_modules/fstream/lib/dir-writer.js:36:23',
					npm ERR!      '/usr/lib/node_modules/npm/node_modules/mkdirp/index.js:46:53',
					npm ERR!      'Object.oncomplete (fs.js:108:15)' ] }
					npm ERR!
					npm ERR! Please try running this command again as root/Administrator.

					npm ERR! System Linux 3.13.0-24-generic
					npm ERR! command "/usr/bin/node" "/usr/bin/npm" "install" "--global" "selfupdate-test"
					npm ERR! cwd /home/jviotti/selfupdate
					npm ERR! node -v v0.10.38
					npm ERR! npm -v 1.4.28
					npm ERR! path /usr/lib/node_modules/selfupdate-test
					npm ERR! fstream_path /usr/lib/node_modules/selfupdate-test
					npm ERR! fstream_type Directory
					npm ERR! fstream_class DirWriter
					npm ERR! code EACCES
					npm ERR! errno 3
					npm ERR! stack Error: EACCES, mkdir '/usr/lib/node_modules/selfupdate-test'
					npm ERR! fstream_stack /usr/lib/node_modules/npm/node_modules/fstream/lib/dir-writer.js:36:23
					npm ERR! fstream_stack /usr/lib/node_modules/npm/node_modules/mkdirp/index.js:46:53
					npm ERR! fstream_stack Object.oncomplete (fs.js:108:15)
					npm ERR!
					npm ERR! Additional logging details can be found in:
					npm ERR!     /home/jviotti/selfupdate/npm-debug.log
					npm ERR! not ok code 0
				'''

			it 'should return true', ->
				expect(utils.isPermissionError(@stderr)).to.be.true

		describe 'given a permission related stderr error on Arch Linux', ->

			beforeEach ->
				@stderr = new Error '''
					npm ERR! Linux 4.0.1-1-ARCH
					npm ERR! argv "node" "/usr/bin/npm" "install" "--global" "resin-cli"
					npm ERR! node v0.12.2
					npm ERR! npm  v2.9.0
					npm ERR! path /usr/bin/resin
					npm ERR! code EACCES
					npm ERR! errno -13

					npm ERR! Error: EACCES, unlink '/usr/bin/resin'
					npm ERR!     at Error (native)
					npm ERR!  { [Error: EACCES, unlink '/usr/bin/resin'] errno: -13, code: 'EACCES', path: '/usr/bin/resin' }
					npm ERR!
					npm ERR! Please try running this command again as root/Administrator.
					npm ERR! error rolling back Error: EACCES, unlink '/usr/bin/resin'
					npm ERR! error rolling back     at Error (native)
					npm ERR! error rolling back  { [Error: EACCES, unlink '/usr/bin/resin'] errno: -13, code: 'EACCES', path: '/usr/bin/resin' }

					npm ERR! Please include the following file with any support request:
					npm ERR!     /home/lorenzo/npm-debug.log
				'''

			it 'should return true', ->
				expect(utils.isPermissionError(@stderr)).to.be.true

	describe '.runCommand()', ->

		beforeEach ->
			@presidentExecuteStub = sinon.stub(president, 'execute')
			@presidentExecuteStub.yields(null, 'stdout', '')

		afterEach ->
			@presidentExecuteStub.restore()

		describe 'given a successful command', ->

			beforeEach ->
				@childProcessExecStub = sinon.stub(child_process, 'exec')
				@childProcessExecStub.yields(null, 'success', '')

			afterEach ->
				@childProcessExecStub.restore()

			it 'should not call president', (done) ->
				utils.runCommand 'foo bar', (error, stdout, stderr) =>
					expect(error).to.not.exist
					expect(stdout).to.equal('success')
					expect(stderr).to.equal('')
					expect(@presidentExecuteStub).to.not.have.been.called
					done()

		describe 'given a permission error', ->

			beforeEach ->
				error = new Error()
				error.code = 'EPERM'

				@childProcessExecStub = sinon.stub(child_process, 'exec')
				@childProcessExecStub.yields(error)

			afterEach ->
				@childProcessExecStub.restore()

			it 'should call president', (done) ->
				utils.runCommand 'foo bar', (error, stdout, stderr) =>
					expect(error).to.not.exist
					expect(@presidentExecuteStub).to.have.been.calledOnce
					done()

		describe 'given a non permission error', ->

			beforeEach ->
				error = new Error('non permission')

				@childProcessExecStub = sinon.stub(child_process, 'exec')
				@childProcessExecStub.yields(error)

			afterEach ->
				@childProcessExecStub.restore()

			it 'should not call president', (done) ->
				utils.runCommand 'foo bar', (error, stdout, stderr) =>
					expect(@presidentExecuteStub).to.not.have.been.called
					done()

			it 'should yield the error', (done) ->
				utils.runCommand 'foo bar', (error, stdout, stderr) ->
					expect(error).to.be.an.instanceof(Error)
					expect(error.message).to.equal('non permission')
					expect(stdout).to.not.exist
					expect(stderr).to.not.exist
					done()

		describe 'given the command outputs to stderr', ->

			beforeEach ->
				@childProcessExecStub = sinon.stub(child_process, 'exec')
				@childProcessExecStub.yields new Error '''
					npm ERR! Linux 4.0.1-1-ARCH
					npm ERR! argv "node" "/usr/bin/npm" "install" "--global" "resin-cli"
					npm ERR! node v0.12.2
					npm ERR! npm  v2.9.0
					npm ERR! path /usr/bin/resin
					npm ERR! code EACCES
					npm ERR! errno -13

					npm ERR! Error: EACCES, unlink '/usr/bin/resin'
					npm ERR!     at Error (native)
					npm ERR!  { [Error: EACCES, unlink '/usr/bin/resin'] errno: -13, code: 'EACCES', path: '/usr/bin/resin' }
					npm ERR!
					npm ERR! Please try running this command again as root/Administrator.
					npm ERR! error rolling back Error: EACCES, unlink '/usr/bin/resin'
					npm ERR! error rolling back     at Error (native)
					npm ERR! error rolling back  { [Error: EACCES, unlink '/usr/bin/resin'] errno: -13, code: 'EACCES', path: '/usr/bin/resin' }

					npm ERR! Please include the following file with any support request:
					npm ERR!     /home/lorenzo/npm-debug.log
				'''

			afterEach ->
				@childProcessExecStub.restore()

			it 'should call president', (done) ->
				utils.runCommand 'foo bar', (error, stdout, stderr) =>
					expect(error).to.not.exist
					expect(@presidentExecuteStub).to.have.been.calledOnce
					done()
