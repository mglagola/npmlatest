const _exec = require("child_process").exec;
const { isEmpty } = require('./fp');

function exec (cmd, ignoreStterr = false) {
    return new Promise((resolve, reject) => {
        _exec(cmd, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            } else if (!ignoreStterr && !isEmpty(stderr)) {
                return reject(stderr);
            } else {
                return resolve(stdout);
            }
        });
    });
}

module.exports = exec;
