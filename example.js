var json = require("./test/fixtures/har.json");

require("./")({
    input: json,
    config: {
        logLevel: "debug"
    },
    cb: function (err, out) {

    }
});