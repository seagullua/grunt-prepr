(function(host) {
    
    var exported = {
        preprocess: function() {
            console.log("Preprocessing");
        }
    };

    if (module) {
        module.exports = exported;
    } else {
        host.prepr = exported;
    }
})(this);