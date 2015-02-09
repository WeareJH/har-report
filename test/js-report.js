var json   = require("./fixtures/har.json");
var har    = require("../");
var assert = require("chai").assert;

describe("Running JS report", function(){
    it("should return information about JS files", function(done) {
        har({
            input: json,
            config: {
                writeFiles: false
            },
            cb: function (err, out) {

                var file = out.files.filter(function (item) {
                    return item.path === "js-report.json";
                })[0];

                assert.equal(file.data.totalSize, "1.7 MB");
                assert.equal(file.data.fileCount, 13);

                done();
            }
        });
    });
});
