#!/usr/bin/env node

const axios = require('axios')
const inquirer = require('inquirer')
const ora = require('ora')

const fetchInfo = async function (repoName, tmpName) {
	const token = "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"
	// 接口
	const url1 = `https://api.github.com/users/${repoName}/repos`
	const url2 = `https://api.github.com/repos/${repoName}/${tmpName}/tags`
	const headers = {
			"Authorization": "token " + token
	}
	const { data } = await axios({
		url: tmpName ? url2 : url1,
		method: 'get',
		headers
	})
	return data.map(item => item.name)
}

const addLoading = function (fn) {
	return async function (...args) {
		const spinner = ora('正在查询').start();
		spinner.color = 'yellow';
		const res = await fn(...args)
		console.log('res..', res);
		spinner.succeed('查询成功')
		return res;
	}
}

const createAction = async function (projectName) {
	console.log('create命令执行了');
	const repos = await addLoading(fetchInfo)('BruceWang99')
	const queList = [
		{
			type: 'list',
			message: '选择模版',
			name: 'tmpRepo',
			choices: repos,
		},
	]
	const { tmpRepo } = await inquirer.prompt(queList)
	console.log('tmpRepo', tmpRepo);
	const tags = await addLoading(fetchInfo)('BruceWang99', tmpRepo)
	console.log('tags', tags);

}
module.exports = createAction;