(function() {
  var checkNewOrEdit, createClassed, editDataManager, getCookies, getWordByIndex, nowQueAdder, nowQueLister, nowScoreManager, nowTextDataManager, queAdder, queLister, scoreManager, textDataManager;

  nowQueAdder = null;

  nowQueLister = null;

  nowScoreManager = null;

  nowTextDataManager = null;

  getWordByIndex = function(index) {
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

  window.alertMsg = function(msg, type, hideAfter) {
    var nowMessenger;
    Messenger.options = {
      extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
      theme: 'flat'
    };
    Messenger().hideAll();
    return nowMessenger = Messenger().post({
      message: msg,
      type: type,
      hideAfter: hideAfter
    });
  };

  editDataManager = (function() {
    function editDataManager() {
      this.queTitle = jQuery("#queTitle");
      this.startText = jQuery("#startText");
    }

    return editDataManager;

  })();

  queLister = (function() {
    function queLister(listData) {
      this.listHolder = jQuery("#queListHolder");
      if (listData !== null) {
        this.listData = listData;
      } else {
        this.listData = [];
      }
      this.reloadList();
      this.isDeletingQueNow = false;
      this.deleteIndex = 0;
      this.isDeletingAllQueNow = false;
    }

    queLister.prototype.reloadList = function() {
      var ansIndex, ansItem, answerList, contentHtml, item, liItemHtml, queIndex, rightIndex, title, _i, _j, _len, _len1, _ref;
      console.log("reload start");
      contentHtml = "";
      _ref = this.listData;
      for (queIndex = _i = 0, _len = _ref.length; _i < _len; queIndex = ++_i) {
        item = _ref[queIndex];
        title = item["title"];
        answerList = item["answerList"];
        rightIndex = item["rightIndex"];
        liItemHtml = "<li>                        <div class='panel panel-default'>                            <div class='panel-heading'>                                <div class='btns'>                                    <div class='moveHolder'>                                        <a class='btn-que-moveUp' data-toggle='tooltip' data-original-title='向上移动'>                                            <i class='icon-caret-up'></i>                                        </a>                                        <a class='btn-que-moveDown' data-toggle='tooltip' data-original-title='向下移动'>                                            <i class='icon-caret-down'></i>                                        </a>                                    </div>                                    <a class='btn-que-edit' data-toggle='tooltip' data-original-title='编辑这条问题'>                                        <i class='icon-edit'></i>                                    </a>                                    <a class='btn-que-delete' data-toggle='tooltip' data-original-title='删除这条问题'>                                        <i class='icon-remove-circle'></i>                                    </a>                                </div>                                <a data-toggle='collapse' data-parent='#accordion' href='#queBody" + queIndex + "' class='titleA'>                                    " + (queIndex + 1) + "." + title + "                                </a>                            </div>                            <div id='queBody" + queIndex + "' class='panel-collapse collapse'>                                <div class='panel-body'>                                    <div class='cBodyQue'>                                        <ul id='queList'>";
        for (ansIndex = _j = 0, _len1 = answerList.length; _j < _len1; ansIndex = ++_j) {
          ansItem = answerList[ansIndex];
          if (ansIndex === rightIndex) {
            liItemHtml += "<li class='right'>                                        <i class='icon-ok-circle'></i>                                        <span>" + (getWordByIndex(ansIndex)) + ". " + ansItem + "</span>                                    </li>";
          } else {
            liItemHtml += "<li>                                        <i class='icon-ok-circle'></i>                                        <span>" + (getWordByIndex(ansIndex)) + ". " + ansItem + "</span>                                    </li>";
          }
        }
        liItemHtml += "</ul>                        </div>                    </div>                </div>            </div></li>";
        contentHtml += liItemHtml;
      }
      this.listHolder.html("");
      this.listHolder.append(contentHtml);
      this.addEditDeleteEvent();
      return console.log(this.listHolder);
    };

    queLister.prototype.addEditDeleteEvent = function() {
      var _this = this;
      this.deleteBtns = this.listHolder.find(".btn-que-delete");
      this.editBtns = this.listHolder.find(".btn-que-edit");
      this.moveUpbtns = this.listHolder.find(".btn-que-moveUp");
      this.moveDownBtns = this.listHolder.find(".btn-que-moveDown");
      this.deleteAllBtn = jQuery("#btn-deleteAllQue");
      _this = this;
      console.log(this.editBtns);
      this.editBtns.hover(function() {
        var nowBtn;
        nowBtn = jQuery(this);
        return nowBtn.tooltip('show');
      });
      this.deleteBtns.hover(function() {
        var nowBtn;
        nowBtn = jQuery(this);
        return nowBtn.tooltip('show');
      });
      this.moveUpbtns.hover(function() {
        var nowBtn;
        nowBtn = jQuery(this);
        return nowBtn.tooltip('show');
      });
      this.moveDownBtns.hover(function() {
        var nowBtn;
        nowBtn = jQuery(this);
        return nowBtn.tooltip('show');
      });
      this.editBtns.click(function() {
        var nowBtn, nowIndex;
        nowBtn = jQuery(this);
        nowIndex = nowBtn.parents("li").index();
        console.log(nowIndex, "nowEditIndex!!");
        return _this.editQueAtIndex(nowIndex);
      });
      this.deleteBtns.click(function() {
        var nowBtn, nowIndex;
        nowBtn = jQuery(this);
        nowIndex = nowBtn.parents("li").index();
        return _this.confirmDeleteQueAtIndex(nowIndex);
      });
      this.moveUpbtns.click(function() {
        var nowBtn, nowIndex;
        nowBtn = jQuery(this);
        nowIndex = nowBtn.parents("li").index();
        return _this.confirmMoveQueByIndex(nowIndex, "up");
      });
      this.moveDownBtns.click(function() {
        var nowBtn, nowIndex;
        nowBtn = jQuery(this);
        nowIndex = nowBtn.parents("li").index();
        return _this.confirmMoveQueByIndex(nowIndex, "down");
      });
      this.deleteAllBtn.click(function() {
        return _this.confirmDeleteAllQueAtIndex();
      });
      return jQuery("#btn-confirm-delete").click(function() {
        if (_this.isDeletingQueNow) {
          console.log("delete confirm index is", _this.deleteIndex);
          _this.deleteQueAtIndex(_this.deleteIndex);
          jQuery("#confirmModal").modal("toggle");
          return;
        }
        if (_this.isDeletingAllQueNow) {
          console.log("delete all ques");
          _this.deleteAllQue();
          return jQuery("#confirmModal").modal("toggle");
        }
      });
    };

    queLister.prototype.confirmMoveQueByIndex = function(index, upDown) {
      if (nowQueAdder.isEditByIndex) {
        window.alertMsg("先把正在修改的问题保存了再操作~", "error", 3);
        return;
      }
      if (upDown === "up") {
        if (index > 0) {
          console.log("move up");
          this.moveUpQueByIndex(index);
          return this.reloadList();
        } else {
          return window.alertMsg("这已经是第一个了喂！", "error", 3);
        }
      } else if (upDown === "down") {
        if (index < (this.listData.length - 1)) {
          console.log("move down");
          this.moveDownQueByIndex(index);
          return this.reloadList();
        } else {
          return window.alertMsg("这已经是最后一个了喂！", "error", 3);
        }
      }
    };

    queLister.prototype.moveUpQueByIndex = function(index) {
      var nowData, upData;
      nowData = this.listData[index];
      upData = this.listData[index - 1];
      this.listData.splice(index - 1, 1, nowData);
      return this.listData.splice(index, 1, upData);
    };

    queLister.prototype.moveDownQueByIndex = function(index) {
      var downData, nowData;
      nowData = this.listData[index];
      downData = this.listData[index + 1];
      this.listData.splice(index + 1, 1, nowData);
      return this.listData.splice(index, 1, downData);
    };

    queLister.prototype.confirmDeleteAllQueAtIndex = function(index) {
      if (nowQueAdder.isEditByIndex) {
        return window.alertMsg("请先保存正在编辑的问题", "error", 3);
      } else {
        this.isDeletingAllQueNow = true;
        jQuery("#modalText").html("(,,#ﾟДﾟ) 你确定要删掉所！有！的！问！题？？真的？？？");
        return jQuery("#confirmModal").modal("show");
      }
    };

    queLister.prototype.confirmDeleteQueAtIndex = function(index) {
      if (nowQueAdder.isEditByIndex) {
        return window.alertMsg("请先保存正在编辑的问题", "error", 3);
      } else {
        this.isDeletingQueNow = true;
        this.deleteIndex = index;
        jQuery("#modalText").html("(,,#ﾟДﾟ) 你确定要删掉这条问题？？真的？？？");
        return jQuery("#confirmModal").modal("show");
      }
    };

    queLister.prototype.editQueAtIndex = function(index) {
      var nowDataJson;
      if (nowQueAdder.isEditByIndex) {
        return window.alertMsg("请先保存正在编辑的问题", "error", 3);
      } else {
        nowDataJson = this.listData[index];
        console.log(nowDataJson);
        return nowQueAdder.initWithQueItem(nowDataJson, index);
      }
    };

    queLister.prototype.deleteQueAtIndex = function(index) {
      if (nowQueAdder.isEditByIndex) {
        window.alertMsg("请先保存正在编辑的问题", "error", 3);
      } else {
        console.log("腰闪了！！！", index);
        this.listData.splice(index, 1);
        this.reloadList();
        window.alertMsg("已删除，勿念", 'success', 3);
      }
      return this.isDeletingQueNow = false;
    };

    queLister.prototype.deleteAllQue = function() {
      if (nowQueAdder.isEditByIndex) {
        window.alertMsg("请先保存正在编辑的问题", "error", 3);
      } else {
        this.listData = [];
        this.reloadList();
        window.alertMsg("已清空，勿念", 'success', 3);
      }
      return this.isDeletingAllQueNow = false;
    };

    queLister.prototype.addItem = function(dataJson) {
      this.listData.push(dataJson);
      return this.reloadList();
    };

    queLister.prototype.updateItemAtIndex = function(dataJson, index) {
      this.listData.splice(index, 1, dataJson);
      return this.reloadList();
    };

    return queLister;

  })();

  queAdder = (function() {
    function queAdder() {
      var _this = this;
      this.addQueBtn = jQuery("#btn-addQue");
      this.cancelEditBtn = jQuery("#btn-cancelEdit");
      this.titleInput = jQuery("#queItemTitle");
      this.ansUl = jQuery("#ansAddList li");
      this.title = "";
      this.answerList = [];
      this.rightIndex = null;
      this.isEditByIndex = false;
      this.nowEditIndex = 0;
      this.addQueBtn.click(function() {
        if (_this.isEditByIndex) {
          return _this.updateQueItem();
        } else {
          return _this.addQueItem();
        }
      });
      this.cancelEditBtn.click(function() {
        if (_this.isEditByIndex) {
          _this.isEditByIndex = false;
          _this.setBtnsStatus();
        }
        return _this.clearContent();
      });
    }

    queAdder.prototype.checkInfosComplete = function() {
      var ansItem, index, item, realInput, rightRadio, _i, _len;
      this.title = this.titleInput.val();
      this.answerList = [];
      if (this.title === "") {
        window.alertMsg("问题的标题还空着呢喂！！", "error", 3);
      } else {
        rightRadio = jQuery("[name='rightAns']").filter(":checked");
        realInput = this.ansUl.find(".form-control");
        for (index = _i = 0, _len = realInput.length; _i < _len; index = ++_i) {
          item = realInput[index];
          item = realInput.eq(index);
          ansItem = item.val();
          console.log(ansItem);
          if (ansItem === "") {
            window.alertMsg("(ﾉ￣д￣)ﾉ  第 " + (index + 1) + " 条答案是空的哇！！", "error", 3);
            return;
          } else {
            this.answerList.push(ansItem);
          }
        }
        if (rightRadio.length === 0) {
          window.alertMsg("(ﾉ￣д￣)ﾉ 没有正确答案你闹哪样啊！", "error", 3);
        } else {
          this.rightIndex = parseInt(rightRadio.attr("value"));
          console.log("rightIndex", this.rightIndex);
          return true;
        }
      }
    };

    queAdder.prototype.addQueItem = function() {
      var dataJson;
      if (this.checkInfosComplete()) {
        dataJson = {};
        dataJson["title"] = this.title;
        dataJson["answerList"] = this.answerList;
        dataJson["rightIndex"] = this.rightIndex;
        nowQueLister.addItem(dataJson);
        window.alertMsg("已经添加上去了，口亨！！", "success", 3);
        return this.clearContent();
      } else {

      }
    };

    queAdder.prototype.initWithQueItem = function(dataJson, index) {
      var ansIndex, item, radios, rightIndex, _i, _len, _ref;
      this.isEditByIndex = true;
      this.nowEditIndex = index;
      this.titleInput.val(dataJson["title"]);
      _ref = dataJson["answerList"];
      for (ansIndex = _i = 0, _len = _ref.length; _i < _len; ansIndex = ++_i) {
        item = _ref[ansIndex];
        this.ansUl.eq(ansIndex).find(".form-control").val(item);
      }
      radios = jQuery("[name='rightAns']");
      rightIndex = dataJson["rightIndex"];
      console.log(rightIndex, "rightIndex", radios);
      radios.get(dataJson["rightIndex"]).checked = true;
      return this.setBtnsStatus();
    };

    queAdder.prototype.setBtnsStatus = function() {
      if (this.isEditByIndex) {
        this.addQueBtn.html("保存修改 (︶︹︶) ");
        return this.cancelEditBtn.html("我不修改了 (ι´Д｀)ﾉ ");
      } else {
        this.addQueBtn.html("添加这个问题 (〝▼ _ ▼）");
        return this.cancelEditBtn.html("清空编辑器 (＃｀д´)ﾉ ");
      }
    };

    queAdder.prototype.updateQueItem = function() {
      var dataJson;
      if (this.checkInfosComplete()) {
        dataJson = {};
        dataJson["title"] = this.title;
        dataJson["answerList"] = this.answerList;
        dataJson["rightIndex"] = this.rightIndex;
        nowQueLister.updateItemAtIndex(dataJson, this.nowEditIndex);
        this.isEditByIndex = false;
        this.setBtnsStatus();
        return this.clearContent();
      } else {

      }
    };

    queAdder.prototype.clearContent = function() {
      var index, item, radios, _i, _len, _ref;
      this.titleInput.val("");
      _ref = this.ansUl;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        item = this.ansUl.eq(index);
        item.find(".form-control").val("");
      }
      radios = jQuery("[name='rightAns']");
      return radios.removeAttr("checked");
    };

    return queAdder;

  })();

  scoreManager = (function() {
    function scoreManager(scoreArray) {
      this.input_avgScore = jQuery("#input_avgScore");
      this.span_fullScore = jQuery("#fullScoreSpan");
      this.input_scoreSec = jQuery("#input_scoreSec");
      this.input_scoreComment = jQuery("#input_scoreComment");
      this.btn_addSS = jQuery("#btn_addSS");
      this.btn_deleteSS = jQuery("#btn_deleteSS");
      this.ssStart = jQuery("#scoreSecStart");
      this.ssUl = jQuery("#scoreSecUl");
      this.fullScore;
      this.avgScore;
      this.isDeletingAllSSNow = false;
      if (scoreArray !== null) {
        this.scoreArray = scoreArray;
      } else {
        this.scoreArray = [];
      }
      this.addEvent();
      this.addDeleteEvent();
      this.setSSStart();
      this.reloadList();
    }

    scoreManager.prototype.addEvent = function() {
      var _this = this;
      this.btn_addSS.click(function() {
        return _this.confirmAddScoreSec();
      });
      this.btn_deleteSS.click(function() {
        _this.isDeletingAllSSNow = true;
        return _this.confirlDeleteAllSS();
      });
      this.input_avgScore.change(function() {
        var avgScoreStr;
        avgScoreStr = _this.input_avgScore.val();
        if (avgScoreStr !== "") {
          _this.avgScore = parseInt(avgScoreStr);
          _this.fullScore = nowQueLister.listData.length * _this.avgScore;
          return _this.span_fullScore.html("总分：" + _this.fullScore);
        }
      });
      return jQuery("#btn-ss-confirm-delete").click(function() {
        if (_this.isDeletingAllSSNow) {
          _this.scoreArray = [];
          _this.reloadList();
          _this.clearContent();
          _this.isDeletingAllSSNow = false;
          jQuery("#ssConfirmModal").modal("toggle");
          window.alertMsg("已清空，勿念", 'success', 3);
          return _this.setSSStart();
        }
      });
    };

    scoreManager.prototype.addDeleteEvent = function() {
      var _this;
      this.ssItemDeletebtns = this.ssUl.find(".btn-ss-delete");
      _this = this;
      return this.ssItemDeletebtns.click(function() {
        var nowBtn, nowIndex;
        nowBtn = jQuery(this);
        nowIndex = nowBtn.parents("li").index();
        if (nowIndex === (_this.scoreArray.length - 1)) {
          _this.scoreArray.splice(nowIndex, 1);
          _this.reloadList();
          return _this.setSSStart();
        }
      });
    };

    scoreManager.prototype.setSSStart = function() {
      var arrayCount, lastScore, startStr;
      arrayCount = this.scoreArray.length;
      if (arrayCount === 0) {
        startStr = "0 < 分数 <= ";
        this.span_fullScore.html("总分: 0");
      } else {
        lastScore = this.scoreArray[arrayCount - 1]["score"];
        startStr = "" + lastScore + " < 分数 <= ";
        this.span_fullScore.html("总分: " + lastScore);
      }
      return this.ssStart.html(startStr);
    };

    scoreManager.prototype.getRightScoreByIndex = function(index) {
      /*
      if index == 0
          return parseInt(@scoreArray[index]["score"])+1
      else
      */

      return this.scoreArray[index]["score"];
    };

    scoreManager.prototype.reloadList = function() {
      var comment, contentHtml, index, item, lastScore, score, scoreStr, _i, _len, _ref;
      contentHtml = "";
      _ref = this.scoreArray;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        score = this.getRightScoreByIndex(index);
        if (index === 0) {
          scoreStr = "0 < 分数 <= " + score;
          /*
                      else if index == (@scoreArray.length - 1)
          scoreStr = score
          */

        } else {
          lastScore = this.getRightScoreByIndex(index - 1);
          scoreStr = "" + lastScore + " < 分数 <= " + score;
        }
        comment = item["comment"];
        contentHtml += "<li>                                <div class='panel panel-default'>                                    <div class='panel-heading'>                                        <a class='btn-ss-delete'>                                            <i class='icon-remove-circle'></i>                                        </a>                                        <a data-toggle='collapse' data-parent='#accordion' href='#scoreSec" + index + "' class='titleA'>                                            " + scoreStr + "                                        </a>                                    </div>                                    <div id='scoreSec" + index + "' class='panel-collapse collapse'>                                        <div class='panel-body'>                                            " + comment + "                                        </div>                                    </div>                                </div>                            </li>";
      }
      this.ssUl.html("");
      this.ssUl.append(contentHtml);
      return this.addDeleteEvent();
    };

    scoreManager.prototype.confirlDeleteAllSS = function() {
      return jQuery("#ssConfirmModal").modal("show");
    };

    scoreManager.prototype.checkInfosComplete = function() {
      var sc, ss;
      ss = this.input_scoreSec.val();
      sc = this.input_scoreComment.val();
      if (isNaN(ss)) {
        window.alertMsg("不要以为我分不清数字和字母啊喂！！", "error", 3);
        return false;
      }
      if (ss === "") {
        window.alertMsg("分数分段木有认真填写！！", "error", 3);
        return false;
      }
      if (sc === "") {
        window.alertMsg("分段评价木有认真填写！！", "error", 3);
        return false;
      }
      return true;
    };

    scoreManager.prototype.confirmAddScoreSec = function() {
      var dataJson, lastScore, sc, ss;
      if (this.checkInfosComplete()) {
        console.log("ss complete checked");
        ss = parseInt(this.input_scoreSec.val());
        if (this.scoreArray.length !== 0) {
          lastScore = parseInt(this.scoreArray[this.scoreArray.length - 1]["score"]);
          if (ss <= lastScore) {
            window.alertMsg("你填写的分数比上一个分段还小，请认真点！", 'error', 3);
            return;
          }
        }
        sc = this.input_scoreComment.val();
        dataJson = {};
        dataJson.score = ss;
        dataJson.comment = sc;
        return this.addScoreSec(dataJson);
      } else {

      }
    };

    scoreManager.prototype.clearContent = function() {
      this.input_scoreSec.val("");
      return this.input_scoreComment.val("");
    };

    scoreManager.prototype.addScoreSec = function(dataJson) {
      console.log(dataJson);
      this.scoreArray.push(dataJson);
      this.reloadList();
      this.setSSStart();
      return this.clearContent();
    };

    return scoreManager;

  })();

  textDataManager = (function() {
    function textDataManager(dataJson) {
      this.queTitle;
      this.startText;
      this.footerText;
      this.endText;
      this.accountBtnText;
      this.accountBtnHref;
      this.queTitleInput = jQuery("#queTitle");
      this.startTextInput = jQuery("#startText");
      this.endTextInput = jQuery("#input_endText");
      this.footerTextInput = jQuery("#input_footerText");
      this.accountBtnTextInput = jQuery("#input_endBtnText");
      this.accountBtnHrefInput = jQuery("#input_endBtnHref");
      this.init(dataJson);
    }

    textDataManager.prototype.init = function(dataJson) {
      if (dataJson === null) {
        console.log("no text dataJson");
        this.dataJson = {};
      } else {
        console.log("editing");
        this.dataJson = dataJson;
        this.queTitleInput.val(dataJson["queTitle"]);
        this.startTextInput.val(dataJson["startText"]);
        this.endTextInput.val(dataJson["endText"]);
        this.footerTextInput.val(dataJson["footerText"]);
        this.accountBtnTextInput.val(dataJson["accountBtnText"]);
        this.accountBtnHrefInput.val(dataJson["accountBtnHref"]);
      }
      return this.saveEvent();
    };

    textDataManager.prototype.saveEvent = function() {
      this.saveBtn = jQuery("#btn-saveData");
      return this.previewBtn = jQuery("btn-preview");
    };

    return textDataManager;

  })();

  getCookies = function() {
    var cookieArray, index, item, itemTemp, _i, _len;
    window.shenye_public = null;
    window.shenye_private = null;
    cookieArray = document.cookie.split(";");
    for (index = _i = 0, _len = cookieArray.length; _i < _len; index = ++_i) {
      item = cookieArray[index];
      itemTemp = item.split("=");
      if (itemTemp[0] === "shenye_private") {
        window.shenye_private = itemTemp[1];
      } else if (itemTemp[0] === "shenye_public") {
        window.shenye_public = itemTemp[1];
      }
    }
    return console.log(window.shenye_public, window.shenye_private);
  };

  checkNewOrEdit = function() {
    var urlPara;
    urlPara = window.location.search;
    console.log(urlPara, "urlPara");
    if (urlPara.indexOf("isedit=1") >= 0) {
      console.log("edit page");
      window.isedit = true;
      return createClassed(true);
    } else {
      console.log("new page");
      window.isedit = false;
      return createClassed(false);
    }
  };

  createClassed = function(isedit) {
    if (isedit) {
      console.log("window.dataJson", window.dataJson);
      if (typeof window.dataJson !== 'undefined') {
        nowQueAdder = new queAdder();
        nowQueLister = new queLister(window.dataJson["queData"]);
        nowScoreManager = new scoreManager(window.dataJson["scoreArray"]);
        return nowTextDataManager = new textDataManager(window.dataJson);
      } else {
        return console.log("error!!! no dataJson found!!!");
      }
    } else {
      nowQueAdder = new queAdder();
      nowQueLister = new queLister(null);
      nowScoreManager = new scoreManager(null);
      return nowTextDataManager = new textDataManager(null);
    }
  };

  jQuery(document).ready(function() {
    var ansListData, scoreArray;
    getCookies();
    checkNewOrEdit();
    createClassed();
    ansListData = [
      {
        title: "标题1",
        answerList: ["答案1", "答案2", "答案3", "答案4"],
        rightIndex: 2
      }, {
        title: "标题2",
        answerList: ["答案1", "答案2", "答案3", "答案4"],
        rightIndex: 1
      }, {
        title: "标题3",
        answerList: ["答案1", "答案2", "答案3", "答案4"],
        rightIndex: 0
      }, {
        title: "标题4",
        answerList: ["答案1", "答案2", "答案3", "答案4"],
        rightIndex: 2
      }, {
        title: "标题5",
        answerList: ["答案1", "答案2", "答案3", "答案4"],
        rightIndex: 1
      }
    ];
    scoreArray = [
      {
        score: 59,
        comment: "我在【是不是华科人】中挂科了！被判为武大来的卧底…快来解救我！"
      }, {
        score: 75,
        comment: "我在【是不是华科人】中发现好多事儿现在都忘了，来帮帮我吧！"
      }, {
        score: 85,
        comment: "我在【是不是华科人】知道华科的事儿还真不是一般的多！"
      }, {
        score: 99,
        comment: "我在【是不是华科人】中差一点满分！请叫我华科大百科！"
      }, {
        score: 100,
        comment: "我在【是不是华科人】中得了满分,比根叔都高,简直可以当校长了！"
      }
    ];
    return console.log("ready");
  });

}).call(this);
