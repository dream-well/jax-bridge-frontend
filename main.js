$('document').ready(function() {
  $("#mintingButton").click(function(){
    $(".how-content").removeClass("show");
    $("#mintingContent").addClass("show");
    $(".btn-how").removeClass("selected");
    $("#mintingButton").addClass("selected");
  });

  $("#burningButton").click(function(){
    $(".how-content").removeClass("show");
    $("#burningContent").addClass("show");
    $(".btn-how").removeClass("selected");
    $("#burningButton").addClass("selected");
  });

  $("#receiveButton").click(function(){
    $(".how-content").removeClass("show");
    $("#receiveContent").addClass("show");
    $(".btn-how").removeClass("selected");
    $("#receiveButton").addClass("selected");
  });

  var togglePartnerSelect = function(infoId, stackId) {
    if($(infoId).hasClass("hidden")){
      $(".stacks").removeClass("unselected");
      $(".partner-desc").addClass("hidden");
      $(infoId).removeClass("hidden");
      $(".stack").removeClass("selected");
      $(stackId).addClass("selected");
    } else {
      $(".stacks").addClass("unselected");
      $(".partner-desc").addClass("hidden");
      $(".stack").removeClass("selected");
    }
  }

  $("#wbtcdaoInfo").click(function()  {
    togglePartnerSelect("#wbtcdaoInfo", "#stackThree");
  });

  $("#partner-join").click(function()  {
    $("#mc-embedded-subscribe-form").attr("action", "https://bitgo.us19.list-manage.com/subscribe/post?u=7ff4a7177706c9d17f9e67de2&amp;id=9e8945b50a");
    $("#exampleModalLabel").html("Join the WBTC network");
    $("#mc-embedded-subscribe").val("Join");
    $("#textarea-header").html("Comments");
  });

  $("#example-button").click(function()  {
    $("#mc-embedded-subscribe-form").attr("action", "https://bitgo.us19.list-manage.com/subscribe/post?u=7ff4a7177706c9d17f9e67de2&amp;id=44975c3c5b");
    $("#exampleModalLabel").html("Get more info on WBTC");
    $("#mc-embedded-subscribe").val("Keep me Informed");
    $("#textarea-header").html("Have a question?");
  });

  $("#stackThree").click(function()  {
    togglePartnerSelect("#wbtcdaoInfo", "#stackThree");
  });

  $("#merchantsInfo").click(function()  {
    togglePartnerSelect("#merchantsInfo", "#stackTwo");
  });
  $("#stackTwo").click(function()  {
    togglePartnerSelect("#merchantsInfo", "#stackTwo");
  });

  $("#custodiansInfo").click(function()  {
    togglePartnerSelect("#custodiansInfo", "#stackOne");
  });
  $("#stackOne").click(function()  {
    togglePartnerSelect("#custodiansInfo", "#stackOne");
  });


  var scrollTo = function($element) {
    $('html,body').animate({scrollTop: $element.offset().top},'slow');
  };

  $("#whyButton").click(function() {
    scrollTo($('#whySection'));
  });
  $("#faqbtn").click(function() {
    scrollTo($('#faq'));
  });

  $("#whatIsButton").click(function() {
    scrollTo($('#whatSection'));
  })
});


// googls auth 

 function onSignIn(googleUser) {
  
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  const sign_in = document.querySelector('.cent_wh_bg h1');
  const use_google = document.querySelector('.cent_wh_bg p');
  const btn_google = document.querySelector('.cent_wh_bg .g-signin2');

  const  cong_text= document.getElementById("signed_ggl");
    

  if (sign_in && use_google && btn_google) {
      sign_in.remove();
      use_google.remove();
      btn_google.remove();
      signed_ggl.classList.add("active");
  }

  document.getElementById('Ggl_name').textContent = profile.getName();

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
}


// sign out 

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
          


  // option

//   $('select').each(function () {

//     // Cache the number of options
//     var $this = $(this),
//         numberOfOptions = $(this).children('option').length;

//     // Hides the select element
//     $this.addClass('s-hidden');

//     // Wrap the select element in a div
//     $this.wrap('<div class="select"></div>');

//     // Insert a styled div to sit over the top of the hidden select element
//     $this.after('<div class="styledSelect"></div>');

//     // Cache the styled div
//     var $styledSelect = $this.next('div.styledSelect');

//     // Show the first select option in the styled div
//     $styledSelect.text($this.children('option').eq(0).text());

//     // Insert an unordered list after the styled div and also cache the list
//     var $list = $('<ul />', {
//         'class': 'options'
//     }).insertAfter($styledSelect);

//     // Insert a list item into the unordered list for each select option
//     for (var i = 0; i < numberOfOptions; i++) {
//         $('<li />', {
//             text: $this.children('option').eq(i).text(),
//             rel: $this.children('option').eq(i).val()
//         }).appendTo($list);
//     }

//     // Cache the list items
//     var $listItems = $list.children('li');

//     // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
//     $styledSelect.click(function (e) {
//         e.stopPropagation();
//         $('div.styledSelect.active').each(function () {
//             $(this).removeClass('active').next('ul.options').hide();
//         });
//         $(this).toggleClass('active').next('ul.options').toggle();
//     });

//     // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
//     // Updates the select element to have the value of the equivalent option
//     $listItems.click(function (e) {
//         e.stopPropagation();
//         $styledSelect.text($(this).text()).removeClass('active');
//         $this.val($(this).attr('rel'));
//         $list.hide();
//         /* alert($this.val()); Uncomment this for demonstration! */
//     });

//     // Hides the unordered list when clicking outside of it
//     $(document).click(function () {
//         $styledSelect.removeClass('active');
//         $list.hide();
//     });

// });