var base_url = window.location.origin;
let menu = document.getElementById('menu');

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

    // force all external links to be target=_blank
    for (var links = document.links, i = 0, a; a = links[i]; i++) {
        if (a.host !== location.host) {
            a.target = '_blank';
        }
    }
}

function slideIndex_drawer(elm, url) {
    var elems = document.querySelectorAll(".index_drawer");
    var selected_drawer = elm.nextSibling.nextSibling;

    [].forEach.call(elems, function(el) {
        if (el.classList.contains('closed')) {
        } else {
            el.classList.add("closed");
        }
    })
    var elems = document.querySelectorAll(".index_entry");
    
    elm.classList.add("green_text");
    selected_drawer.classList.toggle('closed');

    var hist_str = "#/" + url
    window.history.pushState(hist_str, 'Title', hist_str);
}

function base_reference(id) {
    var hist_str = "#/" + id
    window.history.pushState(hist_str, 'Title', hist_str);
    var e = document.getElementById(id);
    e.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});

    var elems = document.querySelectorAll(".index_drawer");
    [].forEach.call(elems, function(el) {
        if (el.classList.contains('closed')) {
        } else {
            el.classList.add("closed");
        }
    })
    var elems = document.querySelectorAll(".index_entry");
    [].forEach.call(elems, function(el) {
        if (el.classList.contains('green_text')) {
            el.classList.remove("green_text");
        }
    })

    // add classname only to clicked element
    var elm = document.getElementById(id);
    var selected_drawer = elm.nextSibling.nextSibling;
    elm.classList.add("green_text");
    selected_drawer.classList.toggle('closed');
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
    } else {
        el.classList.add("enlarge_img")
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

function search_url(cat_name) {
    window.location = base_url+"/tag/"+ cat_name;
}

function collection_url(col_name) {
    window.location = base_url+"/collections/"+ col_name;
}



getUrl()



