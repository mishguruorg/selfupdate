chai = require('chai')
expect = chai.expect
sinon = require('sinon')
chai.use(require('sinon-chai'))
npm = require('../lib/npm')
utils = require('../lib/utils')
packageJSON = require('../package.json')

gitwrapNpmInfo = require('./fixtures/npm-info/gitwrap')
nplugmNpmInfo = require('./fixtures/npm-info/nplugm')

describe 'NPM:', ->

	describe '.getLatestVersion()', ->

		describe 'given there was an error fetching the package information', ->

			beforeEach ->
				@npmGetInfoStub = sinon.stub(npm, 'getInfo')
				@npmGetInfoStub.yields(new Error('npm error'))

			afterEach ->
				@npmGetInfoStub.restore()

			it 'should yield the error', (done) ->
				npm.getLatestVersion packageJSON.name, (error, version) ->
					expect(error).to.be.an.instanceof(Error)
					expect(error.message).to.equal('npm error')
					expect(version).to.not.exist
					done()

		describe 'given we got information back', ->

			describe 'given gitwrap data', ->

				beforeEach ->
					@npmGetInfoStub = sinon.stub(npm, 'getInfo')
					@npmGetInfoStub.yields(null, gitwrapNpmInfo)

				afterEach ->
					@npmGetInfoStub.restore()

				it 'should return the latest version', (done) ->
					npm.getLatestVersion packageJSON.name, (error, version) ->
						expect(error).to.not.exist
						expect(version).to.equal('1.1.0')
						done()

			describe 'given nplugm data', ->

				beforeEach ->
					@npmGetInfoStub = sinon.stub(npm, 'getInfo')
					@npmGetInfoStub.yields(null, nplugmNpmInfo)

				afterEach ->
					@npmGetInfoStub.restore()

				it 'should return the latest version', (done) ->
					npm.getLatestVersion packageJSON.name, (error, version) ->
						expect(error).to.not.exist
						expect(version).to.equal('2.2.0')
						done()

	describe '.isUpdated()', ->

		describe 'given there is an error trying to get the latest version', ->

			beforeEach ->
				@npmGetLatestVersionStub = sinon.stub(npm, 'getLatestVersion')
				@npmGetLatestVersionStub.yields(new Error('npm error'))

			afterEach ->
				@npmGetLatestVersionStub.restore()

			it 'should yield the error', (done) ->
				npm.isUpdated packageJSON, (error, isUpdated) ->
					expect(error).to.be.an.instanceof(Error)
					expect(error.message).to.equal('npm error')
					expect(isUpdated).to.not.exist
					done()

		describe 'given we got the latest version', ->

			beforeEach ->
				@npmGetLatestVersionStub = sinon.stub(npm, 'getLatestVersion')
				@npmGetLatestVersionStub.yields(null, '2.0.0')

			afterEach ->
				@npmGetLatestVersionStub.restore()

			describe 'if the current version equals the latest version', ->

				beforeEach ->
					packageJSON.version = '2.0.0'

				it 'should return true', (done) ->
					npm.isUpdated packageJSON, (error, isUpdated) ->
						expect(error).to.not.exist
						expect(isUpdated).to.be.true
						done()

			describe 'if the current version does not equal the latest version', ->

				beforeEach ->
					packageJSON.version = '1.0.0'

				it 'should return false', (done) ->
					npm.isUpdated packageJSON, (error, isUpdated) ->
						expect(error).to.not.exist
						expect(isUpdated).to.be.false
						done()

	describe '.update()', ->

		describe 'given running the command returns an error', ->

			beforeEach ->
				@utilsRunCommandStub = sinon.stub(utils, 'runCommand')
				@utilsRunCommandStub.yields(new Error('npm error'))

			afterEach ->
				@utilsRunCommandStub.restore()

			it 'should yield the error', (done) ->
				npm.update packageJSON, (error, version) ->
					expect(error).to.be.an.instanceof(Error)
					expect(error.message).to.equal('npm error')
					expect(version).to.not.exist
					done()

		describe 'given running the command prints to stderr', ->

			beforeEach ->
				@utilsRunCommandStub = sinon.stub(utils, 'runCommand')
				@utilsRunCommandStub.yields(null, 'stdout', 'stderr')

			afterEach ->
				@utilsRunCommandStub.restore()

			it 'should yield an error containing the stderr output', (done) ->
				npm.update packageJSON, (error, version) ->
					expect(error).to.be.an.instanceof(Error)
					expect(error.message).to.equal('stderr')
					expect(version).to.not.exist
					done()

		describe 'given running the command is successful', ->

			beforeEach ->
				@utilsRunCommandStub = sinon.stub(utils, 'runCommand')
				@utilsRunCommandStub.yields(null, 'stdout', '')

			afterEach ->
				@utilsRunCommandStub.restore()

			describe 'given there was an error fetching the latest version', ->

				beforeEach ->
					@npmGetLatestVersionStub = sinon.stub(npm, 'getLatestVersion')
					@npmGetLatestVersionStub.yields(new Error('npm error'))

				afterEach ->
					@npmGetLatestVersionStub.restore()

				it 'should yield the error', (done) ->
					npm.update packageJSON, (error, version) ->
						expect(error).to.be.an.instanceof(Error)
						expect(error.message).to.equal('npm error')
						expect(version).to.not.exist
						done()

			describe 'given fetching the latest version was successful', ->

				beforeEach ->
					@npmGetLatestVersionStub = sinon.stub(npm, 'getLatestVersion')
					@npmGetLatestVersionStub.yields(null, '2.0.0')

				afterEach ->
					@npmGetLatestVersionStub.restore()

				it 'should yield the latest version', (done) ->
					npm.update packageJSON, (error, version) ->
						expect(error).to.not.exist
						expect(version).to.equal('2.0.0')
						done()

				it 'should run the correct command', (done) ->
					npm.update packageJSON, (error, version) =>
						expect(@utilsRunCommandStub).to.have.been.calledWith('npm install --silent --global selfupdate')
						done()
