/* global chrome */
/* global fetch */
'use strict';
var getPage = function (link) {
    return fetch(link)
        .then(response => response.text())
        .then(pageHtml => {
            var el = document.createElement('div');
            el.innerHTML = pageHtml;
            return el;
        });
}

var getPlayerLink = function (page) {
    var finalLink = page.querySelector('.player5x>a').href;
    return finalLink.slice(finalLink.lastIndexOf('http'));
}

var getDirectLink = function (page) {
    if (!page) return "";

    var firstLink = Array.prototype.slice.call(page.querySelectorAll('.linkviz a.link'))
        .map(el => 'http://www.990.ro/' + el.getAttribute('href'))
        .filter((el, idx, arr) => !el.includes('openload') && arr.indexOf(el) === idx)[0];

    return getPage(firstLink)
        .then(page => getPlayerLink(page));
}

var createButton = function (buttonName, buttonExtraStyle) {
    var el = document.createElement('button');
    el.setAttribute('style', 'z-index: 9999999; position: fixed; background-color: white; ' +
        'border: 1px solid #ccc; border-radius: 4px; height: 32px;' +
        buttonExtraStyle);
    el.innerHTML = buttonName;
    return el;
}

var addNav = function (linksPage, buttonName, buttonStyle) {
    var link990 = Array.prototype.slice
        .call(linksPage.querySelectorAll('a.episode_nextprev'))
        .filter(e => e['innerText'] === buttonName)
        .map(e => 'http://www.990.ro/' + e.getAttribute('href'))[0];
       
    if (!link990) return;
    
    getPage(link990).then(page => getDirectLink(page))
        .then(link => {
            if (!link) return;

            var el = createButton(buttonName, buttonStyle);
            el.addEventListener('click', function () {
                chrome.storage.local.set({ 'current': link990 });

                window.location.href = link;
            });
            document.body.insertBefore(el, document.body.firstChild);
        });
}

var addNavigationButtons = function () {
    var onVideoSite = ['superweb.', 'mastervid.com', 'thevideo.me',
        'openload.co', 'gorillavid.in', 'daclips.in', 'allmyvideos.net', 'vodlocker.com',
        'movpod.in', 'vidbull.com', 'streamin.to', 'filehoot.com', 'vidzi.tv', 'vidspot.net',
        'vidto.me']
        .some(website => window.location.href.includes(website));
    if (!onVideoSite) return;

    chrome.storage.local.get('current', function (result) {
        getPage(result.current)
            .then(linksPage => {
                addNav(linksPage, 'Episodul anterior', 'top:0;left: 0;');
                addNav(linksPage, 'Episodul urmator', 'top:0;right: 0;');
                var button = createButton('Pagina 990', 'bottom: 0; left: 0;');
                button.addEventListener('click', function () {
                    chrome.storage.local.set({ 'fromVideo': true });
                    window.location.href = result.current;
                });
                document.body.insertBefore(button, document.body.firstChild);
            });
    });
}

var handle990 = function () {
    if (!(window.location.href.includes("seriale2-") ||
        window.location.href.includes("filme-"))) {
        return;
    }
    chrome.storage.local.get('fromVideo', function (result) {
        chrome.storage.local.set({ 'current': window.location.href });
        if (result.fromVideo) {
            chrome.storage.local.set({ 'fromVideo': false });
        } else {
            getPage(window.location.href)
                .then(page => getDirectLink(page))
                .then(link => window.open(link, '_blank'));
        }
    });
}

var handle990Player = function () {
    if (!window.location.href.includes('player-film-') &&
        !window.location.href.includes('player-serial-')) return;

    window.location.href = getPlayerLink(document);
}

handle990();
handle990Player();
addNavigationButtons();