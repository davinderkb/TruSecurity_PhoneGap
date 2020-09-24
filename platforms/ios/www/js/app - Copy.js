// Dom7
var $$ = Dom7;
// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'io.framework7.testapp', // App bundle ID
    name: 'Framework7', // App name
    theme: 'auto', // Automatic theme detection
    on: {
        // each object key means same name event handler
        pageInit: function (page) {

            isLogin = localStorage.getItem("loginInfo");


            if (typeof isLogin !== 'undefined' && !isLogin) {
                app.loginScreen.open($$('#my-login-screen')[0], true);
            } else {
                var loginUserData = JSON.parse(isLogin);
                $$('#profileImage').attr("src", "http://trusecurity.emesau.com/" + loginUserData.image);
                $$('#loggedInUser').html(loginUserData.name);
            }

            if (page.name == 'about') {
                var loginUserData = JSON.parse(isLogin);
                getUserDetail(loginUserData.id);
            }

        }
    },

    // App routes
    routes: routes,
    // Enable panel left visibility breakpoint
    panel: {

    },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
    url: '/'
});
var mainView = app.views.create('.navbar-inner', {
    url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
    url: '/'
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();
    app.request.post('http://trusecurity.emesau.com/api/login', {email: username, password: password}, function (data) {
        var obj = JSON.parse(data);
        if (obj.response == 201) {
            localStorage.setItem('loginInfo', JSON.stringify(obj.output));
            app.loginScreen.close('#my-login-screen');
            $$('#profileImage').attr("src", "http://trusecurity.emesau.com/" + obj.output['image']);
            $$('#loggedInUser').html(obj.output['name']);
            loadMyFirstPage();

        } else {
            app.dialog.alert(obj.output, 'Error');
        }
    });

    //


    // Alert username and password

});

function getUserDetail(userID = 0) {
    app.request.get('http://trusecurity.emesau.com/api/get_loggedInUser/' + userID, function (data) {
        var userDataReturn = JSON.parse(data);
        $$('#first_name').val(userDataReturn.first_name);
        $$('#last_name').val(userDataReturn.last_name);
        $$('#mobile').val(userDataReturn.mobile);
        $$('#email').val(userDataReturn.email);
        $$('#userID').val(userDataReturn.id);
    });
}

function loadMyFirstPage(ajax_url = 'http://trusecurity.emesau.com/api/getshift') {

    var isLogin = localStorage.getItem("loginInfo");
    var loginUserData = JSON.parse(isLogin);
    app.request.post(ajax_url, {staff_id: loginUserData.id}, function (data) {
        app.preloader.hide();
        var getData = JSON.parse(data);
        //console.log(getData.allShifts);
        $$('#prevShift').attr('ajax-href', getData.preUrl);
        $$('#nextShift').attr('ajax-href', getData.nextUrl);
        $$('#currentShift').attr('ajax-href', getData.currentShift);
        $$('#shift_title').html(getData.shift_title);

        var itemHTML = ''
        var DayName = {
            1: 'Mon',
            2: 'Tue',
            3: 'Wed',
            4: 'Thu',
            5: 'Fri',
            6: 'Sat',
            0: 'Sun'
        }
        var listData = JSON.parse(getData.allShifts);
        if (listData != '') {
            for (x in listData) {

                itemHTML += '<li>';
                for (y in x) {
                    dclass = '';
                    if (listData[x][y]['is_confirm'] == 1) {
                        dclass = 'greenc';
                    } else if (listData[x][y]['is_confirm'] == 2) {
                        dclass = 'redc';
                    }


                    itemHTML +=
                            '<div class="item-content shift_list" shift-val=' + listData[x][y]['shift_id'] + ':' + listData[x][y]['work_date'] + ':' + listData[x][y]['user_id'] + '> <div class="item-media dayName ' + dclass + '"><center><strong>' + DayName[x] + '</strong> <br><span class="dateView">' + listData[x][0]['on_date_view'] + '</span></center></div><div class="item-inner">' +
                            '<div class="item-title-row">' +
                            '<div class="item-title">' + listData[x][y]['client_name'] + '<br>' + listData[x][y]['time_on'] + ' To ' + listData[x][y]['time_on'] + '</div>' +
                            '</div>' +
                            '</div></div>';

                }
                itemHTML += '</li>';

            }
        } else {
            itemHTML = '<li> <div class="item-content text-center">Sorry No Shift Found</div></li>';
        }

        $$("#myRosters").html(itemHTML);

    });
}

if (app.views.main.router.url == "/") {
    var isLogin = localStorage.getItem("loginInfo");
    if (isLogin != null) {
        app.preloader.show();
        loadMyFirstPage();
    }


}



var dynamicPopup = app.popup.create({
    content: '<div class="popup">' +
            '<div class="block">' +
            '<form class="list" id="my-form"> <div class="list"> <ul> <li> <label class="item-radio item-content"> <input type="radio" name="shtopt" value="1" class="shtopt"/> <i class="icon icon-radio"></i> <div class="item-inner"> <div class="item-title">Accept</div> </div> </label> </li> <li> <label class="item-radio item-content"> <input type="radio" name="shtopt" value="2"  class="shtopt"/> <i class="icon icon-radio"></i> <div class="item-inner"> <div class="item-title">Decline</div> </div> </label> </li> </ul></div><ul  id="declinemfg012"> <li> <div class="item-content item-input"><div class="item-inner" style="padding-bottom:0;"><div class="item-title item-label">Leave Message</div><div class="item-input-wrap"><textarea placeholder="Write.." class="mymessage" id="sad_message0123"></textarea><input type="hidden" value="0" id="shift007"></div></div></div> </li> </ul></form><div class="row"> <div class="col"><a class="button  button-fill convert-form-to-data shtconfirm" href="#">Submit</a></div> <div class="col"><a class="button fill-form-from-data link close-decline popup-close" href="#">Close</a></div></div>' +
            '</div>' +
            '</div>',
    // Events
    on: {
        open: function (popup) {
            //console.log(popup);
        },
        opened: function (popup) {

            // console.log('Popup opened');
        },
    }
});
// Events also can be assigned on instance later
dynamicPopup.on('close', function (popup) {
    //console.log('Popup close');
});
dynamicPopup.on('closed', function (popup) {

    // console.log('Popup closed');
});

$$(document).on('click', '.shtconfirm', function () {
    var opt = $$('input[name=shtopt]:checked').val();
    var msg = $$('.mymessage').val();
    var sval = $$('#shift007').val();
    var sad_message = $$('#sad_message0123').val();
    app.request.post('http://trusecurity.emesau.com/api/staff_accept_decline', {opt: opt, sval: sval, msg: msg,sad_message:sad_message}, function (data) {
        var obj = JSON.parse(data);
        if (obj.response == 201) {
            dynamicPopup.close();
            var ajax_url = 'http://trusecurity.emesau.com/api/getshift?on_date=' + obj.output
            loadMyFirstPage(ajax_url);
        } else {
            app.dialog.alert(obj.output, 'Error');
        }
    });
});

$$(document).on('click', '.shiftViewLink', function () {
    app.preloader.show();
    loadMyFirstPage($$(this).attr('ajax-href'));
});




$$(document).on('click', '#logformApp', function () {
    localStorage.clear();
    app.loginScreen.open($$('#my-login-screen')[0], true);
});
$$(document).on('click', '.shift_list', function () {
    dynamicPopup.open();
    $$('#shift007').val($$(this).attr('shift-val'));
    /*
     $string = ($$(this).val()).split(":");
     var tt = '.node' + $string[1];
     var smartSelect = app.smartSelect.get(tt);
     smartSelect.close();
     console.log(smartSelect.valueEl);
     if ($string[0] == 2) {
     dynamicPopup.open();
     $$('#shift007').val($$(this).val());
     } else {
     
     }*/
});


$$(document).on('click', '.submit-profile-data', function () {
    var formData = app.form.convertToData('#my_profile_Form');
    app.preloader.show();
    app.request.post('http://trusecurity.emesau.com/api/update_profile', {data: JSON.stringify(formData)}, function (data) {

        app.preloader.hide();
        var obj = JSON.parse(data);
        if (obj.response == 200) {
            getUserDetail(obj.output);
            app.dialog.alert('Your Profile Is updated', 'Success');
        } else {
            app.dialog.alert(obj.output, 'Error');
        }


    });



});



// Dummy Content
var songs = ['Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication'];
var authors = ['Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers'];
// Pull to refresh content
var $ptrContent = $$('.ptr-content');
// Add 'refresh' listener on it
$ptrContent.on('ptr:refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
        loadMyFirstPage();
        // When loading done, we need to reset it
        app.ptr.done(); // or e.detail();
    }, 2000);
});





// Init Messages
var messages = app.messages.create({
    el: '.messages',

    // First message rule
    firstMessageRule: function (message, previousMessage, nextMessage) {
        // Skip if title
        if (message.isTitle)
            return false;
        /* if:
         - there is no previous message
         - or previous message type (send/received) is different
         - or previous message sender name is different
         */
        if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name)
            return true;
        return false;
    },
    // Last message rule
    lastMessageRule: function (message, previousMessage, nextMessage) {
        // Skip if title
        if (message.isTitle)
            return false;
        /* if:
         - there is no next message
         - or next message type (send/received) is different
         - or next message sender name is different
         */
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name)
            return true;
        return false;
    },
    // Last message rule
    tailMessageRule: function (message, previousMessage, nextMessage) {
        // Skip if title
        if (message.isTitle)
            return false;
        /* if (bascially same as lastMessageRule):
         - there is no next message
         - or next message type (send/received) is different
         - or next message sender name is different
         */
        if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name)
            return true;
        return false;
    }
});

// Init Messagebar
var messagebar = app.messagebar.create({
    el: '.messagebar'
});

// Response flag
var responseInProgress = false;


// Dummy response
var answers = [
    'Yes!',
    'No',
    'Hm...',
    'I am not sure',
    'And what about you?',
    'May be ;)',
    'Lorem ipsum dolor sit amet, consectetur',
    'What?',
    'Are you sure?',
    'Of course',
    'Need to think about it',
    'Amazing!!!'
]
var people = [
    {
        name: 'Kate Johnson',
        avatar: 'http://lorempixel.com/100/100/people/9'
    },
    {
        name: 'Blue Ninja',
        avatar: 'http://lorempixel.com/100/100/people/7'
    }
];
function receiveMessage() {
    responseInProgress = true;
    setTimeout(function () {
        // Get random answer and random person
        var answer = answers[Math.floor(Math.random() * answers.length)];
        var person = people[Math.floor(Math.random() * people.length)];

        // Show typing indicator
        messages.showTyping({
            header: person.name + ' is typing',
            avatar: person.avatar
        });

        setTimeout(function () {
            // Add received dummy message
            messages.addMessage({
                text: answer,
                type: 'received',
                name: person.name,
                avatar: person.avatar
            });
            // Hide typing indicator
            messages.hideTyping();
            responseInProgress = false;
        }, 4000);
    }, 1000);
}

// Broken:

// Works:
//setTimeout(() => app.loginScreen.open($$('#my-login-screen')[0], true), 1000);