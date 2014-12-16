javascript:(function() {
  var ls = window.localStorage;
  var storageKey = 'heart-tracks';

  var songs = $('.songs:first');

  var track = {
    song        : $('.player h1.song-title').text(),
    artist      : $('.player h2.artist').text(),
    contributor : songs.find('.song:last .byline .name').text(),

    links: {
      amazon  : songs.find('.song:last .song-tools .amazon').attr('href'),
      itunes   : songs.find('.song:last .song-tools .itunes').attr('href'),
      rdio    : songs.find('.song:last .song-tools .rdio').attr('href'),
      spotify : songs.find('.song:last .song-tools .spotify').attr('href')
    }
  };

  var hearts = ls.getItem(storageKey);
  hearts = hearts ? JSON.parse(hearts) : {};

  hearts[track.song + '-' + track.artist] = track;
  ls.setItem(storageKey, JSON.stringify(hearts));

  /* Add a heart to the screen! */
  $('<img>')
    .attr('src', 'http://upload.wikimedia.org/wikipedia/commons/4/42/Love_Heart_SVG.svg')
    .css({
      position  : 'fixed',
      top       : '50%',
      left      : '50%',
      transform : 'translate(-50%, -50%)',
      /* this just makes the red heart white */
      filter           : 'grayscale(1) brightness(10)',
      '-webkit-filter' : 'grayscale(1) brightness(10)'
    })
    .appendTo('body')
    .fadeOut(400, function() {
      $(this).remove();
    });
})();
