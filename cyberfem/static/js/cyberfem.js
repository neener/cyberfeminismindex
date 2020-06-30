var base_url = window.location.origin;
let menu = document.getElementById('menu');
var external_links = document.querySelectorAll('.external_links a')

function handleMenu(id, elm) {
    str = elm.value
    str = str.toLowerCase();
    if (str == "cyberfeminism index") {
        window.location = base_url + "/"
    } else {
        window.location = base_url + "/" + str;
    }
}

function getUrl() {
    //set menu to url
    var pathArray = window.location.pathname.split('/');
    var secondLevelLocation = pathArray[1];
    var selected_tag = pathArray[2]
    str = secondLevelLocation
    switch(secondLevelLocation) {
      case "":
        menu.value = "cyberfeminism index";
        console.log(1)
        break;
      case "orderby":
        menu.value = "cyberfeminism index";
        console.log(2)
        break;
      case "tag":
        menu.value = "cyberfeminism index";
        add_tag_button(selected_tag)
        console.log(3)
        break;
      case "collections":
        console.log(4);
        menu.value = str;
        console.log(selected_tag)
        let curator_list = document.getElementsByName('collection');
        for(var i = 0; i < curator_list.length; i++) {
           if(curator_list[i].value == selected_tag)
               curator_list[i].checked = true;
         }
        break;
      default:
        console.log(5)
        menu.value = str;
    }

    // force all external links only to be target=_blank
    for (var links = external_links, i = 0, a; a = links[i]; i++) {
        if (a.host !== location.host) {
            a.target = '_blank';
        }
    }
}

function sort_loading(order) {
    console.log(order)
    $("#index_list").addClass("loading");
    $('#sorting_text').show()
    window.location = base_url+"/orderby/"+ order
    setTimeout(function() {
        $('#sorting_text').hide();
        $("#index_list").removeClass("loading")
    }, 18000);
}

function slideIndex_drawer_images(elm, url) {
    var elems = document.querySelectorAll(".index_drawer");
    var selected_drawer = elm.previousSibling.previousSibling;
    images = elm.querySelectorAll(".img_container img");
    [].forEach.call(images, function(el) {
        el.style.height = "220px";
        el.nextElementSibling.nextElementSibling.style.display = "block";
    });

    [].forEach.call(elems, function(el) {
        if (el.classList.contains('closed')) {
        } else {
            el.classList.add("closed");
        }
    });
    var elems = document.querySelectorAll(".index_entry");

    elm.classList.add("green_text");
    selected_drawer.classList.toggle('closed');

    var hist_str = "#/" + url;
    window.history.pushState(hist_str, 'Title', hist_str);
}

var trail_array = [];
var trail_list = document.getElementById("trail_list");
var trail_list_kids = trail_list.getElementsByTagName("SPAN");
function remove_trail_entry(elm, slug) {
    elm.remove();
    var index_elm = document.getElementById(slug);
    index_elm.classList.remove("green_text");
    index_elm.nextSibling.nextSibling.classList.add("closed")

    trail_array.length = 0
    for (var i=0, item; item = trail_list_kids[i]; i++) {
        trail_array.push(trail_list_kids[i].title);
    }
}

function add_to_trail(title, id, slug, author_founder, pub_date, end_date, rownum) {
    table = document.getElementById("base_index_table");

    if (!trail_array.includes(title)) {
        trail_array.push(title);

        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "("+rownum+")";
        cell1.classList.add("cr")
        cell2.innerHTML = pub_date;
        cell3.innerHTML = title;
        cell4.innerHTML = author_founder;
        row.classList.add("base_tr")
        row.setAttribute("id", id);
        row.setAttribute("title", title);
        row.addEventListener("click",  function(){ remove_trail_entry(this, slug); });
        table.appendChild(row); 
    }

    if (trail_array.length <= 0) {
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "("+rownum+")";
        cell1.classList.add("cr")
        cell2.innerHTML = pub_date;
        cell3.innerHTML = title;
        cell4.innerHTML = author_founder;
        row.classList.add("base_tr")
        row.setAttribute("id", id);
        row.setAttribute("title", title);
        row.addEventListener("click",  function(){ remove_trail_entry(this, slug); });
        table.appendChild(row); 
    }
}

function internal_reference(id) {
    var e = document.getElementById(id);
    console.log(e)
    console.log(id)
    e.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    slideIndex_drawer(e, id)
}

function slideIndex_drawer(elm, url) {
    var selected_drawer = elm.nextSibling.nextSibling;

    if (elm.classList.contains("green_text")) {
        elm.classList.remove("green_text")
        if (selected_drawer.classList.contains("closed")) {
        } else {
            selected_drawer.classList.add("closed")
        }
    } else {
        elm.classList.add("green_text")
        selected_drawer.classList.remove("closed")
    }
    var hist_str = "#/" + url
    window.history.pushState(hist_str, 'Title', hist_str);


    // internal links
    var node = selected_drawer.children[0].children[1];
    var n = node.children
    var arr = [{"rownum":1,"title":"test"},{"rownum":2,"title":"test2"},{"rownum":3,"title":"test3"}]

    if (node.classList != "external_links") {
        for (i = 0; i < n.length; i++) { 
            if(n[i] && n[i].nodeName == "A") {
                var inline_link = n[i].href
                var parts = inline_link.split('/');
                var entry_title = ""
                var entry_title = parts[parts.length - 2];
                n[i].href= base_url +"/#/" + entry_title
                
                console.log(entry_title)
                let obj = index_json.find(o => o.slug === entry_title);
                console.log(obj)
                n[i].innerHTML = "("+ obj.rownum + ")";
                console.log(n[i])
                n[i].addEventListener("click", function(){internal_reference(entry_title)});
                n[i].classList.add("cr")
                n[i].classList.add(entry_title)
            }
        }
    }
}


function back_to_top(id) {
    var e = document.getElementById(id);
    e.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}

function add_tag_button(selected_tag) {
    var elem = document.createElement("button");
    elem.innerHTML = "<span>x</span> " + selected_tag;

    elem.onclick = function() { // Note this is a function
        tagbtns.remove();
        window.location = base_url+"/";
    };
    var tagbtns = document.getElementById("tag_btn");
    tagbtns.appendChild(elem);
    menu = document.getElementById('menu');
    menu.classList.add("with_tag")

    var position_info = tagbtns.getBoundingClientRect();
    var position_width = position_info.width;
    var width_menu = menu.getBoundingClientRect().width;
    var s = width_menu - position_width - 10;
    menu.style.width = s+"px"
}

function get_curator() {
    console.log("curator")
}

function enlarge_img(el) {
    if (el.classList.contains('enlarge_img')) {
        el.classList.remove("enlarge_img");
        caption = el.nextElementSibling.nextElementSibling
        caption.style.display = "none";
    } else {
        el.classList.add("enlarge_img")
        caption = el.nextElementSibling.nextElementSibling
        caption.style.display = "block";
    }
}

function img_click(url) {
    var id = "base"+url
    console.log(id)
    var e = document.getElementById(id);
    var s = document.getElementById("right_content");

    var elems = document.querySelectorAll(".base_tr");
    [].forEach.call(elems, function(el) {
        if (el.classList.contains('green_text')) {
            el.classList.remove("green_text");
        }
    })

    e.classList.add("green_text");

    e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })

    console.log(s)
}






// d = document.getElementById("left_index")

// $(d).on('mousewheel', function(event) {
//     console.log(event.deltaX, event.deltaY, event.deltaFactor);
// });

// const checkScrollSpeed = (function(settings) {
//   settings = settings || {};

//   let lastPos, newPos, timer, delta,
//       delay = settings.delay || 50;

//   function clear() {
//     lastPos = null;
//     delta = 0;
//   }

//   clear();

//   return function() {
//     newPos = d.scrollY;
//     if (lastPos != null) { // && newPos < maxScroll
//       delta = newPos - lastPos;
//     }
//     lastPos = newPos;
//     clearTimeout(timer);
//     timer = setTimeout(clear, delay);
//     return delta;
//   };
// })();

// const container = document.querySelector('#menu');

// d.addEventListener('scroll', function() {
//   var speed = checkScrollSpeed();
//   console.log(speed);
//   if (speed > 150) {
//     console.log('150+');
//     container.classList.add('red');
//   }
// });






function search_url(cat_name) {
    window.location = base_url+"/tag/"+ cat_name;
}

function collection_url(col_name) {
    window.location = base_url+"/collections/"+ col_name;
}



getUrl()



