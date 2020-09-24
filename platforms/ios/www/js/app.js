// Dom7
var $$ = Dom7;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2, u = 'K') {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (u == "K")
        dist = dist * 1.609344;
    if (u == "N")
        dist = dist * 0.8684;
//console.log(dist);
if (isNaN(dist))
    dist = 0;
return dist

/*var R = 5; // Radius of the earth in km
 var dLat = deg2rad(lat2 - lat1);  // deg2rad below
 var dLon = deg2rad(lon2 - lon1);
 var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 var d = R * c; // Distance in km
 return d;*/
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
// Framework7 App main instance
var app = new Framework7({
    statusbar: {
        enabled: true,
        overlay: false,
        iosOverlaysWebView: false,
        scrollTopOnClick: true,
        materialBackgroundColor: "#2196F3",
        iosBackgroundColor: "#2196F3"
    },
root: '#app', // App root element
id: 'io.framework7.testapp', // App bundle ID
name: 'Framework7', // App name
theme: 'auto', // Automatic theme detection
on: {
    // each object key means same name event handler
    pageInit: function (page) {

        isLogin = localStorage.getItem("loginInfo");
        var loginUserData = JSON.parse(isLogin);
        if (loginUserData != null) {
            CompanyURLSet = loginUserData.companyURL;
            getChatAdmins(loginUserData.id);
        } else {
            CompanyURLSet = '';
        }
        if (typeof isLogin !== 'undefined' && !isLogin) {
            app.loginScreen.open($$('#my-login-screen')[0], true);
        } else {
            var loginUserData = JSON.parse(isLogin);
            $$('#profileImage').attr("src", CompanyURLSet + '/' + loginUserData.image);
            $$('#loggedInUser').html(loginUserData.name);
            var BolComp = loginUserData.setting.APPNAME;
            $$('#companyLoginName').html(BolComp);
        }
        var calendarDefault = app.calendar.create({
            inputEl: '#from-date-calendar-frm',
            dateFormat: 'dd/mm/yyyy'
        });
        var calendarDefault = app.calendar.create({
            inputEl: '#to-date-calendar-frm',
            dateFormat: 'dd/mm/yyyy'
        });
        var calendarDefault = app.calendar.create({
            inputEl: '#lic_expiry_date',
            dateFormat: 'dd/mm/yyyy'
        });
        if (loginUserData != null) {
            getNewChatMessageNoti(loginUserData.id);
        }


        if (page.name == 'index') {
            var isLogin = localStorage.getItem("loginInfo");
            if (isLogin != null) {
                app.preloader.show();
                loadMyFirstPage();
            }
        }
        if (page.name == 'apply_leave') {
            getUserLeave(loginUserData.id);
        }

        if (page.name == 'chat') {
            var $isadminYes = $$("#isadminYes").val()
            getUserChatDetail(loginUserData.id, $isadminYes);
            localStorage.setItem('adminChatID', $isadminYes);
            $$(document).on('change', '#navAdmins', function () {
                getUserChatDetail(loginUserData.id, $$(this).val());
                localStorage.setItem('adminChatID', $$(this).val());

            });

            setInterval(update, 3000);
        }
        if (page.name == 'about') {

            getUserDetail(loginUserData.id);
            get_lic_type(1);
        }



        if (page.name == 'venue_info') {
            var userID = loginUserData.id;
            get_venue(page.route.query.id, page.route.query.UserAllowShiftID, page.route.query.staff_time_on, page.route.query.staff_time_off, page.route.query.staff_time_on_full, page.route.query.staff_time_off_full, page.route.query.allowCheckin, userID);
        }
    }
},

// App routes
routes: routes,
// Enable panel left visibility breakpoint
panel: {

},

});



// A button will call this function
// To capture photo
$$(document).on('click', '#but_take', function () {
// Take picture using device camera and retrieve image as base64-encoded string
navigator.camera.getPicture(uploadPhoto, onFail, {
    quality: 50, destinationType: Camera.DestinationType.FILE_URI
});
});

// A button will call this function
// To select image from gallery
$$(document).on('click', '#but_select', function () {
// Retrieve image file location from specified source
navigator.camera.getPicture(uploadPhoto, onFail, {
    quality: 50,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit: true,
    destinationType: Camera.DestinationType.FILE_URI
});
});

function uploadPhoto(imageURI) {
//If you wish to display image on your page in app
// Get image handle
var largeImage = document.getElementById('largeImage');

// Unhide image elements
largeImage.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
largeImage.src = imageURI;
$$("#myupload_img").val(imageURI);
}
$$(document).on('click', '#upLic989', function () {
    var isLogin = localStorage.getItem("loginInfo");
    var loginUserData = JSON.parse(isLogin);
    userid = loginUserData.id
    imageURI = $$("#myupload_img").val();
    var options = new FileUploadOptions();
    options.fileKey = "file_name";

    var imagefilename = userid + Number(new Date()) + ".jpg";
    options.fileName = imagefilename;
    options.mimeType = "image/jpg";

    var params = new Object();
    params.imageURI = imageURI;
    params.selectOpt = $$("#file_label_type").val();
    params.license_category_id = $$("#license_category_id").val();
    params.licence_no = $$("#licence_no").val();
    params.expiry_date = $$("#lic_expiry_date").val();
    params.doc_expiry_date_escape = $$("#doc_expiry_date_escape").val();


    params.user_id = userid;
    options.params = params;
    options.chunkedMode = false;
    var ft = new FileTransfer();
    var url = CompanyURLSet + '/api/upload_license/';
    ft.upload(imageURI, url, win, fail, options, true);



});

//Success callback
function win(r) {
    if (app.dialog.alert("License uploaded successfully", 'Success')) {
        app.popup.close('.popup-uploadLic');
        var isLogin = localStorage.getItem("loginInfo");
        var loginUserData = JSON.parse(isLogin);
        userID = loginUserData.id
        update_user_lic(userID);
    }
}
//Failure callback
function fail(error) {
    alert("There was an error uploading image");
}
// Called if something bad happens.
// 
function onFail(message) {
    alert('Failed because: ' + message);
}


function getNewChatMessageNoti(user_id = null) {
    app.request.get(CompanyURLSet + '/api/get_new_message_noti/' + user_id, function (chatNoti) {
        if (chatNoti != 0) {
            $$("#showChatNoti007").html(chatNoti);
            $$("#showChatNoti007Div").show();
//            var notificationFull = app.notification.create({
//                title: 'Messsage',
//                text: 'You have now message, please check your inbox',
//                closeTimeout: 3000,
//            });
//            notificationFull.open();
} else {
    $$("#showChatNoti007Div").hide();
}
});
}

function getUserLeave(user_id) {

    app.request.get(CompanyURLSet + '/api/get_applied_leave/' + user_id, function (leaveData) {
        var AppliedLeave = JSON.parse(leaveData);
        $htmlAppliedLeave = '';
        for (x in AppliedLeave) {
            if (AppliedLeave[x]['ApplyForHoliday']['status'] == 0) {
                status = "Pending";
            } else if (AppliedLeave[x]['ApplyForHoliday']['status'] == 1) {
                status = "Accepted";
            } else if (AppliedLeave[x]['ApplyForHoliday']['status'] == 2) {
                status = "Decline";
            }
            if (AppliedLeave[x]['ApplyForHoliday']['on_date'] == AppliedLeave[x]['ApplyForHoliday']['to_date']) {
                $title = AppliedLeave[x]['ApplyForHoliday']['on_date'] + " " + status;
            } else {
                $title = AppliedLeave[x]['ApplyForHoliday']['on_date'] + " To " + AppliedLeave[x]['ApplyForHoliday']['on_date'] + " " + status;
            }
            $leaveDesc = "<strong>Form:</strong>" + AppliedLeave[x]['ApplyForHoliday']['on_date'] + " <strong>To:</strong>" + AppliedLeave[x]['ApplyForHoliday']['on_date'] + "<br><strong>Status:</strong>" + status;
            if (AppliedLeave[x]['ApplyForHoliday']['reason'] != '') {
                $leaveDesc += "<p><strong>Reason:</strong><br>" + AppliedLeave[x]['ApplyForHoliday']['reason'] + "</p>";
            }
            if (AppliedLeave[x]['ApplyForHoliday']['admin_msg'] != '') {
                $leaveDesc += "<p><strong>Admin Reply:</strong><br>" + AppliedLeave[x]['ApplyForHoliday']['admin_msg'] + "</p>";
            }

            $htmlAppliedLeave += '<li class="accordion-item"><a href="#" class="item-content item-link"><div class="item-inner"><div class="item-title">' + $title + '</div></div></a><div class="accordion-item-content"><div class="block"><p>' + $leaveDesc + '</p></div></div></li>';
        }
        $$("#userShowAllLeave").html($htmlAppliedLeave);
    });
}

function get_venue(id, UserAllowShiftID = '', staff_time_on = '', staff_time_off = '', staff_time_on_full = '', staff_time_off_full = '', allowCheckin = 0, userID) {
    app.preloader.show();

    $$("#preAttendanceDiv").hide();
    $$("#attendanceDiv").hide();

    $$("#checkIn").hide();
    $$("#checkOut").hide();
    $$("#checkInShow").hide();
    $$("#checkOutShow").hide();
    $$("#stafftimeAreaLinksError").hide();
    var venueLat = "";
    var venueLong = "";
    var openClass = "";
    app.request.get(CompanyURLSet + '/api/get_venue/' + id, function (data) {
        app.preloader.hide();
        var client = JSON.parse(data);
        venueLat = client.Client.loc_lat;
        venueLong = client.Client.loc_long;
        openClass = '.venue-' + client.Client.id;

        $$("#stafftimeAreaLinks").addClass('venue-' + client.Client.id);
        $$("#checkIn").attr('UserAllowShiftID-id', UserAllowShiftID);
        $$("#checkOut").attr('UserAllowShiftID-id', UserAllowShiftID);


        $html_address = ' <table>';
        $html_address += ' <tr><th class="label-cell">Street: </th><td class="numeric-cell">' + client.ClientInformation.street + '</td></tr>';
        $html_address += ' <tr><th class="label-cell">Suburb: </th><td class="numeric-cell">' + client.ClientInformation.suburb + '</td></tr>';
        $html_address += ' <tr><th class="label-cell">State: </th><td class="numeric-cell">' + client.ClientInformation.state + '</td></tr>';
        $html_address += ' <tr><th class="label-cell">Postcode: </th><td class="numeric-cell">' + client.ClientInformation.postcode + '</td></tr>';
        $html_address += '</table>';
        $$("#venueAddressArea").html($html_address);
        if (client.ClientInformation.uniform_required != '' && client.ClientInformation.uniform_required == 1) {
            var uniform_required = "Yes";
        } else {
            var uniform_required = "No";
        }
        $html_venue_guideline = ' <table>';
        $html_venue_guideline += ' <tr><th class="label-cell">Manager To Report: </th><td class="numeric-cell">' + client.ClientInformation.manager_to_report + '</td></tr>';
        $html_venue_guideline += ' <tr><th class="label-cell">Supervisor To Report: </th><td class="numeric-cell">' + client.ClientInformation.supervisor_to_report + '</td></tr>';
        $html_venue_guideline += ' <tr><th class="label-cell">Uniform Required: </th><td class="numeric-cell">' + uniform_required + '</td></tr>';
        $html_venue_guideline += ' <tr><td class="label-cell" colspan="2"><strong>Uniform</strong><div>'+client.ClientInformation.uniform_description+'</div></td></tr>';
        $html_venue_guideline += '</table>';
        $$("#venueGuidelineArea").html($html_venue_guideline);

    /*$html_venue_detail = ' <table>';
     $html_venue_detail += ' <tr><th class="label-cell">Name: </th><td class="numeric-cell">' + client.Client.short_name + '</td></tr>';
     $html_venue_detail += ' <tr><th class="label-cell">Email: </th><td class="numeric-cell">' + client.Client.email + '</td></tr>';
     $html_venue_detail += ' <tr><th class="label-cell">Phone: </th><td class="numeric-cell">' + client.Client.phone + '</td></tr>';
     $html_venue_detail += ' <tr><th class="label-cell">Mobile: </th><td class="numeric-cell">' + client.Client.mobile + '</td></tr>';
     $html_venue_detail += '</table>';
     $$("#venueDetailArea").html($html_venue_detail);*/





 });



    if (allowCheckin == 1) {

        $$("#preAttendanceDiv").hide();
        $$("#attendanceDiv").show();

        app.request.post(CompanyURLSet + '/api/checkinoutTime', {user_allow_shift_id: UserAllowShiftID, user_id: userID}, function (data) {
            var checkinoutTime = JSON.parse(data);
            console.log(checkinoutTime);
            if (checkinoutTime.check_in != '00:00:00') {
                $$('#checkInShow').html("Check In: " + checkinoutTime.check_in);
                $$('#checkInShow').show();
                $$("#checkIn").hide();
            } else {
                var watchID = navigator.geolocation.watchPosition(onSuccessCheckIn, onError, {timeout: 30000, speed: 3000});

            }
            if (checkinoutTime.check_out != '00:00:00') {
                $$('#checkOutShow').html("Check Out: " + checkinoutTime.check_out);
                $$('#checkOutShow').show();
                $$("#checkOut").hide();
            } else {
                if (checkinoutTime.check_in != '00:00:00') {
                    var watchIDOut = navigator.geolocation.watchPosition(onSuccessCheckOut, onError, {timeout: 30000, speed: 3000});
                }
            }

        });



// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccessCheckIn(position) {
    var distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, venueLat, venueLong);
    var leftDis = distance.toString().split(".")[0];
    if (leftDis <= 2) {
        app.request.post(CompanyURLSet + '/api/checkinoutTime', {user_allow_shift_id: UserAllowShiftID, user_id: userID}, function (data) {
            var checkinoutTime = JSON.parse(data);
            if (checkinoutTime.check_in != '00:00:00') {
                $$('#checkInShow').html("Check In: " + checkinoutTime.check_in);
                $$('#checkInShow').show();
                $$("#checkIn").hide();
            } else {
                $$('#checkInShow').hide();
                $$("#checkIn").show();
            }
        });

        $$("#stafftimeAreaLinksError").hide();

    } else {
        app.request.post(CompanyURLSet + '/api/checkinoutTime', {user_allow_shift_id: UserAllowShiftID, user_id: userID}, function (data) {
            var checkinoutTime = JSON.parse(data);
            if (checkinoutTime.check_in == '00:00:00') {
                $$("#checkIn").show().attr('confirm-checkin', 'You are not near the location, however would you still like to check in?');;
                // $$("#stafftimeAreaLinksError").html('Please come to near venue location');
                $$("#stafftimeAreaLinksError").show();
            }
        });
    }

}
function onSuccessCheckOut(position) {
    var distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, venueLat, venueLong);
    var leftDis = distance.toString().split(".")[0];

    if (leftDis == 0) {

        app.request.post(CompanyURLSet + '/api/checkinoutTime', {user_allow_shift_id: UserAllowShiftID, user_id: userID}, function (data) {
            var checkinoutTime = JSON.parse(data);
            if (checkinoutTime.check_out != '00:00:00' && checkinoutTime.check_in != '00:00:00') {
                $$('#checkOutShow').html("Check In: " + checkinoutTime.check_in);
                $$('#checkOutShow').show();
                $$("#checkOut").hide();
            } else {
                $$("#checkOut").show();
                $$('#checkOutShow').hide();
            }
        });
        $$("#stafftimeAreaLinksError").hide();
    } else {
        app.request.post(CompanyURLSet + '/api/checkinoutTime', {user_allow_shift_id: UserAllowShiftID, user_id: userID}, function (data) {
            var checkinoutTime = JSON.parse(data);
            if (checkinoutTime.check_out == '00:00:00' && checkinoutTime.check_in != '00:00:00') {
                $$("#checkOut").show().attr('confirm-checkout', 'You are not near the location, however would you still like to check out?');
                // $$("#stafftimeAreaLinksError").html('Please come to near venue location');
                $$("#stafftimeAreaLinksError").show();
            }
        });
    }

}


// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + 'n' + 'message: ' + error.message + 'n');
}




    // Upload License/Qualification.



    // Options: throw an error if no update is received every 30 seconds.
    $$(document).on('click', '#checkIn', function () {

        app.preloader.show();

        if ( $$(this).attr('confirm-checkin') ) {
            var confirmCheckIn = confirm( $$(this).attr('confirm-checkin') );
            if ( confirmCheckIn == true ) {

            } else {
                app.preloader.hide();
                return true;
            }
        }

        var _this = $$(this);
        var  watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError );

        function onSuccess( position ) {

            var task_id = _this.attr('UserAllowShiftID-id');
            isLogin = localStorage.getItem("loginInfo");
            var loginUserData = JSON.parse(isLogin);
            var userID = loginUserData.id;
            
            var checkInData = {
                user_allow_shift_id: task_id,
                user_id: userID,
                check_in_lat: position.coords.latitude,
                check_in_long: position.coords.longitude
            };

            app.request.post(CompanyURLSet + '/api/checkin', checkInData, function (data) {
                _this.remove();
                $$('#checkInShow').html("Check In: " + data);
                $$('#checkInShow').show();
                var watchIDOut = navigator.geolocation.watchPosition(onSuccessCheckOut, onError, {timeout: 30000, speed: 3000});
                app.preloader.hide();
            });            
        }

        function onError( error ) {
            alert( error.message );
        }

        app.preloader.hide();

    });
    $$(document).on('click', '#checkOut', function () {

        app.preloader.show();

        if ( $$(this).attr('confirm-checkout') ) {
            var confirmCheckIn = confirm( $$(this).attr('confirm-checkout') );
            if ( confirmCheckIn == true ) {

            } else {
                app.preloader.hide();
                return true;
            }
        }

        var _this = $$(this);
        var  watchOutID = navigator.geolocation.getCurrentPosition( onSuccess, onError);

        function onSuccess( position ) {

            var task_id = _this.attr('UserAllowShiftID-id');
            isLogin = localStorage.getItem("loginInfo");
            var loginUserData = JSON.parse(isLogin);
            var userID = loginUserData.id;
            
            var checkOutData = {
                user_allow_shift_id: task_id,
                user_id: userID,
                check_out_lat: position.coords.latitude,
                check_out_long: position.coords.longitude
            };

            app.request.post(CompanyURLSet + '/api/checkout', checkOutData, function (data) {
                _this.remove();
                $$('#checkOutShow').html("Check Out: " + data);
                $$('#checkOutShow').show();
                app.preloader.hide();
            });            
        }

        function onError( error ) {
            alert( error.message );
        }

        app.preloader.hide();

    });

} else {
    $$("#preAttendanceDiv").show();
    $$("#attendanceDiv").hide();

    app.request.post(CompanyURLSet + '/api/checkinoutTime', {user_allow_shift_id: UserAllowShiftID, user_id: userID}, function (data) {
        var checkinoutTime = JSON.parse(data);
        console.log(checkinoutTime);
        if (checkinoutTime.check_in != '00:00:00') {
            $$('#precheckInShow').html("Check In: " + checkinoutTime.check_in);
            $$('#precheckInShow').show();

        }
        if (checkinoutTime.check_out != '00:00:00') {
            $$('#precheckOutShow').html("Check Out: " + checkinoutTime.check_out);
            $$('#precheckOutShow').show();

        }

    });
}
}

$$(document).on('click', '#applyLeave789456', function () {
    if ($$("#from-date-calendar-frm").val() == '') {
        app.dialog.alert('Please Select From Date.', 'Warning!');
    } else {
        var formData = app.form.convertToData('#form968354');
        isLogin = localStorage.getItem("loginInfo");
        var loginUserData = JSON.parse(isLogin);
        var userID = loginUserData.id;
        formData.user_id = userID;

        app.request.post(CompanyURLSet + '/api/apply_leave', formData, function (data) {
            var obj = JSON.parse(data);
            if (obj.response == 201) {
                $$("#from-date-calendar-frm").val('');
                $$("#to-date-calendar-frm").val('');
                $$("#leave_reason").val('');
                getUserLeave(userID);
                app.dialog.alert('You Leave Request Send To Administrator.', 'Success!');
            } else {
                app.dialog.alert(obj.output, 'Warning!');
            }
        });


    }
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
$$('#staff_signUP').on('click', function () {
// app.preloader.show();
var first_name = $$('#my-signup-screen [name="signup_first_name"]').val();
var last_name = $$('#my-signup-screen [name="signup_last_name"]').val();
var mobile = $$('#my-signup-screen [name="signup_mobile"]').val();
var email = $$('#my-signup-screen [name="signup_email"]').val();
var companyID = $$('#my-signup-screen [name="signup_companyID"]').val();
app.request.post('http://emesau.com/api/get_info', {companyID: companyID}, function (companyURL) {
    if (companyURL != '') {
        app.request.post(companyURL + '/api/signup', {first_name: first_name, last_name: last_name, mobile: mobile, email: email}, function (data) {
            // app.preloader.hide();
            var obj = JSON.parse(data);
            if (obj.response == 201) {
                if (app.dialog.alert(obj.output, 'Success')) {
                    app.popup.close('.popup-signUP');
                }
            } else {
                app.dialog.alert(obj.output, 'Warning!');
            }
        });

    } else {
        app.preloader.hide();
        app.dialog.alert('CompanyID not found', 'Warning!');
    }
});
});
$$('#my-login-screen .login-button').on('click', function () {
    app.preloader.show();
    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();
    var companyID = $$('#my-login-screen [name="companyID"]').val();

    if (companyID != '' && username != '' && password != '') {
        app.request.post('http://emesau.com/api/get_info', {companyID: companyID}, function (companyURL) {
            if (companyURL != '') {

                app.request.post(companyURL + '/api/login', {email: username, password: password, companyID: companyID}, function (data) {
                    app.preloader.hide();
                    var obj = JSON.parse(data);
                    if (obj.response == 201) {
                        obj.output.companyURL = companyURL;
                        localStorage.setItem('loginInfo', JSON.stringify(obj.output));
                        app.loginScreen.close('#my-login-screen');
                        $$('#profileImage').attr("src", companyURL + "/" + obj.output['image']);
                        $$('#loggedInUser').html(obj.output['name']);
                        var BolComp = obj.output['setting']['APPNAME'];
                        $$('#companyLoginName').html(BolComp);
                        var ajax_url = companyURL + '/api/getshift'
                        loadMyFirstPage(ajax_url);
                    } else {
                        app.dialog.alert(obj.output, 'Warning!');
                    }
                });

            } else {
                app.preloader.hide();
                app.dialog.alert('CompanyID not found', 'Warning!');
            }
        });
    } else {
        app.preloader.hide();
        app.dialog.alert('All fields are required', 'Warning!');
    }

//


// Alert username and password

});


function update_user_lic(userID = null) {
    app.request.get(CompanyURLSet + '/api/licenses/' + userID, function (data) {
        var licensesData = JSON.parse(data);
        console.log(licensesData);
        $htmlLic = '';
        for (key in licensesData) {
            $titleSet = '';
            if (licensesData[key]['UsersLicenseCategory']['renewal'] != 0) {
                $titleSet += '(R) ';
            }
            $titleSet += licensesData[key]['LicenseCategory']['name'];
            $SubtitleSet = ''
            if (licensesData[key]['UsersLicenseCategory']['cateTypes'] != '') {
                $SubtitleSet += "[ " + licensesData[key]['UsersLicenseCategory']['cateTypes'] + " ]";
            }
            $licDesc = ''
            if (licensesData[key]['UsersLicenseCategory']['licence_no'] != '') {
                $licDesc += "License Number: " + licensesData[key]['UsersLicenseCategory']['licence_no'];
            }
            if (licensesData[key]['UsersLicenseCategory']['expiry_date'] != '' && licensesData[key]['UsersLicenseCategory']['expiry_date'] != '0000-00-00') {
                $licDesc += ", Expiry: " + licensesData[key]['UsersLicenseCategory']['expiry_date'];
            }
            if (licensesData[key]['UsersLicenseCategory']['doc_expiry_date_escape'] != 0) {
                $licDesc += ", Expiry: Never expire";
            }

            $htmlLic += '<li> <a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">' + $titleSet + '</div></div><div class="item-subtitle">' + $SubtitleSet + '</div><div class="item-text">' + $licDesc + '</div></div> </a></li>';
        }
        $$("#LicenseListingAll").html($htmlLic);

    });
}


function getUserDetail(userID = 0) {
    app.preloader.show();
    app.request.get(CompanyURLSet + '/api/get_loggedInUser/' + userID, function (data) {
        app.preloader.hide();
        var userDataReturn = JSON.parse(data);
        $$('#profile_first_name').val(userDataReturn.first_name);
        $$('#profile_last_name').val(userDataReturn.last_name);
        $$('#profile_mobile').val(userDataReturn.mobile);
        $$('#profile_email').val(userDataReturn.email);
        $$('#profile_id').val(userDataReturn.id);
    });
    update_user_lic(userID);

}

function loadMyFirstPage(ajax_url = '') {
    if (ajax_url == '') {
        ajax_url = CompanyURLSet + '/api/getshift';
    }
    var isLogin = localStorage.getItem("loginInfo");
    var loginUserData = JSON.parse(isLogin);
    app.request.post(ajax_url, {staff_id: loginUserData.id}, function (data) {
        app.preloader.hide();

        var getData = JSON.parse(data);
        console.log(getData.allShifts);
        $$('#prevShift').attr('ajax-href', getData.preUrl);
        $$('#nextShift').attr('ajax-href', getData.nextUrl);
        $$('#currentShift').attr('ajax-href', getData.currentShift);
        $$('#shift_title').html(getData.shift_title);

        $$('#start-roster-date').val(getData.start_date);
        $$('#end-roster-date').val(getData.end_date);
        $$('#roster-userId').val(loginUserData.id);


        var itemHTML = ''
        var DayName = {
            1: 'Mon',
            2: 'Tue',
            3: 'Wed',
            4: 'Thu',
            5: 'Fri',
            6: 'Sat',
            7: 'Sun'
        }
        var listData = JSON.parse(getData.allShifts);
        var mweekDays = getData.weekDays;
        var allowConfirm = getData.allowConfirm;
        if (listData != '') {
            if (allowConfirm == 1) {
                $$('.hide-me').show();
            } else {
                $$('.hide-me').hide();
            }

            for (md in mweekDays) {
                var myShift = listData[md];

                if (listData[md]) {
                    for (y in myShift) {
                        dclass = '';
                        is_accpeted = 0;

                        if (myShift[y]['confirmed_by_staff'] == 1) {
                            dclass = 'greenByStaff';
                            is_accpeted = 1;
                        } else if (myShift[y]['confirmed_by_staff'] == 2) {
                            dclass = 'redc';
                        }
                        if (myShift[y]['is_confirm'] == 1) {
                            dclass = 'greenByAdmin';
                            is_accpeted = 1;
                        } else if (myShift[y]['is_confirm'] == 2) {
                            dclass = 'redc';
                        }

                        if (allowConfirm == 1) {
                            itemHTML += '<li>';
                            itemHTML +=
                            '<label class="item-checkbox item-content"><input class="rosterInfo" type="checkbox" name="rosterInfo" is_accpeted="' + is_accpeted + '" value="' + myShift[y]['shift_id'] + ':' + myShift[y]['work_date'] + ':' + myShift[y]['user_id'] + '"/><i class="icon icon-checkbox"></i> <div class="item-media dayName ' + dclass + '"><center><strong>' + DayName[md] + '</strong> <br><span class="dateView">' + myShift[y]['on_date_view'] + '</span></center></div><div class="item-inner">' +
                            '<div class="item-title-row">' +
                            '<div class="item-title">' + myShift[y]['client_name'] + '<br>' + myShift[y]['time_on'] + ' To ' + myShift[y]['time_off'] + '</div>' +
                            '<a href="/venue_info/?id=' + myShift[y]['client_id'] + '&task_id=' + myShift[y]['task_id'] + '&allowCheckin=' + myShift[y]['allowCheckin'] + '&UserAllowShiftID=' + myShift[y]['UserAllowShiftID'] + '&staff_time_on=' + myShift[y]['staff_time_on'] + '&staff_time_off=' + myShift[y]['staff_time_off'] + '&staff_time_on_full=' + myShift[y]['staff_time_on_full'] + '&staff_time_off_full=' + myShift[y]['staff_time_off_full'] + '" class="item-link viewInfo"><i class="f7-icons">right</i></a></label></div>' +
                            '</div>';
                            itemHTML += '</li>';
                        } else {
                            if (app.device.ios) {
                                var kopl = "37px";
                            } else {
                                var kopl = "28px";
                            }
                            itemHTML += '<li>';

                            itemHTML +=
                            '<label class="item-checkbox item-content"><i class="icon" style="margin-right: ' + kopl + ';"></i> <div class="item-media dayName ' + dclass + '"><center><strong>' + DayName[md] + '</strong> <br><span class="dateView">' + myShift[y]['on_date_view'] + '</span></center></div><div class="item-inner">' +
                            '<div class="item-title-row">' +
                            '<div class="item-title">' + myShift[y]['client_name'] + '<br>' + myShift[y]['time_on'] + ' To ' + myShift[y]['time_off'] + '</div>' +
                            '</div>' +
                            '</div></label>';
                            itemHTML += '</li>';
                        }

                    }
                } else {
                    if (app.device.ios) {
                        var kopl = "37px";
                    } else {
                        var kopl = "28px";
                    }
                    itemHTML += '<li>';

                    itemHTML +=
                    '<label class="item-checkbox item-content"><i class="icon" style="margin-right: ' + kopl + ';"></i> <div class="item-media dayName grayc"><center><strong>' + DayName[md] + '</strong> <br><span class="dateView">' + mweekDays[md] + '</span></center></div><div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">N/A</div>' +
                    '</div>' +
                    '</div></label>';
                    itemHTML += '</li>';

                }

            }


        } else {
            itemHTML = '<li class="item-content"> <div class="block"><div class="row" style="margin-left:16px;"><div class="item-content text-center">Sorry No Shift Found</div></div></div></li>';
            $$('.hide-me').hide();
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
    '<form class="list" id="my-form"><ul  id="declinemfg012"> <li> <div class="item-content item-input"><div class="item-inner" style="padding-bottom:0;"><div class="item-title item-label">Why?</div><div class="item-input-wrap"><textarea placeholder="Write.." class="mymessage" id="sad_message0123"></textarea><input type="hidden" value="0" id="shift007"></div></div></div> </li> </ul></form><div class="row"> <div class="col"><a class="button  button-fill convert-form-to-data shtconfirm" href="#">Submit</a></div> <div class="col"><a class="button fill-form-from-data link close-decline popup-close" href="#">Close</a></div></div>' +
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

$$(document).on('click', '.accept-roster', function () {

    var $info = 0;
    $$(".rosterInfo").each(function () {
        if ($$(this).is(":checked")) {
            $info = 1;
        }
    });
    if ($info == 1) {
        var formData = app.form.convertToData('#my-form-roster');

        app.request.post(CompanyURLSet + '/api/confirm_roster/1', formData, function (data) {
            var obj = JSON.parse(data);
            if (obj.response == 201) {
                var ajax_url = CompanyURLSet + '/api/getshift?on_date=' + obj.output
                loadMyFirstPage(ajax_url);
            } else {
                app.dialog.alert(obj.output, 'Warning!');
            }
        });
    } else {
        app.dialog.alert('Please select at least one shift.', 'Warning!');
    }
});
$$(document).on('click', '.decline-roster', function () {
    var formData = app.form.convertToData('#my-form-roster');
    var $info = 0;
    var hasAccpeted = 0;
    $$(".rosterInfo").each(function () {
        if ($$(this).is(":checked")) {
            $info = 1;
            if ($$(this).attr("is_accpeted") == 1) {
                hasAccpeted = 1;
            }
        }

    });
    if (hasAccpeted == 1) {
        app.dialog.alert('You can not decline accepted shift, please contact to your manager.', 'Warning!');
    } else {
        if ($info == 1) {
            dynamicPopup.open();
            $$('#shift007').val(JSON.stringify(formData));
        } else {
            app.dialog.alert('Please select at least one shift.', 'Warning!');
        }
    }
});
$$(document).on('click', '.shtconfirm', function () {
    var sval = $$('#shift007').val();
    var sad_message = $$('#sad_message0123').val();
    app.request.post(CompanyURLSet + '/api/decline_roster', {sval: sval, sad_message: sad_message}, function (data) {
        var obj = JSON.parse(data);
        if (obj.response == 201) {
            dynamicPopup.close();
            var ajax_url = CompanyURLSet + '/api/getshift?on_date=' + obj.output
            loadMyFirstPage(ajax_url);
        } else {
            app.dialog.alert(obj.output, 'Warning!');
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


$$(document).on('click', '#submit-profile-data', function () {
    var formData = app.form.convertToData('#my_profile_Form');
    app.preloader.show();
    app.request.post(CompanyURLSet + '/api/update_profile', {data: JSON.stringify(formData)}, function (data) {

        app.preloader.hide();
        $$('.hide-me').show();
        var obj = JSON.parse(data);
        if (obj.response == 200) {
            getUserDetail(obj.output);
            app.dialog.alert('Your Profile Is updated', 'Success');
        } else {
            app.dialog.alert(obj.output, 'Warning!');
        }


    });



});




function newMessage() {
    message = $$("#messageTxt").val();
    var isLogin = localStorage.getItem("loginInfo");
    var loginUserData = JSON.parse(isLogin);

    $adminChatID = localStorage.getItem("adminChatID");
    if ($adminChatID != 0) {
        app.request.post(CompanyURLSet + '/api/send_msg', {sender_id: loginUserData.id, receiver_id: $adminChatID, msg_text: message}, function (data) {
            var d = new Date();
            curDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            $$('<div class="message message-sent"><div class="message-content"><div class="message-bubble"><div class="message-text">' + message + '</div></div><div class="message-footer">' + curDate + '</div></div></div>').appendTo($$('.messages'));
            $$("#messageTxt").val(null);
            $$(".page-content").scrollTop($$(".messages")[0].scrollHeight);
        });
    }

}

function update() {
    var isLogin = localStorage.getItem("loginInfo");
    var loginUserData = JSON.parse(isLogin);
    id = loginUserData.id
    $adminChatID = localStorage.getItem("adminChatID");
    app.request.get(CompanyURLSet + '/api/get_messages/' + id + '/' + $adminChatID, function (data) {
        if (data != '[]') {
            obj = JSON.parse(data);
            if (typeof obj !== 'undefined') {
                for (x in obj) {
                    $$('<div class="message message-received"><div class="message-content"><div class="message-bubble"><div class="message-text">' + obj[x]['Message']['msg_text'] + '</div></div><div class="message-footer">' + obj[x]['Message']['created'] + '</div></div></div>').appendTo($$('.messages'));
                    $$(".page-content").scrollTop($$(".messages")[0].scrollHeight);
                }
            }
        }
    });

}

var dynamicPopupSelectAdmin = app.popup.create({
    content: '<div class="popup"><div class="block"></div></div>'
});

function getChatAdmins($user_id = 0) {

    app.request.get(CompanyURLSet + '/api/chat_admins/' + $user_id, function (data) {
        var obj = JSON.parse(data);
        navAdmins = "<option value=''>--Select--</option>";
        if (obj.administrators != '') {
            $$("#selectAdminArea").show();
            listAdmin = obj.administrators;
            first = true;
            for (ad in listAdmin) {
                navAdmins += "<option value='" + ad + "'>" + listAdmin[ad] + "</option>";
            }
            $$("#navAdmins").html(navAdmins);
        }
        $$("#isadminYes").val(obj.SuperAdminFatch);
        if (obj.SuperAdminFatch == 1) {
            $$("#selectAdminArea").hide();
        }
    });



}

function getUserChatDetail($user_id = 0, $isadminYes = 1) {
    app.preloader.show();
    if ($isadminYes == 0) {
        app.preloader.hide();
        $$(".messages").html("<div>Plese Select Administrator</div>");
    } else {
        app.request.get(CompanyURLSet + '/api/chat/' + $user_id + "/" + $isadminYes, function (data) {
            app.preloader.hide();
            var obj = JSON.parse(data);


            if (obj.messages != '' && obj.adminCount != 0) {
                allMessages = obj.messages;
                pushMsgs = '';
                for (x in allMessages) {
                    if (allMessages[x]['Message']['sender_id'] == $user_id) {
                        $liClass = "message-sent";
                    } else {
                        $liClass = "message-received";

                    }
                    pushMsgs += '<div class="message ' + $liClass + '"><div class="message-content"><div class="message-bubble"><div class="message-text">' + allMessages[x]['Message']['msg_text'] + '</div></div><div class="message-footer">' + allMessages[x]['Message']['created'] + '</div></div></div>';

                }
                $$(".messages").html(pushMsgs);
                $$(".page-content").scrollTop($$(".messages")[0].scrollHeight);

            } else {
                $$(".messages").html('');
            }

        });
    }

}
$$(document).on('click', '.send-link', function () {
    newMessage();
});

function get_lic_type(lic_type = null) {
    app.request.get(CompanyURLSet + '/api/get_license_type/' + lic_type, function (data) {
        var lics = JSON.parse(data);
        $options = '';
        for (x in lics) {
            $options += '<option value="' + x + '">' + lics[x] + '</option>';
        }
        $$("#license_category_id").html($options);

    });
}
$$(document).on('change', '#file_label_type', function () {
    lic_type = $$(this).val();
    get_lic_type(lic_type);
});

