javascript:(function() {
  var panels = $('.save-list');
  if (panels.length) {
    panels.remove();
    return;
  }

  var ls = window.localStorage;

  var hateTracks  = JSON.parse(ls.getItem('hate-tracks') || '{}');
  var hateTracksArr  = Object.keys(hateTracks).map(values(hateTracks));

  var trackTemplate = template(function() {/*
    <div class='song small' style='background:#0B0E13;border-bottom:2px solid #2F4C5A;'>
      <div class='container-fluid'>
        <div class='song-info'>
          <div class='song-info-wrapper'>
            <h2 class='artist'>{artist} <span class='tag-header'>(from {contributor})</span></h2>
            <h1 style='color:white' class='song-title'>{song}</h1>
            <ul class='song-tools list-unstyled'>
              [links.amazon? <li><a target='_blank' href='{links.amazon}' class='amazon'><span class='icon-amazon'></span></a> ]
              [links.itunes? <li><a target='_blank' href='{links.itunes}' class='itunes'><span class='icon-apple'></span></a> ]
              [links.rdio? <li><a target='_blank' href='{links.rdio}' class='rdio'><span class='icon-rdio'></span></a> ]
              [links.spotify? <li><a target='_blank' href='{links.spotify}' class='spotify'><span class='icon-spotify-circled'></span></a> ]
            </ul>
          </div>
        </div>
      </div>
    </div>
  */});

  var panelTemplate = template(function() {/*
    <div style='width:100%; background:black'>
      <h1 style='color:white;padding:20px'>{title}</h1>
      {content}
    </div>
  */});

  var hatePanelContent  = templateCompile(panelTemplate, {
    content : hateTracksArr.map(compileTrack).join(''),
    title   : 'Hate Tracks'
  });

  var positioningCSS = {
    position : 'fixed',
    top      : '4rem',
    height   : 'calc(100% - 13rem)',
    width    : '100%',
    overflow : 'auto'
  };

  var hatePanel  = $('<div class=\'hate-list save-list\'>')
    .html(hatePanelContent)
    .css(positioningCSS)
    .css('right', 0)
    .appendTo('body');

  function values(obj) {
    return function(key) {
      return obj[key];
    };
  }

  function template(fn) {
    return fn.toString().replace(/\n/g, '').match(/\/\*(.*?)\*\//)[1];
  }

  function compileTrack(track) {
    return templateCompile(trackTemplate, track);
  }

  function templateCompile(template, props) {
    /* handle conditionals */
    template = template.replace(/\[(.+?)\?(.*?)\]/g, function(str, prop, tmpl) {
      return getProp(props, prop) ? tmpl : '';
    });
    /* handle substitutions */
    template = template.replace(/\{(.+?)\}/g, function(str, prop) {
      return getProp(props, prop);
    });
    return template;
  }

  function getProp(obj, prop) {
    var propChain = prop.split('.');
    var val = obj;
    for (var i = 0, len = propChain.length; i < len; i++) {
      var newVal = val[propChain[i]];
      if (newVal) {
        val = val[propChain[i]];
      } else {
        return null;
      }
    }
    return val;
  }
})();
