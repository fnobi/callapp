var fs = require('fs'),
    readline = require('readline'),
    child_process = require('child_process');

var callapp = function () {
    var opena = function (appname, callback) {
        child_process.exec(
            'open -a "' + appname + '"',
            function (error, stdout, stderr) {
                if (error) {
                    return callback(error);
                }
                callback();
            }
        );

    };

    var searcha = function (appname, callback) {
        callback = callback || function () {};

        child_process.exec(
            'find /Applications -name "*' + appname + '*.app"',
            function (error, stdout, stderr) {
                if (!stdout) {
                    console.log('[not found.]');
                    return callback();
                }

                var lineCount = stdout.match(/\n/g).length;

                if (lineCount === 1) {
                    stdout = stdout.replace(/\n$/, '');
                    console.log('[open] %s', stdout);
                    child_process.exec('open "' + stdout + '"', callback);
                } else {
                    console.log(stdout);
                    callback();
                }
            }
        );
    };

    var loadAppName = function (callback) {
        if (process.argv[2]) {
            process.argv.shift();
            process.argv.shift();

            var line = process.argv.join(' ');
            return callback(line);
        }

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('application name: ', function (appname) {
            rl.close();
            return callback(appname);
        });
    };

    loadAppName(function (appname) {
        // とりあえず、open -a してみる
        opena(appname, function (err) {
            if (!err) {
                // 成功なら終了
                console.log('[open] %s', appname);
                return;
            }

            // 失敗したら、探してみる
            console.log('[search] %s', appname);
            searcha(appname, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        })
    });
};

module.exports = callapp;