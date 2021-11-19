const createAction = require('./createAction.js')
const action = function (program) {
	program
	.command('create <project>[others...]')
	.alias('crt')
	.description('创建项目')
	.action(createAction)
}
module.exports = action;