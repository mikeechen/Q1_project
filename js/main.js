(function(){
// c87acfbb1f41bd23be2176298e5afc32
  'use strict';

  let games = [];
  let winelist = [];
  let gamename = '';
  let user = '';
  let variety = '';
  let viewers;
  let topviewers;
  let $twitchlist = $.getJSON('https://api.twitch.tv/kraken/games/top?limit=24');

  $twitchlist.done(function(data) {
    data.top.forEach(function(elm) {
      let obj = {};
      obj.name = elm.game.name;
      obj.pic = elm.game.logo.large;
      obj.viewers = elm.viewers;
      games.push(obj);
    });
    topviewers = games[0].viewers;
    localStorage.games = JSON.stringify(games);
  })

  function gamelist() {
    $('section').children('#gamelistings').remove();

    if (games.length === 0) {
      games = JSON.parse(localStorage.games);
    }

    let $row = $('<div id="gamelistings" class="row container">');

    games.forEach(function(game){
      let $col = $('<div class="col s3">');
      let $card = $('<div class="gamecard card">');
      let $cardimg = $('<div class="card-image">');
      let $cardcont = $('<div class="card-content">');
      let $img = $('<img class="gameimg">');
      $img.attr({src: game.pic});
      $cardimg.append($img);
      $card.append($cardimg);
      let $title = $(`<a class="games" href="#"><p class="pink-text text-lighten-2">${game.name}</p></a><p id="view">Viewers: ${game.viewers}</p>`);
      if (!game.viewers) {
        $('#view').remove();
      }
      $cardcont.append($title);
      $card.append($cardcont);
      $col.append($card);
      $row.append($col);
    });
    $('section').append($row);
    if ($('form').is('#searchgames') === false) {
      $('form').append(`<div class="col offset-s2 s7"><input type="text" placeholder="Can't find your game?" id="search" name="search"/></div>`);
      $('form').append(`<input type="submit" value="Search" id="searchbutt" class="btn waves-effect waves-light pink lighten-2 left"/>`);
      $('form').attr('id', 'searchgames');
    }
    games = [];
  }

  function listwine() {
    let $row = $('<div id="winelistings" class="container row">');

    winelist.forEach(function(wine){
      let $col = $('<div class="col s4">');
      let $card = $('<div class="winecard card">');
      let $cardimg = $('<div class="card-image">');
      let $cardcont = $('<div class="card-content">');
      let $cardaction = $('<div class="card-action">');
      let $img = $('<img class="winelbl">');
      $img.attr({src: wine.label});
      $cardimg.append($img);
      $card.append($cardimg);
      let $title = $(`<p class="pink-text text-lighten-2">${wine.name}</p>
                      <p id="priceandrating">Price: $${wine.price} Rating: ${wine.rating}</p>`);
      $cardcont.append($title);
      $cardaction.append(`<a href="${wine.url}">Find it on Wine.com!</a>`);
      $card.append($cardcont);
      $card.append($cardaction);
      $col.append($card);
      $row.append($col);
    })

    $('section').append($row);
    const $streambutt = $(`<a href="https://www.twitch.tv/directory/game/${gamename}">
                          <button class="center-align btn offset-s3 col s6 pink lighten-2" type="button">
                          Go to Twitch!</button></a>`);
    $('#winelistings').append($streambutt);
    winelist=[];
  }

  function initfunc() {
    $('#headtext').fadeOut('slow', function(){
        $('#headtext').fadeIn('slow').text('Are You Watching or Streaming?');
        let $stream = $('<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="stream" value="stream">Streaming</button>');
        let $watch = $('<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="watch" value="watch">Watching</button>');
        $('form').append($stream);
        $('form').append($watch);
    });
    $('#startbutt').fadeOut('slow', function(){
      $('#startbutt').remove();
    });
    $('#subheader').fadeOut('slow', function(){
      $('#subheader').remove();
    });
    const $breadcrumb = $(`<div class="bread nav-wrapper container">
                          <div class="breadcrumbwrapper col s12">
                          <a href="#" class="breadcrumb">User</a>
                          </div>
                          </div>`);
    $('nav').append($breadcrumb);
  }

  function saveinfo(event) {
    if (user === '') {
      user = $(event.target).val();
      nextstep(user, variety);
    } else if (variety === '') {
      variety = $(event.target).val();
      nextstep(user, variety);
    }
  }

  function nextstep(user, variety) {
    let $bread = $(`<a href="#" id="variety" class="breadcrumb">Variety</a>`);
    if (variety === '') {
      $('.breadcrumbwrapper').append($bread);
      $('form').children().fadeOut('slow', function(){
        $('form').children().remove();
      });
      $('#headtext').fadeOut('slow', function(){
          $('#headtext').fadeIn('slow').text('Which Variety of Wine do you like?');
          let $red = $(`<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="red" value="red">Red</button>`);
          let $white = $(`<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="white" value="white">White</button>`);
          let $sparkling = $(`<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="spakling" value="sparkling">Sparkling</button>`)
          $('form').append($red);
          $('form').append($white);
          $('form').append($sparkling);
      });
    } else {
      $bread = $(`<a href="#" id="game" class="breadcrumb">Games</a>`);
      $('.breadcrumbwrapper').append($bread);
      $('form').children().fadeOut('slow', function(){
      $('form').children().remove();
      });
      $('#headtext').fadeOut('slow', function(){
          $('#headtext').fadeIn('slow').text('Which Game are You Watching?');
          $('section').toggleClass('valign-wrapper');
          gamelist();
      });
    }
  }

  function getwine(event) {
    event.preventDefault();
    viewers = parseInt($(event.target).parent().siblings('#view').text().substring(9));
    gamename = $(event.target).text();
    $('#headtext').fadeOut('slow', function(){
        $('#headtext').fadeIn('slow').text('I\'m Thinking...');
        $('section').toggleClass('valign-wrapper');
        $('#theform').append(`<div id="progressbar" class="progress">
                              <div class="indeterminate"></div>
                              </div>`);
    });
    $('section').children('#gamelistings').fadeOut('slow', function() {
      $('section').children('#gamelistings').remove();
    });
    $('form').removeAttr('id');
    $('#search').remove();
    $('#searchbutt').remove();
    const points = 90 + Math.round(viewers / topviewers * 10);
    const sregion = [103, 111, 114, 105, 109, 106, 112];
    const wregion = [101, 104, 108, 10038, 107, 115, 113];
    let regioncode;

    if (user === 'stream') {
      regioncode = sregion[Math.random() * sregion.length];
    } else if (user === 'watch') {
      regioncode = wregion[Math.random() * wregion.length];
    }
    let $wines = $.getJSON(`http://services.wine.com/api/beta2/service.svc/JSON/catalog?size=6&apikey=c87acfbb1f41bd23be2176298e5afc32&term=${variety}+wine&filter=rating(${points}|${points})+categories(490+${regioncode})`)
    $wines.done(function(data) {
      // console.log(data.Products.List);
      $('#headtext').fadeOut('fast', function(){
        $('#headtext').fadeIn('slow').text('Here\'s your list of wine! Enjoy!' );
        $('section').toggleClass('valign-wrapper');
        $('#progressbar').remove();
      });
      data.Products.List.forEach(function(elm){
        let obj = {};
        obj.name = elm.Name;
        obj.label = elm.Labels[0].Url;
        obj.price = elm.PriceRetail;
        obj.rating = elm.Ratings.HighestScore;
        obj.url = elm.Url;
        winelist.push(obj);
      });
      listwine();
    });
    const $bread = $(`<a href="#" id="results" class="breadcrumb">Results</a>`);
    $('.breadcrumbwrapper').append($bread);
  }

  function getgames(event) {
    event.preventDefault();
    const searchterm = $('#search').val();
    $twitchlist = $.getJSON(`https://api.twitch.tv/kraken/search/games?q=${searchterm}&type=suggest`);
    $twitchlist.done(function(data) {
      games = [];
      data.games.forEach(function(elm){
        let obj = {};
        obj.name = elm.name;
        obj.pic = elm.logo.large;
        obj.viewers = elm.popularity;
        games.push(obj);
      });
      gamelist();
    });
  }

  function usebreadcrumb(event) {
    event.preventDefault();
    const value = $(event.target).text().toLowerCase();
    console.log(value);
    if (value === 'user') {
      user = '';
      variety = '';
      viewers = 0;
      gamename = '';
      $('form').children().fadeOut('slow', function(){
        $('form').children().remove();
      });
      $('nav').children('.bread').remove();
      $('section').children('#gamelistings').remove();
      $('section').children('#winelistings').remove();
      if ($('section').hasClass('valign-wrapper') === false) {
        $('section').toggleClass('valign-wrapper');
        $('form').removeAttr('id');
      }
      initfunc();
    } else if (value === 'variety') {
      variety = '';
      viewers = 0;
      gamename = '';
      $('form').children().fadeOut('slow', function(){
        $('form').children().remove();
      });
      $('section').children('#gamelistings').remove();
      $('section').children('#winelistings').remove();
      $('nav').children('.bread').children('.breadcrumbwrapper').children('#variety').remove();
      $('nav').children('.bread').children('.breadcrumbwrapper').children('#game').remove();
      $('nav').children('.bread').children('.breadcrumbwrapper').children('#results').remove();
      if ($('section').hasClass('valign-wrapper') === false) {
        $('section').toggleClass('valign-wrapper');
        $('form').removeAttr('id');
      }
      nextstep(user, variety);
    } else if (value === 'games') {
      viewers = 0;
      gamename = '';
      $('section').children('#winelistings').remove();
      $('nav').children('.bread').children('.breadcrumbwrapper').children('#results').remove();
      if ($('section').hasClass('valign-wrapper') === false) {
        $('section').toggleClass('valign-wrapper');
        $('form').removeAttr('id');
      }
      nextstep();
    }
  }

  $('#startbutt').click(initfunc);
  $('form').on('click', '.button', saveinfo);
  $('section').on('click', '.games', getwine);
  $('form').submit(getgames);
  $('nav').on('click', '.breadcrumb', usebreadcrumb);
})();
