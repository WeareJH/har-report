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

                assert.equal(file.data.ownDomain.fileCount, 3);
                assert.equal(file.data.ownDomain.totalSize, '214.9 kB');

                assert.equal(file.data.thirdParty.fileCount, 10);
                assert.equal(file.data.thirdParty.totalSize, '1.5 MB');

                done();
            }
        });
    });
});
