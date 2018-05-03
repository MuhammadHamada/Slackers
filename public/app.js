var content = [];

$( "#guest").click(function() {
    $(".container").remove();
    // request to get the rooms
    $.getJSON('/rooms', function(data){ 
     alert("success");
     console.log(data);
     $('body').append('<div id="grid"></div>');
      for (var i = 0; i < data['rooms'].length; i++) {
        var room = data['rooms'][i];
        console.log(room.name);
        content.push('<div class="element room"><h3 class="room_name">'+room.name+'</h3> <h6 class="room_good">'+room.good+'</h6><h6 class="room_bad">'+room.bad+'</h6><button type="button" id="good_button">Good</button><button type="button" id="bad_button">Bad</button></div>');
   }
   
    console.log(content);
    $(function(){
        $('#grid').jresponsive({
            min_size: 50,
            max_size: 200,
            hspace: 50,
            vspace: 10,
            height:	200,
            class_name: 'element',
            content_array: content,
            transfromation: 'animate'
        });
        console.log($('#grid').width());
    });


    var myrooms= $("#grid div");
    var good_button=$("#good_button");
    var bad_button=$("#bad_button");
    good_button.on("click",function(){
         var good_num = parseInt(good_button.siblings('.room_good').text());

         var bad_num = parseInt(good_button.siblings('.room_bad').text());
         var room_name = good_button.siblings('.room_name').text();
         var data={
            room : room_name,
            good : good_num+1,
            bad : bad_num
         };
          User_Connection(data);
    });
    bad_button.on("click",function(){
         var good_num =  parseInt(bad_button.siblings('.room_good').text());
         var bad_num =   parseInt(bad_button.siblings('.room_bad').text());
         var room_name = bad_button.siblings('.room_name').text();
         var data={
            room : room_name,
            good : good_num,
            bad : bad_num+1
         };
         User_Connection(data);
    });
    function User_Connection(data){
        var name = data.room;
        console.log("name :"+name);
        var socket=io.connect('http://localhost:3000');
        console.log("data mn el client "+data);
        socket.emit('room', data);
         $("#grid").remove();
         gameloop();

    }
    
    /*myrooms.on("click",function(){
    var room_name = $(this).find('.room_name').text();
    var socket=io.connect('http://localhost:3000');
    var data={
        room: room_name
    }
    socket.emit('room', data);
    $("#grid").remove();

    
    });
    */
    
  });

  });
  function gameloop() {
    createCanvas(800, 200);
    background(0);
    textSize(32);
    fill(0, 102, 153);
    requestAnimationFrame(gameloop);
  }