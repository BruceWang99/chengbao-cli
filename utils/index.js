
const ora = require('ora')
const axios = require('axios')
const { promisify } =  require('util')
const path = require('path')
const fs = require('fs')
const downloadFn = promisify(require('download-git-repo'))
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
const toLinuxPath = function (path) {
	return path.replace(/\\/g, '/')
}
const downloadRepo = async function (repoName, tag) {
	const cacheDir = toLinuxPath(process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'])
	let api = `BruceWang99/${repoName}`
	if(tag) api+= `#/${tag}`
	console.log(api, '<======');
	console.log('cacheDir', cacheDir);
	const dest = tag ? path.resolve(cacheDir, repoName, tag) : path.resolve(cacheDir, repoName)
	if(!fs.existsSync(dest)) {
		const spinner = ora('正在执行下载').start()
		await downloadFn(api, dest)
		spinner.succeed('下载成功')
	}
	return dest
}
module.exports={
	addLoading, 
	fetchInfo,
	toLinuxPath,
	downloadRepo
}
