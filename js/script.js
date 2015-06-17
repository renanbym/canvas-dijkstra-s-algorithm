$(function(){


  // var beacons = '{ "vidro": { "x" : 94 ,  "y": 604 }, "excesso": { "x" : 94 ,  "y": 88 }, "pessoal": { "x" : 613 ,  "y": 88 }, "aquario": { "x" : 613 ,  "y": 817 } }';

  var beacons = '{ "vidro": { "x" : 367 ,  "y": 73 }, "excesso": { "x" : 436 ,  "y": 418 } }';

  window.beacons = JSON.parse(beacons);

  $('#btn_rota').on("touchstart mousedown",function(e){
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

    var v1 = ['{ "cost": 1, "dest": { "vertices": {}, "x": 64, "y": 361 }}'];
    var o1 = '"367" : { "73" : { "vertices": { "lenght": 3 },  "x": 367, "y": 73 } }';

    var mapa  = '{ '+o1+' }';


    // var rr = JSON.parse(mapa);
    //
    //
    // for (vv in rr) {
    //
    //   for (v in rr[vv] ) {
    //
    //       var c = rr[vv][v].y;
    //       var r = rr[vv][v].x;
    //
    //         if (nodes[r] === undefined){
    //             nodes[r] = {};
    //         }
    //
    //         nodes[r][c]= window.p.addNode(c, r);
    //
    //
    //         // add vertices
    //         if (nodes[r][c-window.nodeSize] !== undefined){
    //             nodes[r][c].addVertex(nodes[r][c-window.nodeSize]);
    //         }
    //
    //         if (nodes[r-window.nodeSize] !== undefined && nodes[r-window.nodeSize][c] !== undefined){
    //             nodes[r][c].addVertex(nodes[r-window.nodeSize][c]);
    //         }
    //   }
    //
    // }


    var pos = 0;

    for (var r = 1; r <= h; r += window.nodeSize){

      for (var c = 1; c <= w; c += window.nodeSize){


        if ( data_route.data[pos] == 165 && data_route.data[pos + 1] == 191  && data_route.data[pos + 2] == 221 ){


          if (nodes[r] === undefined){
            nodes[r] = {};
          }

          nodes[r][c] = window.p.addNode(c, r);

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
    console.log( nodes );
    console.log( convertObjecttoJson( nodes ) );


  });



});

function convertObjecttoJson( n ){
    var ret = [];

    for( value in n ){

        for( val in value ){

            if( typeof n[value] === 'object' ){
                console.log(  n[value]  );
                // ret[value] = convertObjecttoJson( n[value] );
            }else{
                // ret[value] =  n[value] ;
            }
        }

    }

    return JSON.stringify( ret );
}


function findRoute(start, end){

  $(".maps canvas").remove();

  var route = window.p.Solver(start,end);

  if (route === false){
    alert("No route found");
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
