var getPageSync = function (link) {
    if (link.length === 0) {
        return "";
    }

    var request = new XMLHttpRequest();

    request.open('GET', link, false);
    request.send();

    var el = document.createElement('div');
    el.innerHTML = request.responseText;

    return el;
}

var getDirectLink = function (page) {
    if (!page) {
        return "";
    }

    var superweb = page.querySelector('a.link[href*="-sfast"]'),
        mastervid = page.querySelector('a.link[href*="-smastervid"]');

    if (superweb) {
        return 'http://superweb.rol.ro' +
            getPageSync('http://www.990.ro/' + superweb.getAttribute('href'))
                .querySelector('.player5x>a')
                .href
                .toString()
                .match(/\/video\/.*\.html/g)[0]
                .replace(/video\/\d/, 'video/3');
    }

    if (mastervid) {
        return getPageSync('http://www.990.ro/' + mastervid.getAttribute('href'))
            .querySelector('.player5x>a')
            .href
            .toString()
            .match(/http:\/\/www.mastervid.com.*/);
    }

return "";
}

var addDirectLinkButton = function (link, text, upperElement, id, newCurrent) {
    var el = document.createElement(makeid());
    el.id = id;
    el.setAttribute('style', 'z-index: 9999999; cursor: pointer; display: inline-block;  text-decoration: none;  background-color: #4CAF50;  vertical-align: text-center;  box-shadow: rgba(0,0,0,0.2) 0 1px 0 0;  border-radius: 5px;  color: #fff;  border: none;  font-family: "Helvetica Neue", Arial, sans-serif;  font-size: 16px;  font-weight: 700;  height: 32px;  padding: 4px 16px;  text-shadow: #1B5E20 0 1px 0;  margin: 10px; ');
    el.innerHTML = text;

    if (link === '') {
        el.style.display = 'none';
    }

    setInterval(function () {
        if (document.getElementById(id) === null) {
            document.querySelector(upperElement)
                .insertAdjacentHTML('afterend', el.outerHTML);

            document.getElementById(id).onclick = function (event) {
                event.preventDefault();
                event.stopPropagation();

                chrome.storage.sync.set({ 'current': newCurrent });

                window.location.href = link;

                return true;
            };
        }
    }, 100);
}

var addSuperwebNav = function (buttonId, buttonName) {
    chrome.storage.sync.get('current', function (result) {
        var el = getPageSync(result.current);

        var link990 = Array.prototype.slice
            .call(el.querySelectorAll('a.episode_nextprev'))
            .filter(function (e) {
                if (e['innerText'] === buttonName) {
                    return e;
                }
            })
            .map(function (e) {
                return 'http://990.ro/' + e['href']
                    .slice(e['href'].indexOf('/video/') + 8);
            });

        var directLink = getDirectLink(getPageSync(link990));

        addDirectLinkButton(directLink, buttonName, '.hline', buttonId, link990);
    });
}

var handleSuperweb = function () {
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

var handleMastervid = function () {
    if (!window.location.href.includes('mastervid.com/')) {
        return;
    }

    var link = document.querySelectorAll('iframe')[0].src;

    if (link) {
        window.location.href = link;
    }
}

var handleOpenload = function () {
    if (!window.location.href.includes('openload.co')) {
        return;
    }

    var el = document.querySelector('#videooverlay');
    el.parentNode.removeChild(el);

    addSuperwebNav('prevButton', 'Episodul anterior');
    addSuperwebNav('nextButton', 'Episodul urmator');
}

var makeid = function () {
    var text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

var handle990 = function () {
    for (var i = 0; i < 9999; ++i) {
        window.clearInterval(i);
    }

    if (!(window.location.href.includes("seriale2-") ||
        window.location.href.includes("filme-"))) {
        return;
    }

    chrome.storage.sync.set({ 'current': window.location.href });
    window.open(getDirectLink(getPageSync(window.location.href)), '_blank');
}

handle990();
handleSuperweb();
handleMastervid();
handleOpenload();
