(function() {
  var Fs, Http, MainHandler, ParseRange, Path, Url, WriteErr, WriteFile, config, currentPath, server;

  config = {
    port: 8002,
    defaultPathname: "../edit/index.html",
    staticPath: "../edit/",
    Expires: {
      fileMatch: /|png|jpg|gif|css|js|html|ogg|mp3|/ig,
      maxAge: 60 * 60 * 24 * 365
    },
    MIMETypes: {
      "css": "text/css",
      "gif": "image/gif",
      "html": "text/html",
      "ico": "image/x-icon",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "js": "text/javascript",
      "json": "application/json",
      "pdf": "application/pdf",
      "png": "image/png",
      "svg": "image/svg+xml",
      "swf": "application/x-shockwave-flash",
      "tiff": "image/tiff",
      "txt": "text/plain",
      "ogg": "audio/ogg",
      "mp3": "audio/mp3",
      "wav": "audio/x-wav",
      "wma": "audio/x-ms-wma",
      "wmv": "video/x-ms-wmv",
      "xml": "text/xml",
      'unknow': "text/plain"
    }
  };

  Http = require("http");

  Path = require("path");

  Url = require("url");

  Fs = require("fs");

  currentPath = __dirname;

  console.log(currentPath);

  WriteErr = function(err, res) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    return res.end(err);
  };

  ParseRange = function(str, size) {
    var end, range, start;
    if (str.indexOf(",") !== -1) {
      return;
    }
    range = str.replace(/bytes=/, "").split("-");
    start = parseInt(range[0], 10);
    end = parseInt(range[1], 10);
    if (isNaN(end)) {
      end = parseInt(size - 1);
    }
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
      return false;
    }
    return {
      start: start,
      end: end
    };
  };

  WriteFile = function(req, realPath, type, stats, res) {
    var header, range, raw;
    res.setHeader('Content-Type', config.MIMETypes[type]);
    if (req.headers.range) {
      range = ParseRange(req.headers["range"], stats.size);
      if (range) {
        header = {
          "Content-Range": "bytes " + range.start + "-" + range.end + "/" + stats.size,
          "Accept-Ranges": "bytes",
          "Content-Length": range.end - range.start + 1,
          "Transfer-Encoding": 'chunked'
        };
        res.writeHead(206, header);
        raw = Fs.createReadStream(realPath, {
          start: range.start,
          end: range.end
        });
        return raw.pipe(res);
      } else {
        res.removeHeader("Content-Length");
        res.writeHead(416, "req Range Not Satisfiable");
        return res.end();
      }
    } else {
      raw = Fs.createReadStream(realPath);
      res.writeHead(200, "Ok");
      return raw.pipe(res);
    }
  };

  MainHandler = function(req, res) {
    var ext, pathname, realPath, type, urldata;
    req.setEncoding("utf8");
    urldata = Url.parse(req.url);
    pathname = urldata.pathname;
    if (pathname === "/") {
      pathname = config.defaultPathname;
    }
    realPath = "" + currentPath + "/" + config.staticPath + pathname;
    ext = Path.extname(realPath);
    type = ext ? ext.slice(1) : 'unknown';
    return Fs.exists(realPath, function(ans) {
      var expires;
      if (ans === false) {
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(404, "Not Found");
        res.end("404");
        return true;
      }
      if (true) {
        expires = new Date();
        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
        res.setHeader("Expires", expires.toUTCString());
        res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
        return Fs.stat(realPath, function(err, stats) {
          var lastModified;
          if (err) {
            return WriteErr(err, res);
          }
          lastModified = stats.mtime.toUTCString();
          res.setHeader("Last-Modified", lastModified);
          if (lastModified === req.headers['if-modified-since']) {
            res.writeHead(304, "Not Modified");
            return res.end();
          } else {
            return WriteFile(req, realPath, type, stats, res);
          }
        });
      } else {
        return WriteFile(req, realPath, type, res);
      }
    });
  };

  server = Http.createServer(MainHandler);

  server.listen(config.port);

  console.log("server running at port:" + config.port);

}).call(this);
