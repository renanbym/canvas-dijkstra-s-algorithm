$(function(){

       var nodes = {};

       var PathFinder = new PathFinding();
       $('#map').load(function(){
           var canvas = document.createElement('canvas'), ctx = canvas.getContext("2d"), w = 1500, h = 816, nodeSize = 3;
           canvas.width = w;
           canvas.height = h;
           ctx.drawImage(this, 0, 0);
           var data = ctx.getImageData(0, 0, w, h);

           var pos = 0;

           for (var r = 1; r <= h; r += nodeSize){

               for (var c = 1; c <= w; c += nodeSize){


                   if ( data.data[pos + 2] == 221 ){
                       if (nodes[r] === undefined){
                           nodes[r] = {};
                       }
                       nodes[r][c] = PathFinder.addNode(c, r);

                       // add vertices
                       if (nodes[r][c-nodeSize] !== undefined){
                           nodes[r][c].addVertex(nodes[r][c-nodeSize]);
                       }

                       if (nodes[r-nodeSize] !== undefined && nodes[r-nodeSize][c] !== undefined){
                           nodes[r][c].addVertex(nodes[r-nodeSize][c]);
                       }


                   }

                   pos += 4*nodeSize;

               }
               pos += 4*w*2;

           }
           //ctx.putImageData(data, 0, 0);
           //    $(this).remove();
           delete canvas;

           var p1 = Object.keys(nodes)[0];
           var p2 = Object.keys(nodes[p1])[0];

           var p3 = Object.keys(nodes)[10];
           var p4 = Object.keys(nodes[p3])[0];

           param(p1, p2, p3, p4);

           var start = nodes[p1][p2];
           var end = nodes[p3][p4];


           function findRoute(start, end){
               var canvas;
               $(".maps canvas").remove();

               var route = PathFinder.Solver(start,end);

               if (route === false){
                   alert("No route found");
               }else{

                   canvas = document.createElement('canvas'), ctx = canvas.getContext("2d");
                   canvas.width = w;
                   canvas.height = h;

                   ctx.beginPath();
                   ctx.moveTo(start.x, start.y);

                   for (var r = 0, rlen = route.length; r < rlen; r++){
                       ctx.lineTo(route[r].x,route[r].y);
                   }
                   $(canvas).click(function(e){
                       var x = e.pageX - $(this).offset().left;
                       x -= x % 3;
                       x += 1;
                       var y = e.pageY - $(this).offset().top;
                       y -= y % 3;
                       y += 1;
                       if (nodes[y] !== undefined && nodes[y][x] !== undefined){
                           findRoute(end, nodes[y][x]);

                       }
                       //  console.log(y);


                   });

                   ctx.stroke();
                   $('.maps').append(canvas);
               }
           }

           findRoute(start, end);
           // console.log(route);


       });





   });


   function param(p1, p2, p3, p4){
     $('input[name=start]').val( p1 );
     $('input[name=start_x]').val( p2 );
     $('input[name=end]').val( p3 );
     $('input[name=end_x]').val( p4 );
   }
