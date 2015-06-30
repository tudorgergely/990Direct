var directRegex = /\/video\/.*\.html/g,
    currentLink = window.location.href;

var init = function() {
  chrome.storage.sync.set({ 'current': currentLink });
}

var getPageSync = function(link) {
  var request = new XMLHttpRequest();

  if (link.length === 0) {
    return "";
  }

  request.open('GET', link, false);
  request.send();

  return request.responseText;
}

var matchSfastLinks = function(page) {
  if (page.length === 0) {
    return "";
  }

  var el = document.createElement('div');
  el.innerHTML = page;

  var link = el.querySelectorAll('a.link[href*="-sfast.html"]')[0].getAttribute('href'),
      finalLink;

  if (link !== undefined) {
    finalLink = getPageSync('http://990.ro/' + link).match(directRegex).toString();
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

  document.querySelector(upperElement)
          .insertAdjacentHTML('afterend', element);
}

var getCurrentLink = function() {
  var currentDirectLink = matchSfastLinks(getPageSync(currentLink));
  
  addDirectLink(currentDirectLink, 'Link direct', '#content div');
}

var prepPrev = function() {
  chrome.storage.sync.get('current', function(result) {
    var el = document.createElement('div');
    el.innerHTML = getPageSync(result.current);

    var prev     = Array.prototype.slice
                    .call(el.querySelectorAll('a.episode_nextprev'))
                    .filter(function(e) {
                      if (e['innerText'] === 'Episodul anterior') {
                        return e;
                      }
                    })
                    .map(function(e) {
                      return 'http://990.ro/' + e['href']
                          .slice(e['href'].indexOf('/video/') + 8);
                    });

    var prevLink = matchSfastLinks(getPageSync(prev));

    addDirectLink(prevLink, 'Previous episode', '.hline', 'prevButton');
    
    document.getElementById('prevButton').onclick = function() {
      chrome.storage.sync.set({ 'current': prev });

      return true;
    };
  });
}

var prepNext = function() {
  chrome.storage.sync.get('current', function(result) {
    var el = document.createElement('div');
    el.innerHTML = getPageSync(result.current);
    
    var next     = Array.prototype.slice
                    .call(el.querySelectorAll('a.episode_nextprev'))
                    .filter(function(e) {
                      if (e['innerText'] === 'Episodul urmator') {
                        return e;
                      }
                    })
                    .map(function(e) {
                      return 'http://990.ro/' + e['href']
                          .slice(e['href'].indexOf('/video/') + 8);
                    });

    var nextLink = matchSfastLinks(getPageSync(next));

    addDirectLink(nextLink, 'Next episode', '.hline', 'nextButton');

    document.getElementById('nextButton').onclick = function() {
      chrome.storage.sync.set({ 'current': next });

      return true;
    };
  });
}

var handleSuperweb = function() {
  if (document.getElementById('html5_b').length === 0 && currentLink.includes('/3/')) {
    window.location.href = currentLink.replace('/3/', '/1/');
  }

  var el = document.querySelector('.all');
  el.parentNode.removeChild(el);
  
  prepPrev();
  prepNext();
}

if (currentLink.includes("/video/")) {
  handleSuperweb();
} else if (currentLink.includes("seriale2-") || currentLink.includes("filme-")) {
  init();
  getCurrentLink();
} 

