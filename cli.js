#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var h = require('./');

var cli = require("meow")({
    help: [
        "Usage: $ har-report harfile.json\n",
        "Options:   --outdir  specify the output directory [string]",
    ]
});

runFromCli(cli);

function runFromCli(cli) {
    if (cli.flags.stdin) {
        var chunks = [];
        process.stdin.on('data', function (data) {
            chunks.push(data.toString());
        });
        process.stdin.on('end', function () {
            var incoming = JSON.parse(chunks.join(''));
            return h({input: incoming, config: cli.flags});
        });
        return;
    }
    if (typeof cli.input[0] !== "string") {
        console.log(cli.help);
        return;
    }
    cli.input.forEach(function (filepath) {
        var isJson = filepath.match(/\.json$/);
        var incoming;
        var incomingPath = path.resolve(process.cwd(), filepath);
        if (isJson) {
            incoming = require(incomingPath);
            return h({input: incoming, config: cli.flags});
        } else {
            if (filepath.match(/\.har$/)) {
                incoming = JSON.parse(fs.readFileSync(incomingPath, 'utf8'));
                return h({input: incoming, config: cli.flags});
            }
        }
    });
}



