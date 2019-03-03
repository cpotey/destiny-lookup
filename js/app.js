    
  var searchForm = document.getElementById("search-form");
  var searchInput = document.getElementById("user-lookup");

  var BungieApiKey = "0a6526b7396a443abfd1a147187ad778";
  

  // On click of submit button, do an API Request
  var submitButton = document.getElementById("submit");
  submitButton.onclick = apiRequest_noconsole;
  searchForm.addEventListener("click", function(event){
      event.preventDefault()
  });
  searchInput.addEventListener("keyup", function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      submitButton.click();
    }
  });

var totalmins = [];

// DO AN IF STATEMENT - if a radio button is ticked, do another function skipping console selection

  var progressBar = '<div id="progress"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>';
  function addLoader() {
    document.getElementById('data-div').innerHTML = progressBar;
  }
  function hideLoading() {
    document.getElementById('progress').style.display = 'none';
  }
  function showLoading() {
    document.getElementById('progress').style.display = 'block';
  }
  addLoader();
  hideLoading();


  function apiRequest_noconsole() {

    addLoader();
    showLoading();

    totalmins = [];

    var activeBackground = document.getElementById("background");
    activeBackground.classList.add("active-search");

    // Get the value in the input#user-lookup on submit click
     var userValue = document.getElementById("user-lookup").value;

     if(userValue == "") {
      document.getElementById('data-div').innerHTML = "<p>Please enter a username and try again.</p>";
     } else {
      // Set API endpoint to search for Guardian (Destiny2.SearchDestinyPlayer)
    var apiPathUserLookup = 'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/-1/';
    var url = apiPathUserLookup + userValue;
    
    var userSearch = new XMLHttpRequest();
    userSearch.onreadystatechange = function() {
      //showLoading();
      if (this.readyState == 4 && this.status == 200) {




        // Store the user lookup response in data and log to console. Create an output variable to store data in.
        var data = JSON.parse(userSearch.responseText);
        //console.log(data);    

        var userResponse = data.Response;

        console.log(userResponse);
        console.log(url);

        var userMembershipID = data.Response.membershipId;
        var userMembershipType = data.Response.membershipType;

        for(var i = 0; i < userResponse.length ; i++){
          var userMembershipID = userResponse[i].membershipId;
          var userMembershipType = userResponse[i].membershipType;
        }

        if (userResponse === undefined || userResponse.length == 0) {
          var output = '';
          hideLoading();
          output += "<p>Sorry, there's no data found for that user - trying searching again</p>";
        } else {
          

          // If there's an error code above 1, show the error code  
          var errorCode = data.ErrorCode;
          if (errorCode > 1) {

              var ErrorCode = data.ErrorCode;
              var ErrorStatus = data.ErrorStatus;
              var Message = data.Message;
              var output = '';
              output += '<b>Error Code:</b> '+ ErrorCode +'</br> <b>Error Status:</b> '+ ErrorStatus +'</br> <b>Message:</b> ' + Message;

          } else {

            var output = '';
            
            // Do another AJAX request using the membershipID from data to provide all associated accounts

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {

                var userAccounts = JSON.parse(xhttp.responseText);
                
                //console.log(userAccounts);

                var destinyMemberships = userAccounts.Response.destinyMemberships;

                // For each account, output the consoles the user plays on. Onclick of the a tag, do the function consoleSelect

                output += "<div id='consoles'>";
                for (var i = 0; i < destinyMemberships.length ; i++) {
                  var loop_membershipId = destinyMemberships[i].membershipId;
                  var loop_displayName = destinyMemberships[i].displayName;
                  var loop_membershipType = destinyMemberships[i].membershipType;
                  var loop_consolename = "";

                  if (loop_membershipType == 1 ) {
                    var loop_consolename = "Xbox Live";
                    var loop_consolepath = "img/xbox.svg";
                  } else if (loop_membershipType == 2 ) { 
                    var loop_consolename = "PlayStation Network";
                    var loop_consolepath = "img/playstation.svg";
                  } else if (loop_membershipType == 4 ) { 
                    var loop_consolename = "Battle.net";
                    var loop_consolepath = "img/pc.svg";
                  } else {

                  }

                   output += '<a onclick="consoleSelect(this)" id="console-select" data-membershipId="'+loop_membershipId+'" data-displayName="'+loop_displayName+'" data-membershipType="'+loop_membershipType+'"><img src="'+loop_consolepath+'"></a>';

                }
                output += "</div>";

                document.getElementById('data-div').innerHTML = output;

              }

            };
            xhttp.open("GET", "https://www.bungie.net/platform/User/GetMembershipsById/"+userMembershipID+"/-1", true);
            xhttp.setRequestHeader("X-API-KEY",BungieApiKey)
            xhttp.send();

          }

        }


        // At output to #data-div
        document.getElementById('data-div').innerHTML = output;

      }
    };
    userSearch.open("GET", url, true);
    userSearch.setRequestHeader("X-API-KEY",BungieApiKey)
    userSearch.send();
     }

  }

      // Select the Console
      function consoleSelect(clicked_console) {

        var selectedConsole = clicked_console;
        var selectedMembershipId = selectedConsole.getAttribute("data-membershipId");
        var selectedDisplayName = selectedConsole.getAttribute("data-displayName");
        var selectedMembershipType = selectedConsole.getAttribute("data-membershipType");
         
        var characterPick = new XMLHttpRequest();
          characterPick.onreadystatechange = function() {

            addLoader();

              if (this.readyState == 4 && this.status == 200) {

                hideLoading();
                var characterData = JSON.parse(characterPick.responseText);

                var output = '';

                var ErrorStatus = characterData.ErrorStatus;
                
                if (ErrorStatus == "Success") {
                  continueCharacters();
                } else if(ErrorStatus == "DestinyAccountNotFound") {
                  output += "<p>Sorry, we were unable to find your Destiny account information. Try searching again.</p>";
                } else {
                  output += "<p>Sorry, we couldn't find anything - try searching again.</p>";
                }

                function timeConvert(n) {
                  var num = n;
                  var hours = (num / 60);
                  var rhours = Math.floor(hours);
                  var minutes = (hours - rhours) * 60;
                  var rminutes = Math.round(minutes);
                  if (hours < 1) {
                    return rminutes + " mins";
                  } else {
                    return rhours + " hours and " + rminutes + " mins";
                  }
                }
                
                
                function continueCharacters() {

                  var characters = characterData.Response.characters.data;
                  var i = 0;  
                  output += "<div class='flex-grid'>";
                  
                  for(character in characters) {

                    i++;
                    
                    var characterId = characters[character].characterId;
                    var light = characters[character].light;
                    var classType = characters[character].classType;
                    var raceType = characters[character].raceType;
                    var genderType = characters[character].genderType;
                    var minutesPlayedTotal = characters[character].minutesPlayedTotal; 
                    //total+= characters[character].minutesPlayedTotal;
                    var emblemBackgroundPath = "https://www.bungie.net/" + characters[character].emblemBackgroundPath;
                    var emblemPath = "https://www.bungie.net/" + characters[character].emblemPath;
                    var level = characters[character].levelProgression.level;
                    totalmins.push(minutesPlayedTotal);
                    
                    if (raceType == 0 ) {
                      var raceTypeName = "Human";
                    } else if (raceType == 1 ) {
                      var raceTypeName = "Awoken";
                    } else if (raceType == 2 ) { 
                      var raceTypeName = "Exo";
                    } else {
                      var raceTypeName = "Other";
                    }

                    if (classType == 0 ) {
                      var classTypeName = "Titan";
                    } else if (classType == 1 ) {
                      var classTypeName = "Hunter";
                    } else if (classType == 2 ) { 
                      var classTypeName = "Warlock";
                    } else {
                      var classTypeName = "Unknown";
                    }

                    if (genderType == 0 ) {
                      var genderTypeName = "Male";
                    } else if (genderType == 1 ) {
                      var genderTypeName = "Female";
                    } else {
                      var genderTypeName = "Unknown";
                    }

                    output += "<div id='destiny-user'>";
                    output += "<img class='emblem' src="+emblemBackgroundPath+">"; 
                    //output += "<img src="+emblemPath+">";
                    output += "<p class='light'>"+light+"</p>";
                    output += "<div class='race-class'>";
                    output += "<p class='class'>"+classTypeName+"</p>";
                    output += "<p class='race'>"+raceTypeName+" " +genderTypeName+"</p>";
                    
                    
                    output += "</div>";
                    output += "<p class='minutes'>"+ ( timeConvert( minutesPlayedTotal ) ) + " played</p>";
                    output += "</div>";

                  }

                }

                output += "</div>";

                function getSum(total, num) {
                  return total + Math.round(num);
                }
                function reduceSum(item) {
                  totalmins = totalmins.reduce(getSum, 0);
                }
                reduceSum();

                var quotes = [
                "Nice one!",
                "Geddon.",
                "Alright, alright, alright.",
                "Filthy casual.",
                "Proper job!",
                "Noice!",
                "Well good!",
                "Is that it?",
                "Was it worth it?",
                "Could be worse.",
                "Those are rookie numbers."];

                var randomQuote = quotes[Math.floor(Math.random()*quotes.length)];

                if (ErrorStatus == "Success") {
                  output += "<div id='thought'><p id='total-time'>That's <span>"+( timeConvert( totalmins ) )+"</span> in total. "+randomQuote+"</p><p class='head'>Things you could've done with your time...</p><p class='generated'>Test</p></div>";
                } 
                

                document.getElementById('data-div').innerHTML = output;
              }
          };
          characterPick.open("GET", "https://www.bungie.net/platform/Destiny2/"+selectedMembershipType+"/Profile/"+selectedMembershipId+"/?components=200", true);
          characterPick.setRequestHeader("X-API-KEY",BungieApiKey)
          characterPick.send();

      }
