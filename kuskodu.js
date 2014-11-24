//load JSON from url
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
  var paginator  = window.paginator = {
    settings: {
      itemsPerPage: 12,           
      actualPage : 1, 
      actualItem: 0,
      actualLastItem: 12,
      numberOfPages: 0,
      container: "container"
    },

    // save data to this.data, init pagination and render articles
    init:function(data){
      this.data = data;
      this.settings.numberOfPages = Math.ceil(this.data.length / this.settings.itemsPerPage);
      this.renderArticles(paginator.data);
      this.paginate();
    },

    // hide/show previous/next button, render pagination
    paginate: function() {
      document.getElementById("pages").innerHTML = "";
      if (paginator.settings.actualPage === 1) {
        document.getElementById("previous").style.display = "none";
      }
      else {
        document.getElementById("previous").style.display = "inline";
      }
      if (paginator.settings.actualPage === paginator.settings.numberOfPages) {
        document.getElementById("next").style.display = "none";
      }
      else {
        document.getElementById("next").style.display = "inline";
      }
      paginator.renderPagination(JSONObject); 
    },

    renderArticles : function() {
      var i;   
      var fragment = document.createDocumentFragment();   
      for(i=this.settings.actualItem; i<this.settings.actualLastItem; i++) {
        var article = document.createElement("article");      
        article.id = i;
        var div = document.createElement("div");              
        div.className = "play-container";

        var p = document.createElement("p");                  
        p.textContent = this.data[i].title;   

        var img_play = document.createElement("img");         
        img_play.className = "play";
        img_play.src = "play.png";

        var img_placeholder = document.createElement("img");  
        img_placeholder.className = "placeholder";
        img_placeholder.src = "placeholder.jpg";

        var h1 = document.createElement("h1");                         
        h1.textContent = this.data[i].title; 

        var time = document.createElement("time");   
        time.datetime = this.data[i].timestamp;
        time.textContent = paginator.show_time(this.data[i].timestamp);  

        article.appendChild(div); 
        div.appendChild(p);
        div.appendChild(img_play);
        div.appendChild(img_placeholder);
        article.appendChild(h1);
        article.appendChild(time);

        fragment.appendChild(article);
      }
      document.getElementById(this.settings.container).appendChild(fragment); 
      this.paginate();     
    },

    renderPagination : function() {
      for (var i = 1; i < this.settings.numberOfPages + 1; i++) {
        var a = document.createElement("a");   
        a.href= "#";
        a.textContent = i;
        a.id = "page" + i;
        document.getElementById('pages').appendChild(a);
      }
    },

    show_time: function(date) {
      date = parseInt(date);
      var d = new Date(date);
      return d.toDateString();
    },

    nextPage: function() {
      paginator.settings.actualPage++;
      document.getElementById("container").innerHTML = "";
      if ((paginator.settings.actualLastItem + paginator.settings.itemsPerPage) > paginator.data.length) {
        var lastPage = paginator.data.length - paginator.settings.actualLastItem;
        paginator.settings.actualLastItem += lastPage;
        console.log(paginator.settings.actualLastItem);
      }
      else {
        paginator.settings.actualLastItem += paginator.settings.itemsPerPage;
      }
      paginator.settings.actualItem += paginator.settings.itemsPerPage;
      console.log(paginator.settings.actualItem);
      paginator.renderArticles(paginator.data);
    },

    previousPage: function() {
      paginator.settings.actualPage--;
      document.getElementById("container").innerHTML = "";
      console.log(paginator.data.length);
      if (paginator.settings.actualLastItem === paginator.data.length) {
        var lastPage = paginator.settings.actualLastItem - paginator.settings.actualItem;
        paginator.settings.actualLastItem -= lastPage;
      }
      else {
        paginator.settings.actualLastItem -= paginator.settings.itemsPerPage; 
      }
      paginator.settings.actualItem -= paginator.settings.itemsPerPage;
      paginator.renderArticles(paginator.data);
    }
  }
} (window, document))

load("http://academy.tutoky.com/api/json.php", paginator.init.bind(paginator));

document.getElementById("next").addEventListener("click", paginator.nextPage);
document.getElementById("previous").addEventListener("click", paginator.previousPage);