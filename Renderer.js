var Renderer = function(that) {
  var i;   
  var fragment = document.createDocumentFragment(); 
  
  for(i = that.actualItem; i < that.actualLastItem; i++) {
    var article = document.createElement("article");
    var div = document.createElement("div");
    div.className = "play-container";

    var div_hover = document.createElement("div");    
    div_hover.className = "overlay";
    var p_categories = document.createElement("p");
    
    var categories = (that.filteredData[i].categories).toString();
    categories = categories.replace(/,/g , ", ");
    if (categories === "") {
      categories = "no category";
    }
    p_categories.textContent = "Categories: " + categories; 

    var img_play = document.createElement("img");
    img_play.className = "play";
    img_play.src = "playbutton.png";

    var img_placeholder = document.createElement("img");
    img_placeholder.className = "placeholder";
    img_placeholder.src = "placeholder.jpg";

    var h2 = document.createElement("h2");                         
    h2.textContent = that.filteredData[i].title; 

    var time = document.createElement("time");   
    time.datetime = that.filteredData[i].timestamp;
    time.textContent = this.renderTime(that.filteredData[i].timestamp);

    article.appendChild(div); 
    article.appendChild(div_hover);
    div.appendChild(img_play);
    div.appendChild(img_placeholder);
    article.appendChild(h2);
    article.appendChild(time);
    
    var fav_span = document.createElement("span");
    var img_fav = document.createElement("img");

    var fav_length = that.favorites.items.length;
    var fav_set = false;
    for (var j = 0; j < fav_length; j++) {
      if (that.favorites.items[j] === that.filteredData[i].title) {         
        img_fav.src = "fav_set.png";
        fav_set = true;
      }
    }
    if (!fav_set) {
      img_fav.src = "fav_blank.png";
    };

    img_fav.className = "favorites";
    img_fav.setAttribute("data_name", that.filteredData[i].title);

    var fav = new Favorites;
    img_fav.addEventListener("click", fav.changeFavorites.bind(that));

    fav_span.appendChild(img_fav);
    article.appendChild(fav_span);

    // div_hover.appendChild(p_fav);
    div_hover.appendChild(p_categories);

    fragment.appendChild(article);    // save article to document fragment
  }
  // div_videos.appendChild(fragment);
  document.getElementById(that.settings.container).appendChild(fragment);   // load all articles from document fragment
  new Pagination(that.filteredData, that);    
};

// parse date from json timestamp to readable output
Renderer.prototype.renderTime = function(date) {
  date = parseInt(date);
  var d = new Date(date);
  return d.toDateString();
};

// render categories names and header
Renderer.prototype.renderCategories = function(that) {
  var output = [];
  var fDataLength = that.filteredData.length;
  for (var i = 0; i < fDataLength; i++) {
    for (var j = 0; j < that.filteredData[i].categories.length; j++) {
      output.push(that.filteredData[i].categories[j]);
    }
  }
  var unique = output.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
  
  var fragment = document.createDocumentFragment(); 
  var li_all = document.createElement("li");
  var a_all = document.createElement("a");
  li_all.appendChild(a_all);
  a_all.setAttribute("cat-id","all");
  a_all.href = "#";
  a_all.textContent = "All categories";
  var li_fav = document.createElement("li");
  var a_fav = document.createElement("a");
  li_fav.appendChild(a_fav);
  a_fav.setAttribute("cat-id","fav");
  a_fav.href = "#";
  a_fav.textContent = "Favorites";
  fragment.appendChild(li_all);
  fragment.appendChild(li_fav);

  var unique_length = unique.length;
  for (i = 0; i < unique_length; i++) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#";
    a.setAttribute("cat-id", unique[i]);
    // a.id = unique[i];
    a.textContent = unique[i];
    li.appendChild(a);
    fragment.appendChild(li);
  }
  document.getElementById(that.settings.categories).appendChild(fragment);
};
