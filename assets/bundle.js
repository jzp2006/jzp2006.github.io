document.onreadystatechange=function(){
    theme("chk");
}
window.onload=onloadf;
function onloadf(){
    theme("chk");
    document.getElementById('loading-progress').hidden=1;
    loadImages=lazyload();loadImages();
    window.addEventListener('scroll',loadImages,false);
    page_typ=document.getElementById('page_typ').innerHTML;
    drawer=new mdui.Drawer('#drawer');
    if(page_typ=='index'){
        document.getElementById('toc_button').hidden=1;
        document.getElementById('toc_drawer').hidden=1;
        var md_in=document.getElementsByClassName("md_in"),
            md_out=document.getElementsByClassName("md_out");
        for(var i=0;i<md_in.length;++i)
            md_out[i].innerHTML=marked(md_in[i].value.replace('/#/g',''));
        if(document.body.clientWidth>=992)drawer.open();
    }else
    if(page_typ=='article'){
        if(document.getElementById("md_source")&&document.getElementById("md_out"))
            md_turn("md_source","md_out"),gentoc("md_out");
        if(document.getElementById('vcomments')){
            var val=JSON.parse(document.getElementById('vcomments').innerHTML);
            if(val)new Valine({el: '#comments',placeholder: val.placeholder,appId: val.appid,appKey: val.appkey,path: document.location.pathname});
        }
        toc_drawer=new mdui.Drawer('#toc_drawer');
        document.getElementById('toc_button').hidden=0;
        document.getElementById('toc_drawer').hidden=0;
        drawer.close();
        var avatarurl="{%AVATAR%}",url=window.location.href,x;
        if(avatarurl.indexOf("http")==-1)avatarurl="http://"+window.location.host+avatarurl;
        x=document.getElementById("share_weibo")
        x.href=x.href.replace("_url_",url).replace("_avatar_",avatarurl);
        x=document.getElementById("share_qq");
        x.href=x.href.replace("_url_",url).replace("_avatar_",avatarurl);
        x=document.getElementById("share_twitter");
        x.href=x.href.replace("_url_",url);
    }
}
document.onkeydown=function(e){
    var keyCode=e.keyCode||e.which||e.charCode;
    var ctrlKey=e.ctrlKey||e.metaKey;
    if(ctrlKey){
        if(keyCode==39)document.getElementById('nxt_button').click()
        if(keyCode==37)document.getElementById('pre_button').click()
    }
}
function pjax_on(typ=0){
    var pjax=new Pjax({elements: "a",selectors: ["#TOC",".mdui-container"]});
    document.addEventListener('pjax:send',function(){document.getElementById('loading-progress').hidden=0;});
    document.addEventListener('pjax:complete',function(){document.getElementById('loading-progress').hidden=1;onloadf();mdui.mutation();});
    if(typ==0)mdui.snackbar({
        message: 'pjax已开启',
        buttonText: '刷新以撤销',
        onButtonClick: function(){window.location.reload()},
        timeout: 2000
      });
    if(typ==1)mdui.snackbar({message: '开启音乐默认开启pjax',timeout: 2000});
    document.getElementById('pjax_button').hidden=1;
}
var timeOut,speed=0;
window.onscroll=function(){
    if(document.documentElement.scrollTop>=300)document.getElementById("totop").classList.remove("mdui-fab-hide");
    else document.getElementById("totop").classList.add("mdui-fab-hide");
}
function totop(){
    if(document.body.scrollTop!=0||document.documentElement.scrollTop!=0){
        window.scrollBy(0,-(speed+=20));
        timeOut=setTimeout('totop()',20);
    }
    else clearTimeout(timeOut),document.getElementById("totop").classList.add("mdui-fab-hide"),speed=0;
}

function getCookie(cname){
    var name=cname+"=",decodedCookie=decodeURIComponent(document.cookie),ca=decodedCookie.split(';'),c;
    for(i in ca){
        c=ca[i];
        while(c.charAt(0)==' ')c=c.substring(1);
        if(c.indexOf(name)==0)return c.substring(name.length, c.length);
    }return "";
}
function setCookie(cname,cval,exdays=0.5){
    if(getCookie(cname)==cval)return;
    var d=new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires="expires="+d.toUTCString();
    document.cookie=cname+"="+cval+";"+expires+";path=/";
}
function theme_night(){
    document.querySelector('html').classList.add("mdui-theme-layout-dark");
    document.querySelector('body').classList.add("mdui-theme-layout-dark");
    var node=document.getElementById('theme_css'),
        hl=document.createElement('link'),t=document.createElement('link');
    hl.href="/assets/nord.min.css";
    hl.type='text/css';
    hl.rel='stylesheet';
    node.appendChild(hl);
    t.href="/assets/theme_night.css";
    t.type='text/css';
    t.rel='stylesheet';
    node.appendChild(t);
}
function theme_pink(){
    setCookie("theme","pink");
    var hl=document.createElement('link');
    hl.href="/assets/theme_pink.css";
    hl.type='text/css';
    hl.rel='stylesheet';
    document.getElementById('theme_css').appendChild(hl);
}
function theme_blue(){
    setCookie("theme","blue");
    var hl=document.createElement('link');
    hl.href="/assets/theme_blue.css";
    hl.type='text/css';
    hl.rel='stylesheet';
    document.getElementById('theme_css').appendChild(hl);
}
function theme_clr(){
    document.getElementById("theme_css").innerHTML="";
    node=document.querySelector('html');
    if(node.classList.contains("mdui-theme-layout-dark"))
        node.classList.remove("mdui-theme-layout-dark");
    node=document.querySelector('body');
    if(node.classList.contains("mdui-theme-layout-dark"))
        node.classList.remove("mdui-theme-layout-dark");
}
function theme(typ){
    if(typ=="chk")typ=getCookie("theme");
    if(typ=="day")setCookie("theme","day"),theme_clr();
    if(typ=="pink")setCookie("theme","pink"),theme_clr(),theme_pink();
    if(typ=="blue")setCookie("theme","blue"),theme_clr(),theme_blue();
    if(typ=="night")setCookie("theme","night"),theme_clr(),theme_night();
}

function MD_TURN(text){
    var list=text.split("$$"),res="",latex=[],tot=0;
    for(i in list){
        if(i&1)res+='$$',latex[++tot]=katex.renderToString(list[i],{displayMode:true});
        else{
            var LIST=list[i].split('$');
            for(j in LIST){
                if(j&1)res+='$$',latex[++tot]=katex.renderToString(LIST[j]);
                else res+=LIST[j];
            }
        }
    }
    res=marked(res);
    RES="";
    for(i=0,j=0;i<res.length;++i)
        if(res[i]=='$'&&res[i+1]=='$')++i,RES+=latex[++j];
        else RES+=res[i];
    return RES;
}
function md_turn(input,output){
    document.getElementById(output).innerHTML=MD_TURN(document.getElementById(input).value.trim());
    document.querySelectorAll('pre code').forEach((block)=>{hljs.highlightBlock(block);});
    document.querySelectorAll('pre').forEach((x)=>{
        var t=document.createElement("div"),tmp=x.innerHTML;
        if(x.innerText.split('\n').length>25){
            t.innerHTML="<details><summary>查看代码</summary><pre>"+tmp+"</pre></details>";
            x.replaceWith(t);
        }
    });
    hljs.initCopyButtonOnLoad();
    hljs.initLineNumbersOnLoad();
    mdui.mutation();
}

function gentoc(id){
    var toc=document.getElementById("toc"),
        content=document.getElementById(id),
        item=content.firstElementChild,
        secondtoc,thirdtoc;
    toc.innerHTML="";
    while(item){
        if(item.tagName=='H1'){
            var catalogA = document.createElement("a");
            catalogA.textContent=item.textContent;
            catalogA.href='#'+item.id;
            secondtoc=document.createElement("ul");
            var catalogLi=document.createElement("li");
            catalogLi.classList.add("mdui-text-truncate");
            catalogLi.style.marginBottom = "16px";
            catalogLi.appendChild(catalogA);
            catalogLi.appendChild(secondtoc);
            toc.appendChild(catalogLi);
        }
        else if(item.tagName=='H2'){
            if(!secondtoc){
                secondtoc=document.createElement("ul");
                toc.appendChild(secondtoc);
            }
            var catalogA=document.createElement("a");
            catalogA.textContent=item.textContent;
            catalogA.href='#'+item.id;
            thirdtoc=document.createElement("ul");
            var catalogLi=document.createElement("li");
            catalogLi.classList.add("mdui-text-truncate");
            catalogLi.appendChild(catalogA);
            catalogLi.appendChild(thirdtoc);
            secondtoc.appendChild(catalogLi);
        }
        else if(item.tagName=='H3'){
            if(!thirdtoc){
                thirdtoc=document.createElement("ul");
                toc.appendChild(thirdtoc);
            }
            var catalogA=document.createElement("a");
            catalogA.textContent=item.textContent;
            catalogA.href='#'+item.id;
            var catalogLi=document.createElement("li");
            catalogLi.classList.add("mdui-text-truncate");
            catalogLi.appendChild(catalogA);
            thirdtoc.appendChild(catalogLi);
        }
        item=item.nextElementSibling;
        if(!item)break;
    };
}

function copylink(){
    var x=document.createElement("p"),url=window.location.href,selection=window.getSelection(),range=document.createRange();selection.removeAllRanges();
    x.innerHTML=url;x.id="share_copy_link";document.body.appendChild(x);
    range.selectNodeContents(document.getElementById('share_copy_link'));selection.addRange(range);
    document.execCommand('copy');selection.removeAllRanges();x.remove();mdui.snackbar({message: "复制成功!",position: "top"});
}

function lazyload(){
    var images=document.getElementsByTagName('img'),
        len=images.length,
        n=0;
    return function(){
        var seeHeight=document.documentElement.clientHeight,
            scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        for(;n<len;++n)
        if(images[n].offsetTop<seeHeight+scrollTop){
            var datasrc=images[n].getAttribute('data-src');
            if(datasrc!=null&&images[n].src!=datasrc)
                images[n].src=images[n].getAttribute('data-src');
        }
        else break;
    }
}