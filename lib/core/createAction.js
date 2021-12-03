#!/usr/bin/env node

const axios = require('axios')
const inquirer = require('inquirer')
const ora = require('ora')
const {fetchInfo, addLoading, downloadRepo} = require('../../utils/index.js')
const { commandSpawn } = require('../../utils/terminal.js')


const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const Metalsmith = require('metalsmith')
const { render } = require('ejs')
const createAction = async function (projectName) {
	const project = projectName[0]
	let repos = []
	try{
		repos = await addLoading(fetchInfo)('BruceWang99')
	} catch(err) {
		console.log(err);
	}
	// 定义问题
	const queList = [
		{
			type: 'list',
			message: '选择模版',
			name: 'tmpRepo',
			choices: repos,
		},
	]
	// 处理问题获取答案
	const { tmpRepo } = await inquirer.prompt(queList)
	console.log('tmpRepo', tmpRepo);
	//查询版本信息
	let tags = []
	try{
		tags = await addLoading(fetchInfo)('BruceWang99', tmpRepo)
	} catch(err){
		console.log(err);
	}
	console.log('tags', tags);
	// 代码路径
	let destDir = null
	if(tags.length) {
		// 有多个版本,我们需要提供列表进行选择
		// 定义问题
		const questList1 = [
			{
				type: 'list',
				message: '请选择版本',
				name: 'tagV',
				choices: tags,
			}
		]
		const { tagV } = await inquirer.prompt(questList1)
		console.log(tagV, '<======');

		destDir = await downloadRepo(tmpRepo, tagV)
	} else {
		console.log('直接下载即可');
		destDir = await downloadRepo(tmpRepo)
	}
    
	// 写入本地
	if(fs.existsSync(path.join(destDir, 'que.js'))){
		console.log('需要渲染数据');
		await new Promise((resolve, reject)=>{
			Metalsmith(__dirname)
			.source(destDir)
			.destination(path.resolve(project))
			.use(async (files, metal, done)=>{
				// console.log(files, '<----');
				// 填充数据之前还需用户给答案
				const queList = require(path.join(destDir, 'que.js'))
				const answer = await inquirer.prompt(queList)
				console.log(answer, '<-----');
				let meta = metal.metadata() //在所有的use里访问
				Object.assign(meta, answer)
				done()
			})
			.use((files, metal, done)=>{
				let data = metal.metadata()
				Reflect.ownKeys(files).forEach(async (fileName) => {
					if(fileName.includes('js') || fileName.includes('json')) {
						let content = files[fileName].contents.toString()
						if(content.includes("<%")) {
							content = await render(content, data)
							files[fileName].contents = Buffer.from(content)
							delete files['que.js']
						}
					}
				})
				console.log(data, '<-----');
				done()
			})
			.build((err)=>{
				if(err){
					reject(err)
				} else {
					resolve()
				}
			})
		})
	} else {
		console.log('直接拷贝', projectName, destDir);
		await ncp(destDir, project)
	}

	// 安装
	const run_command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
	console.log(run_command, '<------');
	await commandSpawn(run_command, ['install'], { cwd: `./${project}`})

	// npm run serve
	await commandSpawn(run_command, ['run', 'serve'], { cwd: `./${project}`})

}
module.exports = createAction;