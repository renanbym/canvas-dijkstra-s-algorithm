$(function(){

  var beacons = '{ "vidro": { "x" : 94 ,  "y": 604 }, "excesso": { "x" : 94 ,  "y": 88 }, "pessoal": { "x" : 613 ,  "y": 88 }, "aquario": { "x" : 613 ,  "y": 817 } }';
  window.beacons = JSON.parse(beacons);

  $('#btn_medidas').click(function (e) {
    e.preventDefault();
    var start = window.n[$('input[name=start]').val()][$('input[name=start_x]').val()];
    var end = window.n[$('input[name=end]').val()][$('input[name=end_x]').val()];

    $('.ball').css({top: $('input[name=start]').val(), left: $('input[name=start_x]').val() });
    findRoute( start, end );

  });

  $('#btn_rota').click(function (e) {
    e.preventDefault();


    var s_start = $('#rota_start').val();
    var s_end = $('#rota_end').val();

    var start = window.n[ window.beacons[s_start].x ][ window.beacons[s_start].y ];
    var end = window.n[ window.beacons[s_end].x ][ window.beacons[s_end].y ];

    findRoute( start, end );
  });

  var nodes = {};
  window.p = new PathFinding();

  $('#map').load(function(){

    window.canvas = document.createElement('canvas');
    window.ctx = window.canvas.getContext("2d");
    window.w = 1500;
    window.h = 713;
    window.nodeSize = 3;

    window.canvas.width = w;
    window.canvas.height = h;

    window.ctx.drawImage( this , 0, 0);

    var context = window.canvas.getContext("2d");
    context.drawImage( this , 0, 0);

    var data_route = window.ctx.getImageData(0, 0, window.w, window.h);

    var pos = 0;

    for (var r = 1; r <= h; r += window.nodeSize){

      for (var c = 1; c <= w; c += window.nodeSize){


        if ( data_route.data[pos + 2] == 221 ){


          if (nodes[r] === undefined){
            nodes[r] = {};
          }

          nodes[r][c] = window.p.addNode(c, r);

          // context.fillStyle='rgb(255,0,0)';
          // context.fillRect(c, r, window.nodeSize, window.nodeSize);

          // add vertices
          if (nodes[r][c-window.nodeSize] !== undefined){
            nodes[r][c].addVertex(nodes[r][c-window.nodeSize]);

          }

          if (nodes[r-window.nodeSize] !== undefined && nodes[r-window.nodeSize][c] !== undefined){
            nodes[r][c].addVertex(nodes[r-window.nodeSize][c]);

          }


        }

        pos += 4*window.nodeSize;

      }
      pos += 4*w*2;

    }


    window.n = nodes;

    // delete window.canvas;

    var p1 = Object.keys(nodes)[0];
    var p2 = Object.keys(nodes[p1])[0];

    var p3 = Object.keys(nodes)[10];
    var p4 = Object.keys(nodes[p3])[0];

    param(p1, p2, p3, p4);
    $( "#btn_medidas" ).trigger( "click" );

  });


});

function param(p1, p2, p3, p4){
  $('input[name=start]').val( p1 );
  $('input[name=start_x]').val( p2 );
  $('input[name=end]').val( p3 );
  $('input[name=end_x]').val( p4 );
}

function findRoute(start, end){

  $(".maps canvas").remove();

  var route = window.p.Solver(start,end);
  //console.log(route);
  if (route === false){
    console.log("No route found");
  }else{

    window.ctx.clearRect(0, 0, window.w, window.h);
    window.ctx.beginPath();
    window.ctx.moveTo(start.x, start.y);

    for (var r = 0, rlen = route.length; r < rlen; r++){
      window.ctx.lineTo(route[r].x,route[r].y);
    }

    window.ctx.lineWidth = 3;
    window.ctx.stroke();
    $('.maps').append( window.canvas );
  }
}
