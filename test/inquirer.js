const inquirer = require('inquirer')

const queList = [
	{
		type: 'input',
		message: '请输入您的用户名',
		name: 'username',
		validate(an) {
			console.log(an);
			if(!an) {
				return '当前项为必填项'
			} else {
				return true
			}
		}
	},
	{
		type: 'confirm',
		message: '是否下载',
		name: 'isLoad'
	},
	{
		type: 'list',
		message: '选择下载工具',
		name: 'method',
		choices: ['npm', 'cnpm', 'yarn'],
		when(preAn) {
			return preAn.isLoad
		}
	},
	{
		type: 'checkbox',
		message: '选择默认功能',
		name: 'featrue',
		pageSize: 2,
		choices: ['webpack' , 'webpack-cli', 'eslint', 'jest', 'VueRouter', 'vuex']
	},
]
inquirer.prompt(queList).then((ret)=>{
	console.log(ret);
})