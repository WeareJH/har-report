#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var h = require('./');

var cli = require("meow")({
    help: ["Usage: $ har-report harfile.json\n"]
});

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
        return h({input: incoming});
    } else {
        if (filepath.match(/\.har$/)) {
            incoming = JSON.parse(fs.readFileSync(incomingPath, 'utf8'));
            return h({input: incoming});
        }
    }
});
