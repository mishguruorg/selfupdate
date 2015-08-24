_ = require('lodash')
stream = require('stream')
child_process = require('child_process')
chai = require('chai')
expect = chai.expect
sinon = require('sinon')
chai.use(require('sinon-chai'))
selfupdate = require('../lib/selfupdate')
npm = require('../lib/npm')
packageJSON = require('../package.json')

describe 'Selfupdate:', ->

	describe '.update()', ->

		it 'should throw if no package json', ->
			expect ->
				selfupdate.update(null)
			.to.throw('Missing package json')

		it 'should throw if package json is not a plain object', ->
			expect ->
				selfupdate.update(123)
			.to.throw('Invalid package json: 123')

		describe 'given the package is up to date', ->

			beforeEach ->
				@npmIsUpdatedStub = sinon.stub(npm, 'isUpdated')
				@npmIsUpdatedStub.yields(null, true)

			afterEach ->
				@npmIsUpdatedStub.restore()

			it 'should return an error', (done) ->
				selfupdate.update packageJSON, (error, version) ->
					expect(error).to.be.an.instanceof(Error)
					expect(error.message).to.equal('You\'re already running the latest version.')
					expect(version).to.not.exist
					done()

		describe 'given the package is not up to date', ->

			beforeEach ->
				@npmIsUpdatedStub = sinon.stub(npm, 'isUpdated')
				@npmIsUpdatedStub.yields(null, false)

			afterEach ->
				@npmIsUpdatedStub.restore()

			describe 'given update is successful', ->

				beforeEach ->
					@npmUpdateStub = sinon.stub(npm, 'update')
					@npmUpdateStub.yields(null, '1.0.0')

				afterEach ->
					@npmUpdateStub.restore()

				it 'should return the new version', (done) ->
					selfupdate.update packageJSON, (error, version) ->
						expect(error).to.not.exist
						expect(version).to.equal('1.0.0')
						done()

			describe 'given update returns an error', ->

				beforeEach ->
					@npmUpdateStub = sinon.stub(npm, 'update')
					@npmUpdateStub.yields(new Error('update error'))

				afterEach ->
					@npmUpdateStub.restore()

				it 'should return the error', (done) ->
					selfupdate.update packageJSON, (error, version) ->
						expect(error).to.be.an.instanceof(Error)
						expect(error.message).to.equal('update error')
						expect(version).to.not.exist
						done()

	describe '.restart()', ->

		describe 'given the command finishes', ->

			beforeEach ->
				@commandStreamStub = new stream.Readable()

				# Avoid a "not implemented" exception
				@commandStreamStub._read = _.noop

				@childProcessSpawnStub = sinon.stub(child_process, 'spawn')
				@childProcessSpawnStub.returns(@commandStreamStub)

				@processExitStub = sinon.stub(process, 'exit')

			afterEach ->
				@childProcessSpawnStub.restore()
				@processExitStub.restore()

			it 'should exit after the command finishes', ->
				@commandStreamStub.on = (event, callback) ->
					expect(event).to.equal('close')
					return callback(0)

				selfupdate.restart()
				expect(@processExitStub).to.have.been.calledOnce
				expect(@processExitStub).to.have.been.calledWith(0)

			it 'should call child_process.spawn appropriately', ->
				process.argv = [ 'coffee', 'foo', 'bar' ]
				selfupdate.restart()
				expect(@childProcessSpawnStub).to.have.been.calledOnce
				expect(@childProcessSpawnStub).to.have.been.calledWith('coffee', [ 'foo', 'bar' ])
