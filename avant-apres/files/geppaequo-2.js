// http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
var Geppaequo = (function ($) {

  var _this_ = {
    contextPath : "/"
  };

  // cf. http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
  if (typeof String.prototype.trunc !== 'function') {
      String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'&hellip;' : this;
      };
  }

  // cf. http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
  if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  // cf. http://stackoverflow.com/questions/280634/endswith-in-javascript
  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
      if (typeof suffix === "undefined") {
        return false;
      }
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  // cf. http://stackoverflow.com/questions/646628/javascript-startswith
  if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function(prefix) {
        return this.slice(0, prefix.length) == prefix;
    };
  }

  // cf. https://gist.github.com/bgrins/5108712
  // Full version of `log` that:
  //  * Prevents errors on console methods when no console present.
  //  * Exposes a global 'log' function that preserves line numbering and formatting.
  (function () {
    var method;
    var noop = function () { };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
          console[method] = noop;
      }
    }

    if (Function.prototype.bind) {
      window.log = Function.prototype.bind.call(console.log, console);
    }
    else {
      window.log = function() {
        Function.prototype.apply.call(console.log, console, arguments);
      };
    }
  })();

  _this_.setContextPath = function(contextPathParam) {
      if (!_.isString(contextPathParam)) {
          return;
      }
      if (contextPathParam.endsWith('/')) {
          this.contextPath = contextPathParam;
      } else {
          this.contextPath = contextPathParam + '/';
      }
  }

  _this_.showBody = function(whenHeaderAndFooterAreLoaded) {
    if (typeof whenHeaderAndFooterAreLoaded === "undefined" || !whenHeaderAndFooterAreLoaded) {
      $('body div#loading').css('display', 'none');
      return;
    }
    // load geppaequo header and footer for modules
    var grandeLassitudeHeader = null;
    var grandeLassitudeFooter = null;
    var pathname = window.location.pathname;

    if (pathname.indexOf(this.contextPath + 'modules/') != -1) {
      if (pathname.endsWith('/index.jsp')) {
        grandeLassitudeHeader = pathname.replace('/modules/', '/stnemucod/document/modules/').replace('/index.jsp', '/header.html');
        grandeLassitudeFooter = pathname.replace('/modules/', '/stnemucod/document/modules/').replace('/index.jsp', '/footer.html');
      } else if (pathname.endsWith('/')) {
        grandeLassitudeHeader = pathname.replace('/modules/', '/stnemucod/document/modules/').replace(/\/$/g, '/header.html');
        grandeLassitudeFooter = pathname.replace('/modules/', '/stnemucod/document/modules/').replace(/\/$/g, '/footer.html');
      }
    } else if (pathname === this.contextPath + 'index.jsp') {
        grandeLassitudeHeader = pathname.replace('/index.jsp', '/stnemucod/document/home/header.html');
        grandeLassitudeFooter = pathname.replace('/index.jsp', '/stnemucod/document/home/footer.html');
    } else if (pathname === this.contextPath) {
        grandeLassitudeHeader = pathname.replace(/\/$/g, '/stnemucod/document/home/header.html');
        grandeLassitudeFooter = pathname.replace(/\/$/g, '/stnemucod/document/home/footer.html');
    }

    var countDownLatch = {
      count: 0,
      check: function() {
        this.count--;
        if (this.count == 0) {
          this.showContainer();
        }
      },
      showContainer: function() {
        $('body div#loading').css('display', 'none');
        $('body div#loaded').css('visibility', 'visible');
      }
    };

    countDownLatch.count++;

    if (grandeLassitudeHeader != null) {
      countDownLatch.count ++;
      $("#geppaequo-header").load(grandeLassitudeHeader, function(response, status, xhr) {
        countDownLatch.check();
      });
    }

    if (grandeLassitudeFooter != null) {
      countDownLatch.count ++;
      $("#geppaequo-footer").load(grandeLassitudeFooter, function(response, status, xhr) {
        countDownLatch.check();
      });
    }

    countDownLatch.check();
  };

  return _this_;

}(jQuery));
