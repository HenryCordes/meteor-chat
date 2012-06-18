Chatrooms = new Meteor.Collection("chatrooms");
Messages = new Meteor.Collection("messages");


if (Meteor.is_client) {

  Meteor.subscribe("chatrooms");

  Session.set("currentRoomName","Initial room");

  Meteor.autosubscribe(function () {
    Meteor.subscribe("messages", Session.get("currentRoomName"));
  });

  Template.chat.roomName = function () {
    return Session.get("currentRoomName");
    //Chatrooms.find({ room_id: Session.get("currentRoomName")});
  };

  Template.chat.messages = function() {
    return Messages.find({}, {sort: { exactdatetime: 1}});
  };

  Template.rooms.chatrooms = function(){
      return Chatrooms.find({}, {sort: { name: -1}});
  };

  Template.chat.roomAvailable = function(){
      return Chatrooms.find({}).count() > 0;
  };

  Template.chat.user = function(){
      return Session.get("currentUser");
  };

  Template.message.useravatar = function(){
      return Session.get("currentUserAvatar");
  };


  Template.chat.events = {
    'click input#start' : function () {
       Session.set("currentUser",$('#name').val());
       Session.set("currentUserAvatar", $('#avatar').val())
       Session.set("currentRoomName",$('#roomname option:selected').text());
       $('#settings-fieldset').slideUp();
       $('.chatroom').fadeIn();
    },
    'click input#send' : function () {
        Messages.insert({room: Session.get("currentRoomName"), 
                         userName: Session.get("currentUser"), 
                         userAvatar: Session.get("currentUserAvatar"),
                         content: $('#message').val(),
                         datetime: getcurrentDateAsString(),
                         exactdatetime: new Date(),
                         scope: 'left'});  
    },
    'click img#add-room' : function () {
        if ($('#chatroom-name').val() != null && $('#chatroom-name').val() != '')
          Chatrooms.insert({name: $('#chatroom-name').val()});
    },
    'click .settings' : function () {
        if ($('#settings-fieldset').is(':visible')){
          $('#settings-fieldset').slideUp();
        }else {
          $('#settings-fieldset').slideDown();
        }
    }
  };
}

if (Meteor.is_server) {

  Meteor.startup(function () {
    if (Chatrooms.find().count() === 0) {
      Chatrooms.insert({name: "Initial room"});
    }


    if (Messages.find().count() === 0) {
      var messagesForChat = ["Hi how are you?",
                   "I am fine and you?"];

       for (var i = 0; i < messagesForChat.length; i++){   
        var scope = 'left';  //(i%2 == 0) ? 'left' : 'right';
        Messages.insert({content: messagesForChat[i], 
                         datetime: getcurrentDateAsString(),
                         exactdatetime: new Date(),
                         room: 1, 
                         scope: scope,
                         userName: 'Henry',
                         userAvatar: 'https://twimg0-a.akamaihd.net/profile_images/96966965/henrycordes.jpg'});


      }
    }
  });


function getcurrentDateAsString()
{
  var dateTime = new Date();

  var curr_day = dateTime.getDay();
  var curr_month = dateTime.getMonth() + 1; //Months are zero based
  var curr_year = dateTime.getFullYear();
  var curr_hours = dateTime.getHours();
  var curr_minutes = dateTime.getMinutes();
  var curr_seconds = dateTime.getSeconds();

  return curr_year + '-' + curr_month + '-'+curr_day+' '+curr_hours+':'+curr_minutes+':'+curr_seconds;
 }

}