var cli    = require("meow");
var input  = cli({
    help: ["Usage: $ har-report index.js <json file>"]
});

try {
    require("./")({
        input: require(require("path").resolve(input.input[0]))
    });
} catch (e) {
    console.log(e.message);
}