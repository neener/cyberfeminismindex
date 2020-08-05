var base_url = window.location.origin;
var base_host = window.location.hostname;
let menu = document.getElementById('menu');
var external_links = document.querySelectorAll('.external_links a')

var index_json;
var index_img_json;

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
    var selected_tag = pathArray[2];
    str = secondLevelLocation;
    switch(secondLevelLocation) {
      case "":
        menu.value = "cyberfeminism index";
        console.log(1)
        var pathHash_array = window.location.hash.split('/');
        var pathHash = pathHash_array[1];
        internal_reference(pathHash)
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
      case "about":
        menu.value = str;
        var selected_drawer = document.getElementById("about_pg_content")
        internal_ligatures(selected_drawer)
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



function toggle_contact() {
    var contact_form = document.getElementById("about_form")
    contact_form.classList.toggle('closed');
}

function sort_loading(order) {
    $("#index_list").addClass("loading");
    $(".arrows").addClass("loading");
    $(".index_content").addClass("transparent");
    $('#sorting_text').show()
    document.getElementById('index_list').style.pointerEvents = 'none';

    window.location = base_url+"/orderby/"+ order
    setTimeout(function() {
        $("#index_list").addClass("loading2");
        $(".arrows").addClass("loading2");
    }, 400);
    setTimeout(function() {
        $("#index_list").removeClass("loading2")
        $(".arrows").removeClass("loading2");
        $("#index_list").addClass("loading3");
        $(".arrows").addClass("loading3");
    }, 800);
    setTimeout(function() {
        $("#index_list").removeClass("loading3")
        $(".arrows").removeClass("loading3");
        $("#index_list").addClass("loading4");
        $(".arrows").addClass("loading4");
    }, 1200);
    setTimeout(function() {
        $("#index_list").removeClass("loading4")
        $(".arrows").removeClass("loading4");
        $(".index_content").removeClass("transparent");
    }, 15000);
}

var trail_array = [];
var opened = false;
var download_btn = document.getElementById("download_btn");
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

function create_pdf() {
    var dt = new Date().toLocaleString();
    table = document.createElement('table');
    var printWindow = window.open('', '', 'height=700,width=950');
    printWindow.document.write("<html><head><title>Cyberfeminism Index</title>")
   	printWindow.document.write('<style>html,body {height: 100vh;padding: 0;margin: 0.5em;font-size: 2.25vw;font-family: Arial, sans-serif;color: black;}@font-face {font-family: "arial_lc_symbol_regularRg";src: url("/static/css/arial_lc_symbol_v17-webfont.woff2") format("woff2"),url("/static/css/Arial_LC_Symbol_v17.otf") format("otf");font-weight: normal;font-style: normal;}.cr {padding-top: 5px;font-family: "arial_lc_symbol_regularRg";font-variant-ligatures: common-ligatures;-moz-font-feature-settings: "liga", "clig";-webkit-font-feature-settings: "liga", "clig";font-feature-settings: "liga", "clig";}td {padding-right: 1em;vertical-align: top;}tr {display: table-row;vertical-align: inherit;border-color: inherit;}table {font-size:2.25vw;padding-bottom: 15px;width: 100%;float: left;}.sm {width:7%;} .lg{width:60%;}img{max-height:90px;margin-right:5px;}@page{size: 8.5in 11in;margin: 0;}</style>')
   	printWindow.document.write("</head>");

   	//first page
    temp_top_array = ["<div id='pdf_list' class='main_index_style' style='position:relative; display: inline-block;'><table><tbody>"]
    for (i = 0; i < trail_array.length; i++) {
    	console.log(trail_array[i])  
        let obj = index_json.find(o => o.slug === trail_array[i])
        var temp_top = `<tr>
    						<td class="cr sm">`+obj.rownum+`</td>
							${(obj.pub_date == null) ? '<td></td>' : '<td class="date sm">'+obj.pub_date+'</td>'} 
							${(obj.title == null) ? '<td></td>' : '<td class="lg">'+obj.title+'</td>'} 
							${(obj.author_founder == null) ? '<td></td>' : '<td class="author">'+obj.author_founder+'</td>'} 
						</tr>`;
        temp_top_array.push(temp_top)
    }
    temp_top_array.push("</tbody></table></div>")
    temp_top_joined = temp_top_array.join('');
    printWindow.document.write(temp_top_joined);
    
    //second page
    temp_bottom_array = ["<div style='position:relative; display: inline-block; page-break-before: always;'"];
    for (i = 0; i < trail_array.length; i++) { 
        let obj = index_json.find(o => o.slug === trail_array[i])
        let img_titles = index_img_json.filter(x => x["slug"].includes(trail_array[i]))
        temp_bottom_array.push("<div class='main_index_style'><table><tbody>")
        var temp_bottom = `<tr>
    						<td class="cr sm">`+obj.rownum+`</td>
							${(obj.pub_date == null) ? '<td></td>' : '<td class="date sm">'+obj.pub_date+'</td>'} 
							${(obj.title == null) ? '<td></td>' : '<td class="lg">'+obj.title+'</td>'} 
							${(obj.author_founder == null) ? '<td></td>' : '<td class="author">'+obj.author_founder+'</td>'} 
						</tr>`;
        temp_bottom_array.push(temp_bottom)
        temp_bottom_array.push("</tbody></table></div>");
        //get images file path and extension
        function get_images() {
        	img_elm_list = []
        	function fileNameAndExt(str){
			  var file = str.split('/').pop();
			  return [file.substr(0,file.lastIndexOf('.')),file.substr(file.lastIndexOf('.')+1,file.length)]
			}
        	for (i = 0; i < img_titles.length; i++) {  
        		img_path = fileNameAndExt(img_titles[i].img_name)
        		img_elm = '<img height="220" src="/media/images/' + img_path[0] + '.height-220.' + img_path[1] +'">';
        		img_elm_list.push(img_elm)
        	}
        	return img_elm_list
        }
        var temp_content = `<p>
							${(obj.about == null) ? '' : ''+obj.about+''} 
							${(obj.location == null) ? '' : ''+obj.location+''} 
							${(obj.external_link == null) ? '' : ''+obj.external_link+''} 
							${(obj.external_link_two == null) ? '' : ''+obj.external_link_two+''} 
						</p>`;
		temp_bottom_array.push(temp_content)
		if (obj.images_list !== null) {
			img_elm_list = get_images()
			img_elm_joined = img_elm_list.join('');
			var img_content = '<p>'+img_elm_joined+'</p>'
			temp_bottom_array.push(img_content);
		}
    }
    temp_bottom_array.push("</div>");
    temp_bottom_joined = temp_bottom_array.join('');
    printWindow.document.write(temp_bottom_joined);
    
    //last page
    var info_content = `<div style="position:relative; display: inline-block; page-break-before: always;"
    						<p>This PDF contains selections from Cyberfeminism Index (https://cyberfeminismindex.com). It was downloaded on` + dt + `. The website and its contents may have changed since then.</p>
    						<p>Cyberfeminism Index is facilitated by Mindy Seu (https://mindyseu.com/) The website was developed by Angeline Meitzler (https://angeline-meitzler.com/) This font is Arial by Robin Nicholas and Patricia Saunders. The encircled cross-reference numbers are an adaptation of this font called Arial Symbol by Laura Coombs (http://lauracoombs.com). All entry descriptions are excerpts; please refer to the credit at the bottom of each page.</p>
    					</div>`;
    printWindow.document.write(info_content);

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function remove_trail_entry(elm, slug, title) {
    elm.remove();
    var index_elm = document.getElementById(slug);
    index_elm.classList.remove("green_text");
    index_elm.nextSibling.nextSibling.classList.add("closed")
    
    trail_array = trail_array.filter(e => e !== slug);
    download_btn.innerHTML = "Download ("+ trail_array.length + ")"
}

function add_to_trail(title, id, slug, author_founder, pub_date, end_date, rownum) {
    table = document.getElementById("base_index_table");

    if (!trail_array.includes(slug)) {
        trail_array.push(slug);
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "("+rownum+")";
        cell1.classList.add("cr")
        if (pub_date == "None") {
            cell2.innerHTML = "";
        } else {
            cell2.innerHTML = pub_date;
        }

        cell3.innerHTML = title;
        
        if (author_founder == undefined || author_founder == "None") {
            cell4.innerHTML = "";
        } else {
            cell4.innerHTML = author_founder;
        }
        row.classList.add("base_tr")
        row.setAttribute("id", id);
        row.setAttribute("title", title);
        row.addEventListener("click",  function(){ remove_trail_entry(this, slug, title); });
        table.appendChild(row); 
    }

    if (trail_array.length <= 0) {
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "("+rownum+")";
        cell1.classList.add("cr");
        cell2.innerHTML = pub_date;
        cell3.innerHTML = title;
        cell4.innerHTML = author_founder;
        row.classList.add("base_tr")
        row.setAttribute("id", id);
        row.setAttribute("title", title);
        row.addEventListener("click",  function(){ remove_trail_entry(this, slug, title); });
        table.appendChild(row); 
    }

    // open left_content drawer
    var right_content = document.querySelector('#right_content');
    var left_content = document.querySelector('.left_content');
    var body = document.getElementsByTagName('BODY')[0];
    var select = document.getElementById('menu');
    var download_btn = document.getElementById('download_btn');
    if (trail_array.length == 1 && opened == false &&  window.innerWidth > 800) {
        opened = true;
        right_content.classList.toggle("unopened");
        left_content.style.width = "73.5%";
        body.style.fontSize = "1.5vw";
        select.style.fontSize = "1.5vw";
    }
    if (trail_array.length == 1 && opened == false &&  window.innerWidth < 800) {
    	right_content.style.display = "none";
    }

    download_btn.innerHTML = "Download ("+ trail_array.length + ")";
    console.log("added to trail")
}

function internal_reference(id) {
    if (id) {
        var e = document.getElementById(id);
        e.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        slideIndex_drawer(e, id)
    }
}

function internal_ligatures(selected_drawer) {
    // internal links
    if(menu.value == "cyberfeminism index" || menu.value == "search" || menu.value == "collections") {
        var node = selected_drawer.children[0].children[1];
        var n = node.children
        console.log(n)
    } 
    if(menu.value == "images") {
        var node = selected_drawer.children[0].children[4];
        var n = node.children
    }
    if(menu.value == "about") {
        var n = []
        var node = selected_drawer.children;
        for (i = 0; i < node.length; i++) { 
            for (j = 0; j < node[i].children.length; j++) {
  				console.log(node[i].children[j])
                if (node[i].children[j].nodeName == "A" && node[i].children[j].innerHTML == "(x)") {
                    n.push(node[i].children[j])
                } 
                if (node[i].children[j].nodeName == "A" && node[i].children[j].innerHTML != "(x)") {
				    node[i].children[j].target = '_blank';
                }
            }
        }
        console.log(n)
    }

    if (node.classList != "external_links") {
        for (i = 0; i < n.length; i++) { 
            if(n[i] && n[i].nodeName == "A") {
                var inline_link = n[i].href
                var parts = inline_link.split('/');
                var entry_slug = parts[parts.length - 2];
                n[i].href= base_url +"/#/" + entry_slug
                
                let obj = index_json.find(o => o.slug === entry_slug);
                n[i].innerHTML = "<span slug='"+obj.slug+"' title='"+obj.title+"' class='tooltip'>("+ obj.rownum + ")</span>";

                n[i].classList.add("cr")
                n[i].setAttribute("slug", entry_slug)

                if(menu.value == "about") {
                	n[i].addEventListener("click", function(e){
                    	return internal_reference(e.srcElement.attributes[0].nodeValue)
                	});
               	} else {
               		n[i].addEventListener("click", function(e){
                		add_to_trail(obj.title, obj.id, obj.slug, obj.author_founder, obj.pub_date, obj.end_date, obj.rownum)
                    	return internal_reference(e.srcElement.attributes[0].nodeValue)
                	});
               	}
                
            }
        }
    }
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

    internal_ligatures(selected_drawer)
}

function slideIndex_drawer_images(elm, url) {
    var elems = document.querySelectorAll(".index_drawer");
    var elem_entry = document.querySelectorAll(".index_entry");
    var selected_drawer = elm.previousSibling.previousSibling;

    // images = elm.querySelectorAll(".img_container img");
    // [].forEach.call(images, function(el) {
    //     if (el.classList.contains('enlarge_img')) {
    //     	console.log("here");
    //     	el.classList.remove("enlarge_img");
    //     	caption.style.display = "none";
    //     }
    // });


    [].forEach.call(elems, function(el) {
        if (el.classList.contains('closed')) {
        } else {
            el.classList.add("closed");
            e_index_entry = el.nextElementSibling
            images = e_index_entry.querySelectorAll(".img_container img");
            console.log(images);
		    // [].forEach.call(images, function(el) {
		    //     if (el.classList.contains('enlarge_img')) {
		    //     	el.classList.remove("enlarge_img");
		    //     	caption = el.nextElementSibling.nextElementSibling
		    //     	caption.style.display = "none";
		    //     }
		    // });
        }
    });
    

    elm.classList.add("green_text");
    selected_drawer.classList.toggle('closed');

    var hist_str = "#/" + url;
    window.history.pushState(hist_str, 'Title', hist_str);

    elm.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});

    internal_ligatures(selected_drawer)
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

function enlarge_img(el) {
    if (el.classList.contains('enlarge_img')) {
        el.classList.remove("enlarge_img");
        caption = el.nextElementSibling.nextElementSibling
        caption.style.display = "none";
    } else {
        el.classList.add("enlarge_img")
        img_width = el.offsetWidth
        caption = el.nextElementSibling.nextElementSibling
        caption.style.display = "block";
        caption.style.color = "black";
        caption.style.width = img_width+"px";
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



