
var getPageSync = function(link) {
  if (link.length === 0) {
    return "";
  }

  var request = new XMLHttpRequest();

  request.open('GET', link, false);
  request.send();

  return request.responseText;
}

var getDirectLink = function(page) {
  if (page.length === 0) {
    return "";
  }

  var el = document.createElement('div');
  el.innerHTML = page;

  var finalLink,
      link = el.querySelectorAll('a.link[href*="-sfast.html"]')[0]
                .getAttribute('href');

  if (link !== undefined) {
    finalLink = getPageSync('http://990.ro/' + link).match(/\/video\/.*\.html/g).toString();
    finalLink = 'http://superweb.rol.ro' + finalLink.replace('/video/', '/video/3/');

    return finalLink;
  }

  return "";
}

var addDirectLinkButton = function(link, text, upperElement, id) {
  var element = '<a id="' + id + '" class="button-9" href="' + link + '">' + text + '</a>';

  if (link === '') {
    element = '<a id="' + id + '" href="#" class="button-9 disabledButton">Not available</a>';
  }

  document.querySelector(upperElement)
          .insertAdjacentHTML('afterend', element);
}

var addSuperwebNav = function(buttonId, buttonName) {
  chrome.storage.sync.get('current', function(result) {
    var el = document.createElement('div');
    el.innerHTML = getPageSync(result.current);

    var link990 = Array.prototype.slice
                .call(el.querySelectorAll('a.episode_nextprev'))
                .filter(function(e) {
                  if (e['innerText'] === buttonName) {
                    return e;
                  }
                })
                .map(function(e) {
                  return 'http://990.ro/' + e['href']
                      .slice(e['href'].indexOf('/video/') + 8);
                });

    var directLink = getDirectLink(getPageSync(link990));

    addDirectLinkButton(directLink, buttonName, '.hline', buttonId);

    document.getElementById(buttonId).onclick = function() {
      chrome.storage.sync.set({ 'current': link990 });

      return true;
    };
  });
}

var handleSuperweb = function() {
  if (!window.location.href.includes('/video/')) {
    return;
  }

  if (document.getElementById('html5_b').length === 0 && currentLink.includes('/3/')) {
    window.location.href = window.location.href.replace('/3/', '/1/');
  }

  var el = document.querySelector('.all');
  el.parentNode.removeChild(el);

  addSuperwebNav('prevButton', 'Episodul anterior');
  addSuperwebNav('nextButton', 'Episodul urmator');
}

var handle990 = function () {
  if (!(window.location.href.includes("seriale2-")
        || window.location.href.includes("filme-"))) {
          return;
        }

  chrome.storage.sync.set({ 'current': window.location.href });

  addDirectLinkButton(getDirectLink(getPageSync(window.location.href)),
                      'Link direct', '#content div');
}

handle990();
handleSuperweb();
