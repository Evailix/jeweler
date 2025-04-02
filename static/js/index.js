
function fill_article(data) {
    cont = document.getElementById("articles")
    temp = document.getElementById("article_template")

    cont.innerHTML = ""
    for (const [index, element] of data.entries()) {
        new_temp = temp.cloneNode(true)
        new_temp.style.display = "block"
        new_temp.id = `article_${index}`
        new_temp.querySelector(".article_img").style.backgroundImage = `url(/static/img/tovars/${element.type}/${element.id}.webp)`
        new_temp.setAttribute("onclick", `window.location='/article/${element.id}'`);
        if (element.price.has_discount === false) {
            new_temp.querySelector(".price").innerText = `${element.price.price} грн`
            new_temp.querySelector(".title").innerText = element.title
            new_temp.querySelector(".desc").innerText = element.description
        } else {
            price = new_temp.querySelector(".price")
            price.innerHTML += `${element.price.discount} грн`
            price.style.backgroundColor = "var(--red)"
            disc = new_temp.querySelector(".discount")
            disc.style.display = "block"
            disc.innerText = `${element.price.price} грн`
            new_temp.querySelector(".title").innerText = element.title
            new_temp.querySelector(".desc").innerText = element.description
        }

        if (element.count === 0) {
            new_temp.querySelector(".article_solved").style.display = "flex";
        }
        cont.appendChild(new_temp)
    }
}


var imgs = [-148, -72, 2 ]
var timer = 5000

var index = 0
var move_forv = true


var scroller_int = setInterval(scroll, timer)

function add_number(){
    if (move_forv) {
        if (index < 2) {
            index += 1;
        } else {
            move_forv = false
            index -= 1;
        }
    } else {
        if (index > 0) {
            index -= 1;
        } else {
            move_forv = true
            index += 1;
        }
    }
}

function scroll() {
    indicator = document.getElementById(`indicator_${index}`)
    document.getElementById(`indicator_0`).style.backgroundColor ="var(--alight)"
    document.getElementById(`indicator_1`).style.backgroundColor ="var(--alight)"
    document.getElementById(`indicator_2`).style.backgroundColor ="var(--alight)"
    document.getElementById(`scroler_img_0`).style.filter = "blur(4px)";
    document.getElementById(`scroler_img_1`).style.filter = "blur(4px)";
    document.getElementById(`scroler_img_2`).style.filter = "blur(4px)";
    document.getElementById(`scroler_img_${index}`).style.filter = "none";
    indicator.style.backgroundColor = "var(--adark)"
    document.querySelector('.cont').style.left = imgs[index] + "vw"
    add_number()
}

function scroll_click(ind){
    clearInterval(scroller_int)
    index = ind
    scroll()
    scroller_int = setInterval(scroll, timer)
}

function run_all() {
    fetch("/get/index/", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            top1 = document.getElementById("top_1")
            top2 = document.getElementById("top_2")
            top3 = document.getElementById("top_3")
            top1.style.backgroundImage = `url(/static/img/tovars/${data.type}/${data.ids[0]}.webp)`
            top2.style.backgroundImage = `url(/static/img/tovars/${data.type}/${data.ids[1]}.webp)`
            top3.style.backgroundImage = `url(/static/img/tovars/${data.type}/${data.ids[2]}.webp)`
            top1.querySelector("span").innerText = `${data.price[0]} грн`
            top2.querySelector("span").innerText = `${data.price[1]} грн`
            top3.querySelector("span").innerText = `${data.price[2]} грн`

            top1.setAttribute("onclick", `window.location='/article/${data.ids[0]}'`);
            top2.setAttribute("onclick", `window.location='/article/${data.ids[1]}'`);
            top3.setAttribute("onclick", `window.location='/article/${data.ids[2]}'`);

            fill_article(data.articles)
        })
}