(function() {
  var defaultShareTitle, infoManager, uniqueQuestion, weixinData;

  weixinData = {
    "img_url": "http://42.120.22.130/mediax/husttest/img/summary.png",
    "img_width": "120",
    "img_height": "120",
    "link": "http://42.120.22.130/mediax/husttest/",
    "desc": "",
    "title": ""
  };

  (function() {
    var onBridgeReady;
    onBridgeReady = function() {
      return WeixinJSBridge.on('menu:share:timeline', function(argv) {
        return WeixinJSBridge.invoke('shareTimeline', weixinData, function() {});
      });
    };
    if (document.addEventListener) {
      return document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      return document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  })();

  defaultShareTitle = '我在参加华科人鉴定考试！我不是武大的！你也来试试！';

  weixinData.title = defaultShareTitle;

  weixinData.desc = defaultShareTitle;

  infoManager = (function() {
    function infoManager(dataJson) {
      var footerText, footerTextHolder;
      this.dataJson = dataJson;
      jQuery("#queTitle").html(this.dataJson["queTitle"]);
      jQuery("#startText").html(this.dataJson["startText"]);
      footerTextHolder = jQuery("#footerText");
      footerText = dataJson["footerText"].replace(" ", "");
      if (footerText === "") {
        footerTextHolder.hide();
      } else {
        footerTextHolder.html(footerText);
      }
    }

    return infoManager;

  })();

  uniqueQuestion = (function() {
    function uniqueQuestion(dataJson) {
      this.startDiv;
      this.endDiv;
      this.queDiv;
      this.queList;
      this.btnStart;
      this.dataJson = dataJson;
      this.dataArray = dataJson['queData'];
      this.scoreArray = dataJson['scoreArray'];
      this.fullScore = dataJson['fullScore'];
      this.score = 0;
      this.nowQueIndex = 0;
      this.answerArray = [];
      this.averageScore;
      this.init();
    }

    uniqueQuestion.prototype.init = function() {
      var _this = this;
      this.startDiv = jQuery(".cBodyStart");
      this.endDiv = jQuery(".cBodyEnd");
      this.queDiv = jQuery(".cBodyQue");
      this.queList = jQuery("#queList");
      this.progressHolder = jQuery(".queProgress");
      this.progress = jQuery("#queProgress");
      this.averageScore = this.fullScore / this.dataArray.length;
      console.log(this.averageScore);
      return jQuery("#btn-start").click(function() {
        _this.startDiv.hide();
        _this.progressHolder.fadeIn();
        return _this.startAnswer();
      });
    };

    uniqueQuestion.prototype.startAnswer = function() {
      this.nowQueIndex = -1;
      return this.changeQue();
    };

    uniqueQuestion.prototype.getWordByIndex = function(index) {
      switch (index) {
        case 0:
          return 'A';
          break;
        case 1:
          return 'B';
          break;
        case 2:
          return 'C';
          break;
        case 3:
          return 'D';
          break;
        case 4:
          return 'E';
          break;
        case 5:
          return 'F';
          break;
      }
    };

    uniqueQuestion.prototype.setProgress = function() {
      var nowProgress;
      nowProgress = this.nowQueIndex / this.dataArray.length;
      nowProgress = "" + (parseInt(100 * nowProgress)) + "%";
      this.progress.css("width", nowProgress);
      return this.progress.html(nowProgress);
    };

    uniqueQuestion.prototype.createQueDiv = function() {
      var choicesArray, index, item, liHtml, nowDataJson, nowWord, queHtml, title, titleStr, _i, _len;
      this.setProgress();
      nowDataJson = this.dataArray[this.nowQueIndex];
      title = nowDataJson['title'];
      titleStr = "" + (this.nowQueIndex + 1) + ". " + title;
      queHtml = "<div class='title'>                    " + titleStr + "                    </div>                <ul id='queList'>";
      choicesArray = nowDataJson['choices'];
      for (index = _i = 0, _len = choicesArray.length; _i < _len; index = ++_i) {
        item = choicesArray[index];
        nowWord = this.getWordByIndex(index);
        liHtml = "<li><span>" + nowWord + ". " + item + "</span></li>";
        queHtml += liHtml;
      }
      queHtml += '</ul>';
      this.queDiv.hide();
      this.queDiv.html(queHtml);
      this.queDiv.fadeIn();
      return this.addEvent();
    };

    uniqueQuestion.prototype.ifRightChoice = function(choiceIndex) {
      var nowdatajson;
      nowdatajson = this.dataArray[this.nowQueIndex];
      console.log(choiceIndex, nowdatajson['rightIndex']);
      if (nowdatajson['rightIndex'] === choiceIndex) {
        return true;
      } else {
        return false;
      }
    };

    uniqueQuestion.prototype.addEvent = function() {
      var _this;
      this.queList = jQuery("#queList li");
      console.log(this.queList, "quelist");
      _this = this;
      return this.queList.click(function() {
        var nowEle, nowIndex;
        nowEle = jQuery(this);
        nowIndex = nowEle.index();
        _this.answerArray.push(nowIndex);
        nowEle.addClass("active");
        console.log(nowIndex, 'nowIndex');
        if (_this.ifRightChoice(nowIndex)) {
          _this.score += _this.averageScore;
        } else {
          console.log("wrong choice!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }
        console.log(_this.score);
        return setTimeout((function() {
          return _this.changeQue();
        }), 40);
      });
    };

    uniqueQuestion.prototype.changeQue = function() {
      if (this.nowQueIndex < this.dataArray.length - 1) {
        console.log("nowQueIndex", this.nowQueIndex);
        this.nowQueIndex++;
        return this.createQueDiv();
      } else {
        console.log(this.score, "score!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("finish");
        return this.endAnswer();
      }
    };

    uniqueQuestion.prototype.getcommentIndex = function(nowIndex) {
      var nowItem;
      nowItem = this.scoreArray[nowIndex];
      console.log(this.score, nowIndex, nowItem);
      if (this.score > nowItem['score']) {
        return this.getcommentIndex(nowIndex + 1);
      } else {
        return nowIndex;
      }
    };

    uniqueQuestion.prototype.getCommentByScore = function() {
      var comment, commentIndex;
      commentIndex = 0;
      commentIndex = this.getcommentIndex(commentIndex);
      console.log(commentIndex);
      comment = this.scoreArray[commentIndex]['comment'];
      console.log(comment);
      return comment;
    };

    uniqueQuestion.prototype.endAnswer = function() {
      var accountBtnHref, accountBtnText, comment, endHtml, endText;
      comment = this.getCommentByScore();
      this.score = parseInt(this.score);
      endText = this.dataJson['endText'];
      accountBtnText = this.dataJson["accountBtnText"];
      accountBtnHref = this.dataJson["accountBtnHref"].replace(" ", "");
      endHtml = "<div class='score-holder'>                    <span id='score'>" + this.score + "分</span>                </div>                <div class='infos'>                    <div>                        <b>详细分析:</b>                    </div>                    <p id='comment'>                    " + comment + "                    </p>                    <p>                        " + endText + "                    </p>                    <a class='btn btn-lg btn-success' id='btn-share' onclick='showGuide();'>邀请小伙伴一起玩</a>                        ";
      if (accountBtnHref !== "") {
        endHtml += "<a class='btn btn-lg btn-danger' id='btn-share' href=" + accountBtnHref + "'>" + accountBtnText + "</a>";
      }
      endHtml += "</div>";
      this.queDiv.hide();
      this.progressHolder.hide();
      this.startDiv.hide();
      this.endDiv.append(endHtml);
      this.endDiv.fadeIn();
      weixinData.title = this.score + "分! " + comment;
      return weixinData.desc = this.score + "分! " + comment;
    };

    return uniqueQuestion;

  })();

  jQuery(document).ready(function() {
    var joinEm, nowIM;
    console.log("ready");
    window.nowUQ = new uniqueQuestion(window.nowdatajson);
    nowIM = new infoManager(window.nowdatajson);
    joinEm = jQuery(".joinPeople em");
    joinEm.html("超过20万");
    window.hideGuide = function() {
      var theGuidePage;
      theGuidePage = jQuery("#share-guide");
      return theGuidePage.hide();
    };
    return window.showGuide = function() {
      var theGuidePage;
      theGuidePage = jQuery("#share-guide");
      return theGuidePage.show();
    };
  });

}).call(this);
