const helpOptions = function (program) {
	// 自定义 option
	program.option('-f --framework <framework>', 'select your framework')
	program.option('-d --dest <dest>', 'a destination folder')

	// 帮助信息
	const examples = {
		create: ['ali create|crt <project>'],
		config: [
			'ali config|cfg set <k> <v>',
			'ali config|cfg get <k>'
		]
	}
}
module.exports = helpOptions;