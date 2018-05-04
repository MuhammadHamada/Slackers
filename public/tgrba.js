// types 0--> good 1-->bad

var socket;
var room_name;
const system_room_number=5;
function setup() {

    var content = [];

    

    $('.message a').click(function(){
        $('.login-register').animate({height:"toggle",opacity: "toggle"},"slow");
    });

    $('#login-button').click(function(){
        $.ajax({
            url: 'http://localhost:3000/login',
            // dataType: "jsonp",
            data: {
                username: $('#login-uname').val(),
                password: $('#login-pwd').val()
            }
            ,type: 'POST',
            success: function (data) {
                if(data.errorMsg != null){  
                    alert(data.errorMsg);
                }else{
                    alert('Welcome : '+ data.username + ' your password is : ' + data.password);

                    // redirect to rooms
                }
            },
            error: function (error) {
                var ret = jQuery.parseJSON(error);
                console.log(ret);
            },
        });
    });

    $('#create-button').click(function(){
        $.ajax({
            url: 'http://localhost:3000/register',
            // dataType: "jsonp",
            data: {
                username: $('#uname').val(),
                password: $('#pwd').val()
            }
            ,type: 'POST',
            success: function (data) {
                console.log(data);
                if(data.errorMsg != null){  
                    alert(data.errorMsg);
                }else{
                    alert('Welcome : '+ data.username + ' your password is : ' + data.password + ' , msg : ' + data.msg);
                    window.location.replace("http://localhost:3000");
                }
            },
            error: function (error) {
                var ret = jQuery.parseJSON(error);
                console.log(ret);
            },
        });
    });

 $( "#guest-button").click(function() {
    $(".login-page").remove();
    // request to get the rooms
    $.getJSON('/rooms', function(data){ 
    // alert("success");
    
     $('body').append('<div id="grid"></div>');
    
      for (var i = 0; i < data['rooms'].length; i++) {
        var room = data['rooms'][i];
       
        content.push('<div class="element room">' + 
        '<h3 class="room_name">'+room.name+
        '</h3> <h6 class="room_good">'+room.good+
        '</h6><h6 class="room_bad">'+room.bad+
        '</h6><button type="button"' +
         'id="good_button">Good</button><button type="button" id="bad_button">Bad</button></div>');
   }
   
  
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
       
    });


    var myrooms= $("#grid div");
    var good_button=$("#good_button");
    var bad_button=$("#bad_button");
    good_button.on("click",function(){
         var good_num = parseInt(good_button.siblings('.room_good').text());
        if(good_num<system_room_number){
         var bad_num = parseInt(good_button.siblings('.room_bad').text());
          room_name = good_button.siblings('.room_name').text();
         var data={
            room : room_name,
            good : good_num+1,
            bad : bad_num,
            type : 0
         };
          User_Connection(data);
        }
    });
    bad_button.on("click",function(){
         var good_num =  parseInt(bad_button.siblings('.room_good').text());
         var bad_num =   parseInt(bad_button.siblings('.room_bad').text());
         if(bad_num<system_room_number){
          room_name = bad_button.siblings('.room_name').text();
         var data={
            room : room_name,
            good : good_num,
            bad : bad_num+1,
            type : 1
            
         };
         User_Connection(data);
        }
    });
    function User_Connection(data){
        console.log("i'm on user connection");
        var name = data.room;
       
         socket=io.connect();
      
        socket.emit('room', data);
         $("#grid").remove();
        createCanvas(800, 200);
        background(255);
        fill(255, 81, 0);
        socket.on('mouse',newDrawing);
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

}
function newDrawing(data){
    console.log("data at newDrawing: "+data);
    noStroke();
    fill(255,0,100);
    ellipse(data.x,data.y,40,40);
}
function mousePressed(){
    if(socket != null){
    var data={
        x: mouseX,
        y: mouseY,
        room : room_name
    }
    console.log("data at mousePresseed: "+data);
    socket.emit('mouse',data);
    noStroke();
    fill(255);
    ellipse(mouseX,mouseY,40,40);
    }
}
function draw() {

}