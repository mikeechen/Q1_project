$('button').click(songlist);
$('section').on('click', '.songs', wiki);

function songlist(event) {
  var albumcode = $(event.target).val();
  var musical = $(event.target).text().replace(' ', '%20');
  var $musicalart = $.getJSON(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles=${musical}&rvprop=content&rvsection=0&callback=?`);
  var $songs = $.getJSON(`https://api.spotify.com/v1/albums/${albumcode}`);
  $('p.songs').remove();
  $songs.done(getsongname);
  $musicalart.done(getmusicalinfo);
}

function getsongname(data) {
  var tracks = [];
  for (var i = 0; i < data.tracks.items.length; i++) {
    tracks.push(data.tracks.items[i].name);
  }
  for (var i = 0; i < tracks.length; i++) {
    var $tracksout = $('<p class="songs">');
    $tracksout.text(tracks[i]);
    $('section').append($tracksout);
  }
  console.log(tracks);
}

function wiki(event) {
  var searchterm = $(event.target).text().replace(' ', '%20');
  var $wikiart = $.getJSON(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&exsectionformat=wiki&callback=?&titles=${searchterm}`);
  $wikiart.done(getarticle);
}

function getarticle(data) {
  var pageid = Object.keys(data.query.pages);
  console.log(data.query.pages[pageid].extract);
}

function getmusicalinfo(data) {
  var pageid = Object.keys(data.query.pages);
  console.log(data.query.pages[pageid].revisions[0]['*']);
}
