var search_dialog=new mdui.Dialog('#search_dialog',{overlay: false});
function search(file){
    var text=document.getElementById("search_input").value.toLowerCase();
    document.getElementById("search_result").innerHTML="";
    var xhr=new XMLHttpRequest();
    xhr.open('GET',file,true);
    xhr.onreadystatechange=function(){
        document.getElementById('loading-progress').hidden=0;
        mdui.mutation();
        if(xhr.readyState==4){
            document.getElementById('loading-progress').hidden=1;
            data=JSON.parse(this.responseText);
            for(i in data){
                var f=0;
                if(data[i].title.toLowerCase().indexOf(text)!=-1)f=1;
                else if(data[i].text.toLowerCase().indexOf(text)!=-1)f=1;
                else for(j in data[i].tags)if(data[i].tags[j].toLowerCase().indexOf(text)!=-1){f=1;break;}
                if(f)document.getElementById("search_result").innerHTML+="<a href="+data[i].link+" class='mdui-list-item'><div class='mdui-list-item-content'><div class='mdui-list-item-title'>"+data[i].title+"</div><div class='mdui-list-item-text'>"+data[i].text.substr(0,50).replace(/</g,"&lt;")+"</div></div></a>";
            }
            search_dialog.handleUpdate();
        }
    }
    xhr.send();
}