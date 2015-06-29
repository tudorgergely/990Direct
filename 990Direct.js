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
  if ($('#html5_b').length === 0 && currentLink.includes('/3/')) {
    window.location.href = currentLink.replace('/3/', '/1/');
  }

  var player1 = $('#jw6'),
      player2 = $('#jw5'),
      html5   = $('#html5');

  var player = html5,
      topbar = $('.hline');

  if (player.length === 0) {
    player = player2;
  }

  if (player.length === 0) {
    player = player1;
  }

  $('.all').remove();
}

if (currentLink.includes("/video/")) {
  removeSuperwebMenu();
} else if (currentLink.includes("seriale2-") || currentLink.includes("filme-")) {
  matchSfastLinks();
} 

