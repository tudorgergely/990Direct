var directRegex = /\/video\/.*\.html/g,
    currentLink = window.location.href;

var init = function() {
  chrome.storage.sync.set({ 'current': currentLink });
}

var getPageSync = function(link) {
  var page;

  $.ajax({
    url: link,
    type: 'get',
    dataType: 'html',
    async: false,
    success: function (nextPage) {
      page = nextPage;
    }
  });

  return page;
}

var matchSfastLinks = function(page) {
  var link = 'http://990.ro/' + $(page).find('a.link[href*="-sfast.html"]').attr('href'),
      finalLink;

  if (link !== undefined) {
    finalLink = getPageSync(link).match(directRegex).toString();
    finalLink = 'http://superweb.rol.ro' + finalLink.replace('/video/', '/video/3/');
    
    return finalLink;
  }

  return "";
}

var addDirectLink = function(link, text, upperElement, id) {
  if (link === '') {
    link = '#';
    text = 'Not available';
  }

  var element = '<a id="' + id + '" class="button-9" href="' + link + '">' + text + '</a>';
  $(element).insertAfter(upperElement);
}

var getCurrentLink = function() {
  var currentDirectLink = matchSfastLinks(getPageSync(currentLink));
  
  addDirectLink(currentDirectLink, 'Link direct', '#content div:first');
}

var prepPrev = function() {
  chrome.storage.sync.get('current', function(result) {
    var prev     = 'http://990.ro/' + $(getPageSync(result.current)).find('a.episode_nextprev:contains("Episodul anterior")').attr('href'),
        prevLink = matchSfastLinks(getPageSync(prev));

    addDirectLink(prevLink, 'Previous episode', '.hline', 'prevButton');
    
    $('#prevButton').click(function() {
      chrome.storage.sync.set({ 'current': prev });

      return true;
    });
  });
}

var prepNext = function() {
  chrome.storage.sync.get('current', function(result) {
    var next     = 'http://990.ro/' + $(getPageSync(result.current)).find('a.episode_nextprev:contains("Episodul urmator")').attr('href'),
        nextLink = matchSfastLinks(getPageSync(next));

    addDirectLink(nextLink, 'Next episode', '.hline', 'nextButton');

    $('#nextButton').click(function() {
      chrome.storage.sync.set({ 'current': next });

      return true;
    });
  });
}

var handleSuperweb = function() {
  if ($('#html5_b').length === 0 && currentLink.includes('/3/')) {
    window.location.href = currentLink.replace('/3/', '/1/');
  }

  $('.all').remove();
  
  prepPrev();
  prepNext();
}

if (currentLink.includes("/video/")) {
  handleSuperweb();
} else if (currentLink.includes("seriale2-") || currentLink.includes("filme-")) {
  init();
  getCurrentLink();
} 

