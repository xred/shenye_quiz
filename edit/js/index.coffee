`String.prototype.replaceAll = function(s1, s2) {      
    return this.replace(new RegExp(s1, "gm"), s2); //g 全局     
}     
    
String.prototype.replaceAll2Excep = function(s1, s2) {        
    var temp = this;        
    while (temp.indexOf(s1) != -1) {        
        temp = temp.replace(s1, s2);        
    }        
    return temp;        
}`

nowQueAdder = null
nowQueLister = null
nowScoreManager = null
nowTextDataManager = null

getWordByIndex = (index)->
        switch index
            when 0
                return 'A'
                break
            when 1
                return 'B'
                break
            when 2
                return 'C'
                break
            when 3
                return 'D'
                break
            when 4
                return 'E'
                break
            when 5
                return 'F'
                break

window.alertMsg = (msg,type,hideAfter)->
    Messenger.options = 
        extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
        theme: 'flat'
    Messenger().hideAll()
    nowMessenger = Messenger().post
        message: msg
        type: type
        hideAfter: hideAfter

class editDataManager
    constructor: () ->
        #init eles
        @queTitle = jQuery "#queTitle"
        @startText = jQuery "#startText"

class queLister
    constructor: (listData) ->
        @listHolder = jQuery "#queListHolder"

        #ques data as a array
        if listData != null
            @listData = listData
        else
            @listData = []
        @reloadList()


        #delete data
        @isDeletingQueNow = no
        @deleteIndex = 0

        @isDeletingAllQueNow = no
    reloadList:()->
        console.log "reload start"
        contentHtml = ""
        for item,queIndex in @listData
            title = item["title"]
            answerList = item["answerList"]
            rightIndex = item["rightIndex"]
            liItemHtml = "<li>
                        <div class='panel panel-default'>
                            <div class='panel-heading'>

                                <div class='btns'>
                                    <div class='moveHolder'>
                                        <a class='btn-que-moveUp' data-toggle='tooltip' data-original-title='向上移动'>
                                            <i class='icon-caret-up'></i>
                                        </a>
                                        <a class='btn-que-moveDown' data-toggle='tooltip' data-original-title='向下移动'>
                                            <i class='icon-caret-down'></i>
                                        </a>
                                    </div>
                                    <a class='btn-que-edit' data-toggle='tooltip' data-original-title='编辑这条问题'>
                                        <i class='icon-edit'></i>
                                    </a>
                                    <a class='btn-que-delete' data-toggle='tooltip' data-original-title='删除这条问题'>
                                        <i class='icon-remove-circle'></i>
                                    </a>
                                </div>

                                <a data-toggle='collapse' data-parent='#accordion' href='#queBody#{queIndex}' class='titleA'>
                                    #{queIndex+1}.#{title}
                                </a>
                            </div>
                            <div id='queBody#{queIndex}' class='panel-collapse collapse'>
                                <div class='panel-body'>
                                    <div class='cBodyQue'>
                                        <ul id='queList'>"
            for ansItem,ansIndex in answerList
                if ansIndex == rightIndex
                    liItemHtml += "<li class='right'>
                                        <i class='icon-ok-circle'></i>
                                        <span>#{getWordByIndex(ansIndex)}. #{ansItem}</span>
                                    </li>"
                else
                    liItemHtml += "<li>
                                        <i class='icon-ok-circle'></i>
                                        <span>#{getWordByIndex(ansIndex)}. #{ansItem}</span>
                                    </li>"
            liItemHtml +=  "</ul>
                        </div>
                    </div>
                </div>
            </div></li>"
            contentHtml += liItemHtml
        @listHolder.html ""
        @listHolder.append contentHtml           

        @addEditDeleteEvent()
        console.log @listHolder



    addEditDeleteEvent:()->
        @deleteBtns = @listHolder.find ".btn-que-delete"
        @editBtns = @listHolder.find ".btn-que-edit"
        @moveUpbtns = @listHolder.find ".btn-que-moveUp"
        @moveDownBtns = @listHolder.find ".btn-que-moveDown"

        @deleteAllBtn = jQuery "#btn-deleteAllQue"

        _this = this
        console.log @editBtns

        @editBtns.hover ->
            nowBtn = jQuery this
            nowBtn.tooltip 'show'
        @deleteBtns.hover ->
            nowBtn = jQuery this
            nowBtn.tooltip 'show'
        @moveUpbtns.hover ->
            nowBtn = jQuery this
            nowBtn.tooltip 'show'
        @moveDownBtns.hover ->
            nowBtn = jQuery this
            nowBtn.tooltip 'show'


        @editBtns.click ->
            nowBtn = jQuery this
            nowIndex = nowBtn.parents("li").index()
            console.log nowIndex,"nowEditIndex!!"
            _this.editQueAtIndex nowIndex
        @deleteBtns.click ->
            nowBtn = jQuery this
            nowIndex = nowBtn.parents("li").index()
            _this.confirmDeleteQueAtIndex nowIndex

        @moveUpbtns.click ->
            nowBtn = jQuery this
            nowIndex = nowBtn.parents("li").index()
            _this.confirmMoveQueByIndex nowIndex,"up"
        @moveDownBtns.click ->
            nowBtn = jQuery this
            nowIndex = nowBtn.parents("li").index()
            _this.confirmMoveQueByIndex nowIndex,"down"

        @deleteAllBtn.click =>
            @confirmDeleteAllQueAtIndex()
        #confirm event
        jQuery("#btn-confirm-delete").click =>
            if @isDeletingQueNow
                console.log "delete confirm index is",@deleteIndex
                @deleteQueAtIndex @deleteIndex
                jQuery("#confirmModal").modal "toggle"
                return
            if @isDeletingAllQueNow
                console.log "delete all ques"
                @deleteAllQue()

                jQuery("#confirmModal").modal "toggle"
    #move event
    confirmMoveQueByIndex:(index,upDown)->
        if nowQueAdder.isEditByIndex
            window.alertMsg "先把正在修改的问题保存了再操作~","error",3
            return
        if upDown == "up"
            #check if first
            if index > 0
                console.log "move up"
                @moveUpQueByIndex index
                @reloadList()
            else
                window.alertMsg "这已经是第一个了喂！","error",3

            
        else if upDown == "down"
            #check if last
            if index < (@listData.length-1)
                console.log "move down"
                @moveDownQueByIndex index
                @reloadList()
            else
                window.alertMsg "这已经是最后一个了喂！","error",3
        
    moveUpQueByIndex:(index)->
        nowData = @listData[index]
        upData = @listData[index-1]
        @listData.splice index-1,1,nowData
        @listData.splice index,1,upData
    moveDownQueByIndex:(index)->
        nowData = @listData[index]
        downData = @listData[index+1]
        @listData.splice index+1,1,nowData
        @listData.splice index,1,downData


    #delete cibnfrim
    confirmDeleteAllQueAtIndex:(index)->
        if nowQueAdder.isEditByIndex    
            window.alertMsg "请先保存正在编辑的问题","error",3
        else
            @isDeletingAllQueNow = yes
            
            jQuery("#modalText").html "(,,#ﾟДﾟ) 你确定要删掉所！有！的！问！题？？真的？？？"
            jQuery("#confirmModal").modal "show" 

    confirmDeleteQueAtIndex:(index)->
        if nowQueAdder.isEditByIndex    
            window.alertMsg "请先保存正在编辑的问题","error",3
        else
            @isDeletingQueNow = yes
            @deleteIndex = index
            
            jQuery("#modalText").html "(,,#ﾟДﾟ) 你确定要删掉这条问题？？真的？？？"
            jQuery("#confirmModal").modal "show" 

    editQueAtIndex:(index)->
        if nowQueAdder.isEditByIndex    
            window.alertMsg "请先保存正在编辑的问题","error",3
        else
            nowDataJson = @listData[index]
            console.log nowDataJson
            nowQueAdder.initWithQueItem nowDataJson,index
    deleteQueAtIndex:(index)->
        if nowQueAdder.isEditByIndex    
            window.alertMsg "请先保存正在编辑的问题","error",3
        else
            console.log "腰闪了！！！",index
            @listData.splice index,1
            @reloadList()
            window.alertMsg "已删除，勿念",'success',3
        @isDeletingQueNow = no
    deleteAllQue:()->
        if nowQueAdder.isEditByIndex    
            window.alertMsg "请先保存正在编辑的问题","error",3
        else
            @listData = []
            @reloadList()
            window.alertMsg "已清空，勿念",'success',3
        @isDeletingAllQueNow = no
        

    addItem:(dataJson)->
        @listData.push dataJson
        @reloadList()
    updateItemAtIndex:(dataJson,index)->
        @listData.splice index,1,dataJson
        @reloadList()

class queAdder
    constructor: () ->
        @addQueBtn = jQuery "#btn-addQue"
        @cancelEditBtn = jQuery "#btn-cancelEdit"
        @titleInput = jQuery "#queItemTitle"
        @ansUl = jQuery "#ansAddList li"

        #data
        @title = ""
        @answerList = []
        @rightIndex = null

        @isEditByIndex = no
        @nowEditIndex = 0

        @addQueBtn.click =>
            if @isEditByIndex
                #now is editing a que in list
                @updateQueItem()
            else
                # 
                @addQueItem()
        @cancelEditBtn.click =>
            console.log "fuckyou!!!!!!!!!!!!!!!!"
            if @isEditByIndex
                @isEditByIndex = no
                @setBtnsStatus()
            @clearContent()


    checkInfosComplete:()->
        console.log "checkInfosComplete()"
        @title = @titleInput.val()
        @answerList = []
        #check title
        if @title == ""
            window.alertMsg "问题的标题还空着呢喂！！","error",3
            return false
        else
            #check answerList
            rightRadio = jQuery("[name='rightAns']").filter(":checked")
            realInput = @ansUl.find ".form-control"
            for item,index in realInput
                item  = realInput.eq index
                ansItem = item.val()
                console.log ansItem
                if ansItem == ""
                    window.alertMsg "(ﾉ￣д￣)ﾉ  第 #{index+1} 条答案是空的哇！！","error",3
                    return false
                else
                    @answerList.push ansItem

            #check radio
            if rightRadio.length == 0
                window.alertMsg "(ﾉ￣д￣)ﾉ 没有正确答案你闹哪样啊！","error",3
                return false
            else
                @rightIndex = parseInt rightRadio.attr "value"
                console.log "rightIndex",@rightIndex
                return yes
            
    addQueItem:()->
        if @checkInfosComplete()
            #add que item
            dataJson = {}
            dataJson["title"] = @title
            dataJson["answerList"] = @answerList
            dataJson["rightIndex"] = @rightIndex
            nowQueLister.addItem dataJson
            window.alertMsg "已经添加上去了，口亨！！","success",3
            @clearContent()
        else
            return

    initWithQueItem:(dataJson,index)->
        @isEditByIndex = yes
        @nowEditIndex = index

        @titleInput.val dataJson["title"]

        #set answer list
        for item,ansIndex in dataJson["answerList"]
            @ansUl.eq(ansIndex).find(".form-control").val item

        #set radio
        radios = jQuery("[name='rightAns']")
        #radios.attr "checked",false
        rightIndex = dataJson["rightIndex"]
        console.log rightIndex,"rightIndex",radios
        radios.get(dataJson["rightIndex"]).checked = true

        @setBtnsStatus()
        
    setBtnsStatus:()->
        if @isEditByIndex
            @addQueBtn.html "保存修改 (︶︹︶) "
            @cancelEditBtn.html "我不修改了 (ι´Д｀)ﾉ "
        else
            @addQueBtn.html "添加这个问题 (〝▼ _ ▼）"
            @cancelEditBtn.html "清空编辑器 (＃｀д´)ﾉ "
        
        
    updateQueItem:()->
        if @checkInfosComplete()
            #add que item
            dataJson = {}
            dataJson["title"] = @title
            dataJson["answerList"] = @answerList
            dataJson["rightIndex"] = @rightIndex
            nowQueLister.updateItemAtIndex dataJson,@nowEditIndex
            @isEditByIndex = no
            @setBtnsStatus()

            @clearContent()
        else
            return
    clearContent:()->
        @titleInput.val ""
        for item,index in @ansUl
            item = @ansUl.eq index
            item.find(".form-control").val ""
        radios = jQuery("[name='rightAns']")
        radios.removeAttr "checked"

class scoreManager
    constructor: (scoreArray) ->
        #eles
        @input_avgScore = jQuery "#input_avgScore"
        @span_fullScore = jQuery "#fullScoreSpan"

        @input_scoreSec = jQuery "#input_scoreSec"
        @input_scoreComment = jQuery "#input_scoreComment"

        @btn_addSS = jQuery "#btn_addSS"
        @btn_deleteSS = jQuery "#btn_deleteSS"

        @ssStart = jQuery "#scoreSecStart"

        @ssUl = jQuery "#scoreSecUl"
        #data
        @fullScore = 0
        @avgScore = 0

        @isDeletingAllSSNow = no

        if scoreArray != null
            @scoreArray = scoreArray
        else
            @scoreArray = []

        @addEvent()
        @addDeleteEvent()
        @setSSStart()
        @reloadList()

    addEvent:()->
        @btn_addSS.click =>
            @confirmAddScoreSec()
        @btn_deleteSS.click =>
            @isDeletingAllSSNow = yes
            @confirlDeleteAllSS()

        @input_avgScore.change =>
            avgScoreStr = @input_avgScore.val()
            if avgScoreStr != ""
                @avgScore = parseInt avgScoreStr
                @fullScore = nowQueLister.listData.length * @avgScore
                @span_fullScore.html "总分：#{@fullScore}"

        jQuery("#btn-ss-confirm-delete").click =>
            if @isDeletingAllSSNow
                @scoreArray = []
                @reloadList()
                @clearContent()
                @isDeletingAllSSNow = no
                jQuery("#ssConfirmModal").modal "toggle"
                window.alertMsg "已清空，勿念",'success',3
                @setSSStart()

        

    addDeleteEvent:()->
        @ssItemDeletebtns = @ssUl.find ".btn-ss-delete"

        _this = this
        @ssItemDeletebtns.click ->
            nowBtn = jQuery this
            nowIndex = nowBtn.parents("li").index()
            if nowIndex == (_this.scoreArray.length-1)
                _this.scoreArray.splice nowIndex,1
                _this.reloadList()
                _this.setSSStart()
            
            
    setSSStart:()->
        arrayCount = @scoreArray.length
        if arrayCount == 0
            @fullScore = 0
            startStr = "0 < 分数 <= "
            @span_fullScore.html "总分: 0"
        else
            @fullScore = @scoreArray[arrayCount-1]["score"]
            startStr = "#{@fullScore} < 分数 <= "
            @span_fullScore.html "总分: #{@fullScore}"
        @ssStart.html startStr
        
        
    getRightScoreByIndex:(index)->
        ###
        if index == 0
            return parseInt(@scoreArray[index]["score"])+1
        else
        ###
        return @scoreArray[index]["score"]
    
    reloadList:()->
        contentHtml = ""
        for item,index in @scoreArray
            score = @getRightScoreByIndex index
            if index == 0
                scoreStr = "0 < 分数 <= #{score}"
                ###
            else if index == (@scoreArray.length - 1)
                scoreStr = score
                ###
            else
                lastScore = @getRightScoreByIndex(index-1)
                scoreStr = "#{lastScore} < 分数 <= #{score}"
            
            comment = item["comment"]

            contentHtml += "<li>
                                <div class='panel panel-default'>
                                    <div class='panel-heading'>
                                        <a class='btn-ss-delete'>
                                            <i class='icon-remove-circle'></i>
                                        </a>
                                        <a data-toggle='collapse' data-parent='#accordion' href='#scoreSec#{index}' class='titleA'>
                                            #{scoreStr}
                                        </a>
                                    </div>
                                    <div id='scoreSec#{index}' class='panel-collapse collapse'>
                                        <div class='panel-body'>
                                            #{comment}
                                        </div>
                                    </div>
                                </div>
                            </li>"
        @ssUl.html ""
        @ssUl.append contentHtml
        @addDeleteEvent()
            
        
    confirlDeleteAllSS:()->
        jQuery("#ssConfirmModal").modal "show"
    checkInfosComplete:()->
        ss = @input_scoreSec.val()
        sc = @input_scoreComment.val()
        if isNaN ss
            window.alertMsg "不要以为我分不清数字和字母啊喂！！","error",3
            return false
        if ss == ""
            window.alertMsg "分数分段木有认真填写！！","error",3
            return false
        if sc == ""
            window.alertMsg "分段评价木有认真填写！！","error",3
            return false
        return yes
        
    confirmAddScoreSec:()->
        if @checkInfosComplete()
            console.log "ss complete checked"
            ss = parseInt @input_scoreSec.val()
            if @scoreArray.length != 0
                lastScore = parseInt @scoreArray[@scoreArray.length-1]["score"]
                if ss <= lastScore
                    window.alertMsg "你填写的分数比上一个分段还小，请认真点！",'error',3
                    return

            sc = @input_scoreComment.val()
            dataJson = {}
            dataJson.score = ss
            dataJson.comment = sc
            @addScoreSec dataJson
            
        else
            return
        
    clearContent:()->
        @input_scoreSec.val ""
        @input_scoreComment.val ""
    addScoreSec:(dataJson)->
        console.log dataJson
        @scoreArray.push dataJson
        @reloadList()
        @setSSStart()
        @clearContent()

class textDataManager
    constructor: (dataJson) ->
        @queTitle
        @startText

        @footerText

        @endText
        @accountBtnText
        @accountBtnHref

        #eles
        @queTitleInput = jQuery "#queTitle"
        @startTextInput = jQuery "#startText"
        @endTextInput = jQuery "#input_endText"

        @footerTextInput = jQuery "#input_footerText"

        @accountBtnTextInput = jQuery "#input_endBtnText"
        @accountBtnHrefInput = jQuery "#input_endBtnHref"
        
        @init dataJson

    init:(dataJson)->
        if dataJson == null
            console.log "no text dataJson"
            @dataJson = {}
        else
            console.log "editing"
            @dataJson = dataJson
            @queTitleInput.val dataJson["queTitle"]
            @startTextInput.val dataJson["startText"]
            @endTextInput.val dataJson["endText"]

            @footerTextInput.val dataJson["footerText"]
            @accountBtnTextInput.val dataJson["accountBtnText"]
            @accountBtnHrefInput.val dataJson["accountBtnHref"]
        @saveEvent()

    saveEvent:()->
        @saveBtn = jQuery "#btn-saveData"
        @previewBtn = jQuery "btn-preview"

        @saveBtn.click =>
            if @checkAllInfoComplete()
                console.log "all info check clear"

                @saveDataJson()
            else
                return
    saveDataJson:()->
        if window.dataJson == null
            window.dataJson = {}
        if typeof(window.dataJson) == "undefined"
            window.dataJson = {}
        window.dataJson.queTitle = @queTitle
        window.dataJson.startText = @startText
        window.dataJson.footerText = @footerText
        window.dataJson.endText = @endText
        window.dataJson.accountBtnText = @accountBtnText
        window.dataJson.accountBtnHref = @accountBtnHref
        window.dataJson.fullScore = nowScoreManager.fullScore
        window.dataJson.queData = nowQueLister.listData
        window.dataJson.scoreArray = nowScoreManager.scoreArray
        console.log window.dataJson,"save dataJson"
        dataJsonStr = "window.dataJson=" + JSON.stringify(window.dataJson)
        console.log dataJsonStr,"dataJsonStr"
        
        jQuery.ajax 'http://114.215.169.8/shenye_quiz/edit/save_data.php',{
            data: dataJsonStr
            method: "post"
            contentType: "text/plain"
            #dataType:"text"
            private:window.shenye_private
            public:window.shenye_public
        },(result)=>
            console.log result,"post result!!!!!!!!"

    checkAllInfoComplete:()->
        @queTitle = @queTitleInput.val().replaceAll " ",""
        @startText = @startTextInput.val().replaceAll " ",""
        @endText = @endTextInput.val().replaceAll " ",""
        @footerText = @footerTextInput.val().replaceAll " ",""
        @accountBtnText = @accountBtnTextInput.val().replaceAll " ",""
        @accountBtnHref = @accountBtnHrefInput.val().replaceAll " ",""

        if @queTitle == ""
            window.alertMsg "标题还没有填！！","error",3
            return false
        else
            if @startText == ""
                window.alertMsg "引导文字还木有填哦。。","error",3
                return false
            else
                if nowQueLister.listData.length <= 0
                    window.alertMsg "问题列表还是空的，请填点东西进去吧~","error",3
                    return false
                else
                    if nowScoreManager.scoreArray.length <= 0
                        window.alertMsg "分数还没有进行分段哦……","error",3
                        return false
                    else
                        return yes
        
        


getCookies = ()->
    window.shenye_public = null
    window.shenye_private = null
    cookieArray = document.cookie.split ";"
    for item,index in cookieArray
        itemTemp = item.replace(" ","").split "="
        if itemTemp[0] == "shenye_private"
            window.shenye_private = itemTemp[1]
        if itemTemp[0] == "shenye_public"
            window.shenye_public = itemTemp[1]
        
    console.log window.shenye_public,window.shenye_private    
        
checkNewOrEdit = ()->
    #check url to select pattern
    urlPara = window.location.search
    console.log urlPara,"urlPara"
    if urlPara.indexOf("isedit=1") >= 0
        console.log "edit page"
        window.isedit = yes
        createClassed yes
    else
        console.log "new page"
        window.isedit = no
        window.dataJson = {}
        createClassed no

createClassed = (isedit)->
    if isedit
        console.log "caonima"
        console.log "window.dataJson",window.dataJson
        if typeof(window.dataJson) != 'undefined'
            nowQueAdder = new queAdder()
            nowQueLister = new queLister window.dataJson["queData"]
            nowScoreManager = new scoreManager window.dataJson["scoreArray"]
            nowTextDataManager = new textDataManager window.dataJson
        else
            console.log "error!!! no dataJson found!!!"

    else
        console.log "fuckuou"
        nowQueAdder = new queAdder()
        nowQueLister = new queLister null
        nowScoreManager = new scoreManager null
        nowTextDataManager = new textDataManager null
        

jQuery(document).ready ->

    getCookies()
    checkNewOrEdit()

    ansListData = [
        {
            title: "标题1"
            answerList:[
                "答案1"
                "答案2"
                "答案3"
                "答案4"
            ]
            rightIndex:2
        }
        {
            title: "标题2"
            answerList:[
                "答案1"
                "答案2"
                "答案3"
                "答案4"
            ]
            rightIndex:1
        }
        {
            title: "标题3"
            answerList:[
                "答案1"
                "答案2"
                "答案3"
                "答案4"
            ]
            rightIndex:0
        }
        {
            title: "标题4"
            answerList:[
                "答案1"
                "答案2"
                "答案3"
                "答案4"
            ]
            rightIndex:2
        }
        {
            title: "标题5"
            answerList:[
                "答案1"
                "答案2"
                "答案3"
                "答案4"
            ]
            rightIndex:1
        }
       
    ]

    scoreArray = [
        {
            score:59
            comment:"我在【是不是华科人】中挂科了！被判为武大来的卧底…快来解救我！"
        }
        {
            score:75
            comment:"我在【是不是华科人】中发现好多事儿现在都忘了，来帮帮我吧！"
        }
        {
            score:85
            comment:"我在【是不是华科人】知道华科的事儿还真不是一般的多！"
        }
        {
            score:99
            comment:"我在【是不是华科人】中差一点满分！请叫我华科大百科！"
        }
        {
            score:100
            comment:"我在【是不是华科人】中得了满分,比根叔都高,简直可以当校长了！"
        }
    ]


    console.log "ready"
    




















