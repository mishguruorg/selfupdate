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
