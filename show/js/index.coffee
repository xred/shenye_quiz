weixinData = {
                "img_url": "http://42.120.22.130/mediax/husttest/img/summary.png",
                "img_width": "120",
                "img_height": "120",
                "link": "http://42.120.22.130/mediax/husttest/",
                "desc": "",#经过测试，该值没用 By smallerpig
                "title": ""
            }

do ()->
    onBridgeReady = ()->
        WeixinJSBridge.on 'menu:share:timeline',(argv)->
            WeixinJSBridge.invoke 'shareTimeline',weixinData,()->
    if document.addEventListener
        document.addEventListener 'WeixinJSBridgeReady',onBridgeReady,false
    else if document.attachEvent
        document.attachEvent 'WeixinJSBridgeReady',onBridgeReady
        document.attachEvent 'onWeixinJSBridgeReady',onBridgeReady

defaultShareTitle = '我在参加华科人鉴定考试！我不是武大的！你也来试试！'
weixinData.title = defaultShareTitle
weixinData.desc = defaultShareTitle

class infoManager
    constructor: (dataJson)->
        @dataJson = dataJson
        #init html eles
        jQuery("#queTitle").html @dataJson["queTitle"]
        jQuery("#startText").html @dataJson["startText"]

        footerTextHolder = jQuery "#footerText"
        footerText = dataJson["footerText"].replace " ",""
        if footerText == ""
            footerTextHolder.hide()
        else
            footerTextHolder.html footerText
        

class uniqueQuestion
    constructor: (dataJson) ->
        #ele
        @startDiv
        @endDiv
        @queDiv
        @queList

        #btn
        @btnStart

        #data
        @dataJson = dataJson
        @dataArray = dataJson['queData']
        @scoreArray = dataJson['scoreArray']
        @fullScore = dataJson['fullScore']
        @score = 0
        @nowQueIndex = 0
        @answerArray = []

        @averageScore

        @init()

    init:()->
        @startDiv = jQuery ".cBodyStart"
        @endDiv = jQuery ".cBodyEnd"
        @queDiv = jQuery ".cBodyQue"
        @queList = jQuery "#queList"

        #pro
        @progressHolder = jQuery ".queProgress"
        @progress = jQuery "#queProgress"


        #count avgScore
        @averageScore = @fullScore/(@dataArray.length)
        console.log @averageScore

        jQuery("#btn-start").click =>
            @startDiv.hide()
            @progressHolder.fadeIn()
            @startAnswer()

    startAnswer:()->
        @nowQueIndex = -1
        @changeQue()
    
    getWordByIndex:(index)->
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


    setProgress: ()->
        nowProgress = (@nowQueIndex)/@dataArray.length
        nowProgress = "#{parseInt(100*nowProgress)}%"
        @progress.css "width",nowProgress
        @progress.html nowProgress

    createQueDiv:()->
        @setProgress()
        nowDataJson = @dataArray[@nowQueIndex]
        title = nowDataJson['title']
        titleStr = "#{@nowQueIndex+1}. #{title}"
        queHtml = "<div class='title'>
                    #{titleStr}
                    </div>
                <ul id='queList'>"

        #create list
        answerListArray = nowDataJson['answerList']

        for item,index in answerListArray
            nowWord = @getWordByIndex index
            liHtml = "<li><span>#{nowWord}. #{item}</span></li>"
            queHtml += liHtml

        queHtml += '</ul>'
        @queDiv.hide()
        @queDiv.html queHtml
        @queDiv.fadeIn()
        @addEvent()
    ifRightChoice:(choiceIndex)->
        nowdatajson = @dataArray[@nowQueIndex]
        console.log choiceIndex,nowdatajson['rightIndex']
        if nowdatajson['rightIndex'] == choiceIndex
            return yes
        else
            return no
        
    addEvent:()->
        @queList = jQuery "#queList li"
        console.log @queList,"quelist"
        _this = this
        
        @queList.click ->
            nowEle = jQuery this
            nowIndex = nowEle.index()
            _this.answerArray.push nowIndex
            nowEle.addClass "active"
            console.log nowIndex,'nowIndex'
            if _this.ifRightChoice nowIndex
                _this.score += _this.averageScore
            else
                console.log "wrong choice!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            console.log _this.score
            setTimeout (->
                _this.changeQue())
                ,40
            #_this.changeQue()
            
    changeQue:()->
        if @nowQueIndex < @dataArray.length-1
            console.log "nowQueIndex",@nowQueIndex
            @nowQueIndex++
            @createQueDiv()
        else
            console.log @score,"score!!!!!!!!!!!!!!!!!!!!!!!!!!"
            console.log "finish"
            @endAnswer()

    getcommentIndex: (nowIndex)->
        nowItem = @scoreArray[nowIndex]
        console.log @score,nowIndex,nowItem
        if @score > nowItem['score']
            return @getcommentIndex (nowIndex+1)
        else
            return nowIndex
        
    getCommentByScore:()->
        commentIndex = 0
        commentIndex = @getcommentIndex commentIndex
        console.log commentIndex
        comment = @scoreArray[commentIndex]['comment']
        console.log comment
        return comment

    endAnswer:()->
        comment = @getCommentByScore()
        #comment = ''
        @score = parseInt @score

        endText = @dataJson['endText']
        accountBtnText = @dataJson["accountBtnText"]
        accountBtnHref = @dataJson["accountBtnHref"].replace " ",""

        endHtml = "<div class='score-holder'>
                    <span id='score'>#{@score}分</span>
                </div>
                <div class='infos'>
                    <div>
                        <b>详细分析:</b>
                    </div>
                    <p id='comment'>
                    #{comment}
                    </p>
                    <p>
                        #{endText}
                    </p>
                    <a class='btn btn-lg btn-success' id='btn-share' onclick='showGuide();'>邀请小伙伴一起玩</a>
                        "

        if accountBtnHref != ""
            endHtml +=  "<a class='btn btn-lg btn-danger' id='btn-share' href=#{accountBtnHref}'>#{accountBtnText}</a>"
        
        endHtml += "</div>"
        @queDiv.hide()
        @progressHolder.hide()
        @startDiv.hide()
        @endDiv.append endHtml
        @endDiv.fadeIn()

        weixinData.title = @score+"分! "+comment
        weixinData.desc = @score+"分! "+comment

jQuery(document).ready ->
    
    console.log "ready"
    window.nowUQ = new uniqueQuestion window.nowdatajson
    nowIM = new infoManager window.nowdatajson

    joinEm = jQuery ".joinPeople em"

    joinEm.html "超过20万"

    window.hideGuide = ()->
        theGuidePage = jQuery "#share-guide"
        theGuidePage.hide()
    window.showGuide= ()->
        theGuidePage = jQuery "#share-guide"
        theGuidePage.show()







