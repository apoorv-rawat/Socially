// one mw which set locals for views - called for each request
module.exports.setFlash = function(req, res, next) {

    // puts value in locals. Values are cleared when page is reloaded
    // (here) req.flash when called first time after setting value it puts val in locals
    // after refreshing req.flash yields empty array - req.flash() called again returns empty arr
    // console.log('Custom MW called');
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}