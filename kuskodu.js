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
    option : function(JSONObject) {
      var item = "";
      var i;
      var body = "";
      for(i=0; i<12; i++) {
        var article = document.createElement("article");      // zaciatok article
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
        time.textContent = show_time(JSONObject[i].timestamp);  

        article.appendChild(div); 
        div.appendChild(p);
        div.appendChild(img_play);
        div.appendChild(img_placeholder);
        article.appendChild(h1);
        article.appendChild(time);

        document.getElementById('container').appendChild(article);
      }
    }
  }
} (window, document))

load("http://academy.tutoky.com/api/json.php", init.option);

show_time = function(date) {
  date = parseInt(date);
	var d = new Date(date);
	
	return d.toDateString();
}

// function pages(JSONObject) {
// 	var page = "";
// 	var output = "";
// 	var numberOfPages = JSONObject.length / 12;

// 	for (i=1; i<numberOfPages+1; i++) {
// 		page += '<a href="#">' + i + '</a>';
// 		output += page;
// 		page = "";
// 	}
// 	document.getElementById("pages").innerHTML = output;
// }

// videos.loadJSON();