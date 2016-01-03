'use strict';

require('should');
var helper = require('./helper');
var injection = require('..');

var fakeWindow = {
  document: {
    getElementById: function() {}
  }
};

describe('GitHub-Injection', function() {

  describe('constructor', function() {

    it('require a window argument', function () {
      injection.bind(null).should.throw('Missing argument global');
    });

    it('require a callback argument', function () {
      injection.bind(null, fakeWindow).should.throw('Missing argument callback');
    });

    it('callback is not a function', function () {
      injection.bind(null, fakeWindow, {}, {}).should.throw('Callback is not a function');
    });

    it('window parameter is not valid', function () {
      injection.bind(null, {}).should.throw('The given argument global is not a valid window object');
    });

    it('accept a callback argument', function (done) {
      injection.bind(null, fakeWindow, done).should.not.throw();
    });

    it('accept a options and callback argument', function (done) {
      injection.bind(null, fakeWindow, {}, done).should.not.throw();
    });
  });

  describe('markup', function() {

    this.timeout(4000);

    before(function(done) {
      this.$ = this.result = null;

      helper('repo_browser.html', '/', function(_jquery, _result) {
        this.$ = _jquery;
        this.result = _result;
        done();
      }.bind(this));
    });

    it('ajax container is present', function() {
      this.$('#js-repo-pjax-container').length.should.equal(1);
    });
  });

});
