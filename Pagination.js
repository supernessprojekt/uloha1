// hide/show previous/next button, render pagination
var Pagination = function(data, that) {
  if (that.paginationShowed === false) {
    var show_dots = false;    // variable for checking if dots between pages were already shown
    var fragment = document.createDocumentFragment(); 
    that.settings.numberOfPages = Math.ceil(that.data.length / that.settings.itemsPerPage);

    var a_previous = document.createElement("a");
    a_previous.className = "previous";
    a_previous.href = "#";
    a_previous.onclick = "previousPage()";
    a_previous.textContent = "< PREVIOUS";
    a_previous.setAttribute("data_page", "previous");
    fragment.appendChild(a_previous);

    var div = document.createElement("div");
    div.id = "pages";

    var fragment_pages = document.createDocumentFragment(); 
    // for loop for page numbers
    for (var i = 1; i < that.settings.numberOfPages + 1; i++) {
      var a = document.createElement("a");
      a.href = "#";
      a.textContent = i;
      a.setAttribute("data_page", i);
      div.appendChild(a);
      fragment_pages.appendChild(a);
      if (i === 1) {
        var dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "dots1";
        fragment_pages.appendChild(dots);
      };
      if (i == that.settings.numberOfPages - 1) {
        var dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "dots2";
        fragment_pages.appendChild(dots);
      };
    }
    div.appendChild(fragment_pages);
    fragment.appendChild(div);

    var a_next = document.createElement("a");
    a_next.className = "next";
    a_next.href = "#";
    a_next.textContent = "NEXT >";
    a_next.setAttribute("data_page", "next");
    fragment.appendChild(a_next);

    var loadMore = document.createElement("div");
    loadMore.className = "loadMore";
    loadMore.setAttribute("data_page", "loadMore");
    loadMore.textContent = "LOAD MORE";
    fragment.appendChild(loadMore);

    document.getElementById(that.settings.navigation).addEventListener("click", that.eventHandler.bind(that));
    document.getElementById(that.settings.navigation).appendChild(fragment);

    that.paginationShowed = true;
  }

  for (var i = 1; i < that.settings.numberOfPages + 1; i++) {
    var aTarget = that.navRoot.querySelector('[data_page="'+i+'"]');
    if (i === 1 || i === that.settings.numberOfPages || (i < that.actualPage + 2 && i > that.actualPage - 2)) {
      aTarget.style.display = "inline";
    }
    else {
      aTarget.style.display = "none";
    } 
    if (that.actualPage === i) {
      aTarget.className = "active-page";
    }
    else {
      aTarget.className = "";
    }
  }

  var dots1 = that.navRoot.getElementsByClassName("dots1")[0];
  if (that.actualPage > 3) {
    dots1.style.display = "inline";
  }
  else {
    dots1.style.display = "none";
  }
  var dots2 = that.navRoot.getElementsByClassName("dots2")[0];
  if (that.actualPage > that.settings.numberOfPages - 3) {    
    dots2.style.display = "none";
  }
  else {
    dots2.style.display = "inline";
  }
  var previousPage = that.navRoot.getElementsByClassName("previous")[0];
  if (that.actualPage === 1) {
    previousPage.style.visibility = "hidden";
  }
  else {
    previousPage.style.visibility = "initial";
  }
  var nextPage = that.navRoot.getElementsByClassName("next")[0];
  if (that.actualPage === that.settings.numberOfPages) {
    nextPage.style.visibility = "hidden";
  }
  else {
    nextPage.style.visibility = "initial";
  }
};

Pagination.nextPage = function(that) {
  this.changePage(that.actualPage + 1, that);
};

Pagination.previousPage = function(that) {
  this.changePage(that.actualPage - 1, that);
};

// changes current page to number set in attribute 'page'
Pagination.changePage = function(page, that) {
  if (page > 0) {
    that.actualPage = page;
    that.actualItem = (page - 1) * that.settings.itemsPerPage;

    if (that.settings.numberOfPages === that.actualPage) {
      that.actualLastItem = that.filteredData.length;
    }
    else {
      that.actualLastItem = that.actualItem + that.settings.itemsPerPage;
    }
    new Renderer(that);
  }
};