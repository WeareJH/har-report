var json   = require("./fixtures/har.json");
var har    = require("../");
var assert = require("chai").assert;

describe.only("Running image list reporter", function(){
    it("should return images as text file", function(done) {
        har({
            input: json,
            config: {
                writeFiles: false
            },
            cb: function (err, out) {

                var file = out.files.filter(function (item) {
                    return item.path === "images.txt";
                })[0];

                assert.equal(file.content.split("\n").length, 56);

                done();
            }
        });
    });
});
