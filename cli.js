#!/usr/bin/env node

var cli = require("meow")({
    help: ["Usage: $ har-report harfile.json\n"]
});

if (typeof cli.input[0] !== "string") {
    console.log(cli.help);
    return;
}

require("./")({
    input: require(require("path").resolve(cli.input[0]))
});