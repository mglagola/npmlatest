#! /usr/bin/env node

const Promise = require('bluebird');
global.Promise = Promise;

const meow = require('meow');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const {
    readJSONFile,
    updateToLatestCommandsFromPackageJSON,
} = require('./lib');
const { isNil } = require('./lib/fp');
const exec = require('./lib/exec');

const cli = meow(`
Usage: npmlatest [flags]

Options:
  --dry, -d         Dry run

Examples:
  $ npmlatest
  $ npmlatest -v
`, {
    flags: {
        dry: {
            alias: 'd',
            type: 'boolean',
        },
        help: {
            alias: 'h',
            type: 'boolean',
        },
    },
});

async function main (input = [], { dry = false } = {}) {
    const [
        filepath = path.join(process.cwd(), 'package.json'),
    ] = input;
    const packageJSON = await readJSONFile(filepath);
    const commands = updateToLatestCommandsFromPackageJSON(packageJSON);

    let spinner = null;
    try {
        await Promise.each(commands, async ({ command, type }) => {
            if (dry) {
                console.log(command);
                return true;
            }
            if (isNil(spinner)) spinner = ora().start();
            spinner.text = `Updating "${type}"`;
            await exec(command, true);
            return true;
        });
        !isNil(spinner) && spinner.succeed('Updated all dependencies');
    } catch (error) {
        !isNil(spinner) && spinner.fail();
        throw error;
    }

    return true;
}

(async function () {
    try {
        const success = await main(cli.input, cli.flags);
        return process.exit(success ? 0 : 1);
    } catch (error) {
        console.log(chalk.red(error.message));
        console.error(error.stack);
        return process.exit(1);
    }
})();
