const { spawn } = require('child_process') // 子进程
const chalk = require('chalk')

const commandSpawn = (...args) => {
    console.log(chalk.red('依赖包下载有点慢,请等待...'))
	return new Promise((resolve, reject)=>{
		const childProcess = spawn(...args)

		// 子进程中的标准输出, 传入之前命令进程中展示
		childProcess.stdout.pipe(process.stdout)
		childProcess.stderr.pipe(process.stderr)
	
		childProcess.on('close', () => {
			resolve()
		})
	})


}

module.exports={
	commandSpawn
}