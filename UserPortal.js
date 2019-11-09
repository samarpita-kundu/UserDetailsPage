$( document ).ready(function() {
    console.log( "ready!" );
    
    function createNode(element) {
      return document.createElement(element); // Create the type of element you pass in the parameters
    }

    function append(parent, el) {
      return parent.appendChild(el); // Append the second parameter(element) to the first one
    }

    /*Date and time format*/
    function formatAMPM(today) {
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var ampm = hours >= 12 ? 'PM  ' : 'AM  ';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var strTime = date + ',' + hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }

    /*set multiple attributes at once*/
    function setAttributes(el, attrs) {
      for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    }

    /*clear search input from search box*/
    $('.clearInput').on('click', function(){
        var searchStr = document.getElementById('searchStr').value;
        if(searchStr){
            document.getElementById('searchStr').value=" ";
        }
    });

    /*Clear all history from search results*/
    $('#clrAll').on('click', function () {
        var section = document.getElementById('searchResult'); 
        var child = section.lastElementChild;  
        while (child) { 
            section.removeChild(child); 
            child = section.lastElementChild; 
        }
        document.getElementById("buttonPanel").setAttribute('hidden','true'); 
    });

    /*Clear checked from search results*/
    $('#clr').on('click', function () {
        var checkboxes = new Array(); 
        checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
        console.log(checkboxes);
        if(checkboxes.length){
            for (var i=0; i<checkboxes.length; i++)  {
                checkboxes[i].parentNode.remove();               
            }
        }
        document.getElementById("buttonPanel").setAttribute('hidden','true');
    });

    /*Cancel to clear*/
    $('#cancel').on('click', function () {
        var checkboxes = new Array(); 
        checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
        console.log(checkboxes);
        if(checkboxes.length){
            for (var i=0; i<checkboxes.length; i++)  {
                checkboxes[i].checked = false;                   
            }
        }
        document.getElementById("buttonPanel").setAttribute('hidden','true'); 
    });

    /*Clear individual record from search results*/
    $("#searchResult").on('click','.delBtn',function(){
        $(this).parent().remove();
    });

    /*search functionality based on input text from search-box*/
    function search(selectedVal){
        if(selectedVal === "undefined" || selectedVal === null || selectedVal==="") {
            return false;
        }
      var section = document.getElementById('searchResult'); 
     
      var url = 'https://api.github.com/users/'+selectedVal; 
      var today = new Date();
      var dateTime = formatAMPM(today);
      fetch(url, {mode: 'cors'})
      .then((resp) => resp.json())  
      .then(function(data) {
        console.log("page");
        console.log(selectedVal);
        var login =`${data.login}`;
        
        if(login === "undefined" || login === null){
            console.log(login);
            document.getElementById("profile").setAttribute('hidden','true');
            document.getElementById("profileDetails").setAttribute('hidden','true');
            document.getElementById("profileFig").setAttribute('hidden','true');
            document.getElementById("followersNav").removeAttribute('style');        
            document.getElementById("followersNav").setAttribute('hidden','true');
            document.getElementById("followingNav").setAttribute('hidden','true');
            document.getElementById("NotFound").removeAttribute('hidden');
            return false;
        }
        var nav = createNode('nav'),  
        userName = createNode('button'),
        time = createNode('time'),
        inputBtn = createNode('input'),
        inputCheck = createNode('input');
        time.innerHTML = `${dateTime}`;
        userName.innerHTML=`${data.login}`;
        setAttributes(nav, {"id":selectedVal+dateTime});
        setAttributes(userName, {"id": selectedVal, "class":"userName"});
        setAttributes(inputBtn, {"type": "image", "src": "cancel.png","class":"delBtn"});
        setAttributes(inputCheck, {"type": "checkbox", "class":"checkBox","name":selectedVal+dateTime});
        append(nav, inputCheck);
        append(nav, userName);
        append(nav, time)
        append(nav, inputBtn); 
        append(section, nav);

        var img =`${data.avatar_url}`,
        org = `${data.organizations_url}`;
        
        document.getElementById("profileImage").setAttribute('src',img); 
        document.getElementById("followersCount").innerHTML=  `${data.followers}`;
        document.getElementById("followingCount").innerHTML= `${data.following}`;
        document.getElementById("profileName").innerHTML= `Name : ${data.name}`;
        document.getElementById("profileType").innerHTML= `Type : ${data.type}`;
        document.getElementById("profileId").innerHTML= `Id : ${data.id}`;

        fetch(org, {mode: 'cors'})
        .then((resp) => resp.json())  
        .then(function(orgData) {
            document.getElementById("profileOrg").innerHTML= `Organisation : ${orgData[0].login}`;
        })
        .catch(function(error) {
            console.log(error);
        });

        document.getElementById("profile").removeAttribute('hidden');
        document.getElementById("profileFig").removeAttribute('hidden');
        document.getElementById("followersNav").removeAttribute('hidden');
        document.getElementById("followersNav").setAttribute('style','display: inline-block;');        
        document.getElementById("followingNav").removeAttribute('hidden'); 
        document.getElementById("profileDetails").removeAttribute('hidden');
        document.getElementById("NotFound").setAttribute('hidden','true');
      })
      .catch(function(error) {
        console.log(error);
      });
    }

    $("#searchResult").on('click','.userName',function(event){ 
        var selectedVal = event.target.id;
        var url = 'https://api.github.com/users/'+selectedVal; 
        fetch(url, {mode: 'cors'})
        .then((resp) => resp.json())  
        .then(function(data) {
            var img =`${data.avatar_url}`,
            org = `${data.organizations_url}`;
            
            document.getElementById("profileImage").setAttribute('src',img); 
            document.getElementById("followersCount").innerHTML=  `${data.followers}`;
            document.getElementById("followingCount").innerHTML= `${data.following}`;
            document.getElementById("profileName").innerHTML= `Name : ${data.name}`;
            document.getElementById("profileType").innerHTML= `Type : ${data.type}`;
            document.getElementById("profileId").innerHTML= `Id : ${data.id}`;

            fetch(org, {mode: 'cors'})
            .then((resp) => resp.json())  
            .then(function(orgData) {
                document.getElementById("profileOrg").innerHTML= `Organisation : ${orgData[0].login}`;
            })
            .catch(function(error) {
                    console.log(error);
            });

            document.getElementById("profile").removeAttribute('hidden');
            document.getElementById("profileFig").removeAttribute('hidden');
            document.getElementById("followersNav").removeAttribute('hidden');
            document.getElementById("followersNav").setAttribute('style','display: inline-block;');        
            document.getElementById("followingNav").removeAttribute('hidden'); 
            document.getElementById("profileDetails").removeAttribute('hidden');
            document.getElementById("NotFound").setAttribute('hidden','true');

        })
        .catch(function(error) {
        console.log(error);
      });
    });

    $("#searchResult").on("change",'.checkBox', function() {
        console.log("inside");
        
        var checkboxes = new Array(); 
        checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
        console.log(checkboxes);
        if(checkboxes.length){
            console.log("all checked");
            checkAll(true);
            for (var i=0; i<checkboxes.length; i++)  {
                console.log("all checked");
                console.log(checkboxes[i].parentNode);
                // checkboxes[i].parentNode.remove();
            }
        }else{
            console.log("all unchecked");
            checkAll(false);
        }       
    });

    function checkAll(checktoggle){
        if(checktoggle){
            console.log("remove hidden");
            document.getElementById("buttonPanel").removeAttribute('hidden'); 
        }else{
            console.log("make it hidden again");
            document.getElementById("buttonPanel").setAttribute('hidden','true'); 
        }
    }

    document.getElementsByClassName("profileLink").onclick = function(){
        console.log("adfadef");
    };

    $('.profileLink').on('click', function() {
        openProfile();
        
        console.log($(this));
    });

    function openProfile() {

        console.log("qweqwr");

    }
    
    /*get all users login*/
    function getLogin(){
      var arr = [];
      var url = 'https://api.github.com/users'; 
      var match ="login";
      fetch(url, {mode: 'cors'})
        .then((resp) => resp.json())  
        .then(function(data) {
          Object.keys(data).forEach(function (item) {
            var value=data[item];
            Object.keys(value).forEach(function (key) {
              if(key==="login"){
              // all values for 'login' keys
              arr.push(value[key]);
            }
            })
          });         
        })
        .catch(function(error) {
          console.log(error);
        });

        return arr;

    }

    /*An array containing all users login*/
    var users = getLogin();

    autocomplete(document.getElementById("searchStr"), users);

    /*the autocomplete function takes two arguments:
    the text field from search-box and an array of possible autocompleted values*/
    function autocomplete(inputStr, arr) {
        var currentFocus;
        console.log("entry");

        /*execute a function if text is written on search-box*/
        inputStr.addEventListener("input", function(e) {
            closeAllLists();
            var val =this.value;
            if (!val) { return false;}
            
            currentFocus = -1;
            var a=document.createElement("article");
            a.setAttribute("id","autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            console.log("input");
            console.log(a);
            for (var i = 0; i < arr.length; i++) {
    
                if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                var b = document.createElement("article");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inputStr.value = this.getElementsByTagName("input")[0].value;
                    console.log(inputStr.value);
                    /*Search for selected value*/
                    search(inputStr.value);
                    closeAllLists();
                });
                a.appendChild(b);
                }
            }

                
        });

        /*execute a function presses a key on the keyboard:*/
        inputStr.addEventListener("keydown", function(e) {
            var x = document.getElementById("autocomplete-list");
  
            if (x){
                console.log("keydown");
                x = x.getElementsByTagName("article"); 
                console.log(x);
            }
            
            if (e.keyCode == 40) { //down
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { //up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) { //enter
                e.preventDefault();
                console.log("enter");
                console.log(currentFocus);
                if (currentFocus > -1) {
                    console.log("A");
                    if(x){
                        console.log("B");
                        x[currentFocus].click(); 
                    } 
                }else if(currentFocus==-1){
                    console.log("C");
                    console.log(inputStr.value);
                    // alert("Invalid Login");
                    search(inputStr.value);
                }
            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
        
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inputStr) {
                x[i].parentNode.removeChild(x[i]);
            }
            }
        }

        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

});