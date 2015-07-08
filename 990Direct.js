
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

  var link = el.querySelector('a.link[href*="-sfast.html"]')
                .getAttribute('href');

  if (link !== undefined) {
    return 'http://superweb.rol.ro' +
            getPageSync('http://www.990.ro/' + link)
            .match(/\/video\/.*\.html/g)
            .toString()
            .replace('/video/', '/video/3/');
  }

  return "";
}

var addDirectLinkButton = function(link, text, upperElement, id) {
  var el = document.createElement('a');

  el.id = id;
  el.setAttribute('href', link);
  el.setAttribute('style',' display: inline-block;  text-decoration: none;  background-color: #4CAF50;  vertical-align: text-center;  box-shadow: rgba(0,0,0,0.2) 0 1px 0 0;  border-radius: 5px;  color: #fff;  border: none;  font-family: "Helvetica Neue", Arial, sans-serif;  font-size: 16px;  font-weight: 700;  height: 32px;  padding: 4px 16px;  text-shadow: #1B5E20 0 1px 0;  margin: 10px; ');  
  //el.classList.add('button-9')
  el.innerHTML = text;

  if (link === '') {
    el.style.visibility='hidden';
  }

  document.querySelector(upperElement)
          .insertAdjacentHTML('afterend', el.outerHTML);
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

  if (!document.getElementById('html5_b') && window.location.href.includes('/3/')) {
    window.location.href = window.location.href.replace('/3/', '/1/');
  }

  var el = document.querySelector('.all');
  el.parentNode.removeChild(el);

  addSuperwebNav('prevButton', 'Episodul anterior');
  addSuperwebNav('nextButton', 'Episodul urmator');
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var handle990 = function () {
  if (!(window.location.href.includes("seriale2-") ||
        window.location.href.includes("filme-"))) {
    return;
  }

  id = makeid();
  
  addDirectLinkButton(getDirectLink(getPageSync(window.location.href)),
                      'Link direct', '#content div', id);

  document.getElementById(id).onclick = function() {
    chrome.storage.sync.set({ 'current': window.location.href });

    return true;
  };
}

handle990();
handleSuperweb();
