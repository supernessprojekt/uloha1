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
  // 'use strict';
  var Paginator = function() { 
    var that = this; 
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.concretePage = this.concretePage.bind(this);
    this.filter = this.filter.bind(this);

    this.settings = {
      'itemsPerPage': 12,           
      'actualPage': 1,
      'actualItem': 0,
      'actualLastItem': 12,
      'numberOfPages': 0,
      'container': "container"
    }
  }

  // save data to Paginator.data, init pagination and render articles
  Paginator.prototype.init = function(data){
    Paginator.data = data;
    this.originalData = data;   // used when data array is overwritten by filter function
    this.renderArticles(paginator.data);
    this.paginate();
    this.showFilter();
  };

  // hide/show previous/next button, render pagination
  Paginator.prototype.paginate = function() {
    document.getElementById("pages").innerHTML = "";
    this.settings.numberOfPages = Math.ceil(Paginator.data.length / this.settings.itemsPerPage);
    if (this.settings.actualPage === 1) {
      document.getElementById("previous").style.visibility = "hidden";
    }
    else {
      document.getElementById("previous").style.visibility = "initial";
    }
    if (this.settings.actualPage === this.settings.numberOfPages) {
      document.getElementById("next").style.visibility = "hidden";
    }
    else {
      document.getElementById("next").style.visibility = "initial";
    }
    var show_dots = false;    // variable for checking if dots between pages were already shown
    // for loop for page numbers
    for (var i = 1; i < this.settings.numberOfPages + 1; i++) {
      // display page number if page is first, last, or if page is near actual page
      if (i === 1 || i === this.settings.numberOfPages || (i < this.settings.actualPage + 3 && i > this.settings.actualPage - 2)) {
        var a = document.createElement("a");   
        a.href = "#";
        a.textContent = i;
        a.setAttribute("data-page", i);
        if (this.settings.actualPage === i) {
          a.className = "active-page";
        }
        document.getElementById('pages').appendChild(a);
        show_dots = true;
      }
      // if page is not displayed, show dots between page numbers
      else {
        if (show_dots) {
          var dots = document.createElement("span");
          dots.textContent = "...";
          document.getElementById('pages').appendChild(dots);
          show_dots = false;
        }
      }
    }
  };

  // render articles on current page from json object, call paginate function
  Paginator.prototype.renderArticles = function() {
    console.log(Paginator.data);
    var i;   
    var fragment = document.createDocumentFragment(); 
    for(i = this.settings.actualItem; i < this.settings.actualLastItem; i++) {
      var article = document.createElement("article");      
      article.id = i;
      var div = document.createElement("div");              
      div.className = "play-container";

      var div_hover = document.createElement("div");    
      div_hover.id = "hover";
      var p_hover = document.createElement("p");
      p_hover.textContent = Paginator.data[i].title;  
      var p_categories = document.createElement("p");
      
      var categories = (Paginator.data[i].categories).toString();
      categories = categories.replace(/,/g , ", ")
      p_categories.textContent = categories; 

      var img_play = document.createElement("img");         
      img_play.className = "play";
      img_play.src = "playbutton.png";

      var img_placeholder = document.createElement("img");  
      img_placeholder.className = "placeholder";
      img_placeholder.src = "placeholder.jpg";

      var h2 = document.createElement("h2");                         
      h2.textContent = Paginator.data[i].title; 

      var time = document.createElement("time");   
      time.datetime = Paginator.data[i].timestamp;
      time.textContent = paginator.showTime(Paginator.data[i].timestamp);  

      article.appendChild(div); 
      article.appendChild(div_hover);
      div.appendChild(img_play);
      div.appendChild(img_placeholder);
      article.appendChild(h2);
      article.appendChild(time);
      div_hover.appendChild(p_hover);
      div_hover.appendChild(p_categories);

      fragment.appendChild(article);    // save article to document fragment
    }
    document.getElementById(this.settings.container).appendChild(fragment);   // load all articles from document fragment
    this.paginate();     
  };
  // this.renderArticles = renderArticles;
  // parse date from json timestamp to readable output
  Paginator.prototype.showTime = function(date) {
    date = parseInt(date);
    var d = new Date(date);
    return d.toDateString();
  };

  // render categories names in select
  Paginator.prototype.showFilter = function() {
    var output = [];
    for (var i = 0; i < Paginator.data.length; i++) {
      for (var j = 0; j < Paginator.data[i].categories.length; j++) {
        output.push(Paginator.data[i].categories[j]);
      }
    }
    var unique = output.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    
    var fragment = document.createDocumentFragment(); 
    for (i = 0; i < unique.length; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.id = unique[i];
      a.textContent = unique[i];
      li.appendChild(a);
      fragment.appendChild(li);
    }
    document.getElementById("categories").appendChild(fragment);
  };

  Paginator.prototype.nextPage = function() {
    document.getElementById(this.settings.container).innerHTML = "";
    this.settings.actualPage++;
    if ((this.settings.actualLastItem + this.settings.itemsPerPage) > Paginator.data.length) {
      var lastPage = Paginator.data.length - this.settings.actualLastItem;
      this.settings.actualLastItem += lastPage;
    }
    else {
      this.settings.actualLastItem += this.settings.itemsPerPage;
    }
    this.settings.actualItem += this.settings.itemsPerPage;
    document.getElementById(this.settings.container).innerHTML = "";
    this.renderArticles(this.data);
  };

  // "load more" button in mobile version
  Paginator.prototype.loadMore = function() {
    this.settings.actualPage++;
    if ((this.settings.actualLastItem + this.settings.itemsPerPage) > Paginator.data.length) {
      var lastPage = Paginator.data.length - this.settings.actualLastItem;
      this.settings.actualLastItem += lastPage;
    }
    else {
      this.settings.actualLastItem += this.settings.itemsPerPage;
    }
    this.settings.actualItem += this.settings.itemsPerPage;
    this.renderArticles(Paginator.data);
  };

  Paginator.prototype.previousPage = function() {
    document.getElementById(this.settings.container).innerHTML = "";
    this.settings.actualPage--;
    // document.getElementById("container").innerHTML = "";
    if (this.settings.actualLastItem === Paginator.data.length) {
      var lastPage = this.settings.actualLastItem - this.settings.actualItem;
      this.settings.actualLastItem -= lastPage;
    }
    else {
      this.settings.actualLastItem -= this.settings.itemsPerPage; 
    }
    this.settings.actualItem -= this.settings.itemsPerPage;
    this.renderArticles(Paginator.data);
  };

  Paginator.prototype.concretePage = function(event) {
    document.getElementById(this.settings.container).innerHTML = "";
    var a_target = event.target;
    var attribute = a_target.getAttribute("data-page");
    attribute = parseInt(attribute);
    if (attribute > 0) {    //check if event.target is a number
      this.settings.actualPage = attribute;
      this.settings.actualItem = (attribute - 1)  * this.settings.itemsPerPage;

      if (this.settings.numberOfPages === this.settings.actualPage) {
        this.settings.actualLastItem = Paginator.data.length;
      }
      else {
        this.settings.actualLastItem = this.settings.actualItem + this.settings.itemsPerPage;
      }
      this.renderArticles(Paginator.data);
    }
  };

  // filter articles by categories
  Paginator.prototype.filter = function(event) {
    var cat_target = event.target;
    var attribute = cat_target.getAttribute("id");
    if (attribute === "all") {
      Paginator.data = this.originalData;
      document.getElementById(this.settings.container).innerHTML = "";
      this.settings.actualPage = 1;
      this.settings.actualItem = 0;
      this.settings.actualLastItem = this.settings.itemsPerPage;
      this.renderArticles(Paginator.data);        
    }
    else if (attribute) {
      document.getElementById(this.settings.container).innerHTML = "";
      var output = [];
      for (var i = 0; i < this.originalData.length; i++) {
        for (var j = 0; j < this.originalData[i].categories.length; j++) {
          if (this.originalData[i].categories[j] === attribute) {
            output.push(this.originalData[i]);
          }
        }
      }
      Paginator.data = output;
      this.settings.actualPage = 1;
      this.settings.actualItem = 0;
      this.settings.actualLastItem = this.settings.itemsPerPage;
      this.renderArticles(Paginator.data);
    }
  };


  var paginator = new Paginator();
  load("http://academy.tutoky.com/api/json.php", paginator.init.bind(paginator));
  // pagination listeners
  document.getElementById("next").addEventListener("click", paginator.nextPage);
  document.getElementById("previous").addEventListener("click", paginator.previousPage);
  // "load more" button in mobile version
  document.getElementById("load").addEventListener("click", paginator.loadMore);
  document.getElementById("categories").addEventListener("click", paginator.filter);
  // listener for pages (1,2,3, etc...)
  document.getElementById("pages").addEventListener("click", paginator.concretePage);
  var links = document.getElementById("pages").getElementsByTagName("a");   // targets all page links in "div"
  
  window.onresize = resize;

  // this is not done yet
  function resize()
  {
    var width = window.innerWidth;
    if (width > 460) {
      document.getElementById(this.settings.container).innerHTML = "";
      paginator.renderArticles(paginator.data);
    }
  }
} (window, document))

