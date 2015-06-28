var directRegex = /\/video\/.*\.html/g,
    currentLink = window.location.href;

var matchSfastLinks = function() {
  var link = $('a.link[href*="-sfast.html"]').attr("href");

  $.get(link, function(nextPage) {
    var newLink   = nextPage.match(directRegex).toString();

    newLink = 'http://superweb.rol.ro' + newLink.replace('/video/', '/video/3/');

    addDirectLink(newLink);
  });
}

var addDirectLink = function(link) {
  $('<a href=' + link + '>Link direct</a>').insertAfter('#content div:first');
}

var removeSuperwebMenu = function() {
  if ($('#html5_b').length > 0) {
    var player = $('#html5');
  } else if (currentLink.includes('/3/')) {
    window.location.href = currentLink.replace('/3/', '/1/');
  } else {
    var player = $('#jw6');
  }

  $('head').empty();
  $('body').empty();

  $('body').append(player);
}

if (currentLink.includes("/video/")) {
  removeSuperwebMenu();
} else if (currentLink.includes("seriale2-") || currentLink.includes("filme-")) {
  matchSfastLinks();
} 

