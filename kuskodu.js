function load(url, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = ensureReadiness;

  function ensureReadiness() {
    if(xhr.readyState < 4) {
      return;
    }
    if(xhr.status !== 200) {
      return;
    }
    // all is well 
    if(xhr.readyState === 4) {
      JSONObject = JSON.parse(xhr.responseText);
      callback(JSONObject);
    }          
  }
  xhr.open('GET', url, true);
  xhr.send('');
}

(function(window,document,undefined) {
  'use strict';
  var init  = window.init = {
    actualPage : 1, 
    actualItem: 0,
    actualLastItem: 12,
    paginationInit: 0, 
    data:function(data){
      init.Json = data;
      init.loadJSON(init.Json);
    },
    loadJSON : function(JSONObject) {
      var i;      
      for(i=init.actualItem; i<init.actualLastItem; i++) {
        var div_wrapper = document.createElement("div");
        div_wrapper.id = "wrapper";

        var article = document.createElement("article");      // zaciatok article
        article.id = i;
        var div = document.createElement("div");              // div play-container
        div.className = "play-container";

        var p = document.createElement("p");                    // p - hover text
        p.textContent = JSONObject[i].title;   

        var img_play = document.createElement("img");           // img src="play.png"  
        img_play.className = "play";
        img_play.src = "play.png";

        var img_placeholder = document.createElement("img");    //img src="placeholder.jpg"
        img_placeholder.className = "placeholder";
        img_placeholder.src = "placeholder.jpg";

        var h1 = document.createElement("h1");                         
        h1.textContent = JSONObject[i].title; 

        var time = document.createElement("time");   
        time.datetime = JSONObject[i].timestamp;
        time.textContent = init.show_time(JSONObject[i].timestamp);  

        div_wrapper.appendChild(article);
        article.appendChild(div); 
        div.appendChild(p);
        div.appendChild(img_play);
        div.appendChild(img_placeholder);
        article.appendChild(h1);
        article.appendChild(time);

        document.getElementById('container').appendChild(article);
      }
      if (init.paginationInit === 0) {
        init.pagination(JSONObject);
        init.paginationInit = 1;
        // for (i=0; i<12; i++) {
        //   document.getElementById(i).style.display = "inline-block";
        // }
      }
    },
    pagination : function(JSONObject) {
      var numberOfPages = JSONObject.length / 12;
      for (var i=1; i<numberOfPages+1; i++) {
        var a = document.createElement("a");   
        a.href= "#";
        a.textContent = i;
        document.getElementById('pages').appendChild(a);
      }
    },
    show_time: function(date) {
      date = parseInt(date);
      var d = new Date(date);
      
      return d.toDateString();
    },
    nextPage: function() {
      init.actualPage++;
      console.log(init.actualPage);
      var numberOfPages = JSONObject.length / 12;
      if(init.actualPage === numberOfPages.length) {
        document.getElementById("next").style.display = "none";
      }
      var elem = document.getElementById("wrapper");
      elem.parentNode.removeChild(elem);
      // for (var i = init.actualItem; i < init.actualLastItem; i++) {
      //   document.getElementById(i).style.display = "none";
      // }
      init.actualItem += 12;
      init.actualLastItem += 12;
      
      init.loadJSON(init.Json);
    },

    previousPage: function() {
      init.actualPage--;
      console.log(init.actualPage);
      if(init.actualPage === 1) {
        document.getElementById("previous").style.display = "none";
      }
        for (var i = init.actualItem; i < init.actualLastItem; i++) {
          document.getElementById(i).style.display = "none";
        }
        init.actualItem -= 12;
        init.actualLastItem -= 12;
        
        init.loadJSON(init.Json);
    }
  }
} (window, document))

load("http://academy.tutoky.com/api/json.php", init.data);
document.getElementById("next").addEventListener("click", init.nextPage);
document.getElementById("previous").addEventListener("click", init.previousPage);