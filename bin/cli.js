#!/usr/bin/env node

const { program } = require('commander')
const helpOptions = require('../lib/core/help.js')
const action = require('../lib/core/action.js')

// 帮助和options
helpOptions(program)

// 自定义命令
action(program)

program.parse(process.argv)