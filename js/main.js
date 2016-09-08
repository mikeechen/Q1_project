(function(){
// c87acfbb1f41bd23be2176298e5afc32
'use strict';

let games = [];
let winelist = [];
let user = '';
let variety = '';
let viewers;
let topviewers;
let $twitchlist = $.getJSON('https://api.twitch.tv/kraken/games/top?limit=30');

$twitchlist.done(function(data) {
  data.top.forEach(function(elm) {
    let obj = {};
    obj.name = elm.game.name;
    obj.pic = elm.game.logo.large;
    obj.viewers = elm.viewers;
    games.push(obj);
  });
  topviewers = games[0].viewers;
})

function gamelist() {
  let $row = $('<div id="listings" class="row">');

  games.forEach(function(game){
    let $col = $('<div class="col s3">');
    let $card = $('<div class="card">');
    let $cardimg = $('<div class="card-image">');
    let $cardcont = $('<div class="card-content">');
    // let $cardaction = $('<div class="card-action">');
    let $img = $('<img class="gameimg">');
    $img.attr({src: game.pic});
    $cardimg.append($img);
    $card.append($cardimg);
    let $title = $(`<a class="games" href="#"><p class="pink-text text-lighten-2">${game.name}</p></a><p id="view">Viewers: ${game.viewers}</p>`);
    $cardcont.append($title);
    $card.append($cardcont);
    $col.append($card);
    $row.append($col);
  })

  $('section').append($row);
}

function listwine() {
  let $row = $('<div id="listing" class="container row">');

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
  console.log('done');
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
}

function saveinfo(event) {
  if (user === '') {
    user = $(event.target).val();
    $('form').children().fadeOut('slow', function(){
      $('form').children().remove();
    });
    $('#headtext').fadeOut('slow', function(){
        $('#headtext').fadeIn('slow').text('Which Veriety of Wine do you like?');
        let $red = $(`<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="red" value="red">Red</button>`);
        let $white = $(`<button class="button btn waves-effect waves-light pink lighten-2" type="button" name="white" value="white">White</button>`);
        $('form').append($red);
        $('form').append($white);
    });
  } else if (variety === '') {
    variety = $(event.target).val();
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
  $('#headtext').fadeOut('slow', function(){
      $('#headtext').fadeIn('slow').text('I\'m Thinking...');
      $('section').toggleClass('valign-wrapper');
      $('#theform').append(`<div id="progressbar" class="progress">
                            <div class="indeterminate"></div>
                            </div>`);
  });
  $('section').children('#listings').fadeOut('slow', function() {
    $('section').children('#listings').remove();
  });
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
    $('#headtext').fadeOut('slow', function(){
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
}

$('#startbutt').click(initfunc);
$('form').on('click', '.button', saveinfo);
$('section').on('click', '.games', getwine);
})();
