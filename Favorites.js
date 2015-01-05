var Favorites = function() {};

Favorites.prototype.init = function() {
  // save empty object to localStorage if it's null
  if (localStorage.getItem('favorites') === null) {
    localStorage['favorites'] = JSON.stringify({items: []});
  }
  return JSON.parse(localStorage['favorites'])
}

// set/remove item from localStorage and change "star" image
Favorites.prototype.changeFavorites = function(event) {
  var fav_target = event.target;
  var attr = fav_target.getAttribute("data_name");
  var fav_set = false;
  var fav_length = this.favorites.items.length;
  for (var i = 0; i < fav_length; i++) {
    if (this.favorites.items[i] === attr) {
      fav_set = true;
      this.favorites.items.splice(i, 1);
    };
  }
  if (fav_set === true) {      
    fav_target.setAttribute("src", "fav_blank.png");
  }
  else {
    this.favorites.items.push(attr);
    fav_target.setAttribute("src", "fav_set.png");
  }
  localStorage['favorites'] = JSON.stringify(this.favorites);
};

