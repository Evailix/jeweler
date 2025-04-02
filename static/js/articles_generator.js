articles = []

function run_all() {
    fetch("/get" + window.location.pathname, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            articles = data.articles
            fill_article(data.articles)
        })
}

function filter(enabled= false, available= null) {
    document.getElementById("filter_0").style.backgroundColor = "var(--adark)"
    document.getElementById("filter_1").style.backgroundColor = "var(--adark)"
    document.getElementById("filter_2").style.backgroundColor = "var(--adark)"

    if (enabled === false){
        fill_article(articles)
        document.getElementById("filter_0").style.backgroundColor = "var(--alight)"
    }
    else {
        if (available === true) {
            articles_filtred = articles.filter(function (n){
                return n.count !== 0;
            });
            document.getElementById("filter_1").style.backgroundColor = "var(--alight)"
        } else {
            articles_filtred = articles.filter(function (n){
                return n.count === 0;
            });
            document.getElementById("filter_2").style.backgroundColor = "var(--alight)"
        }
        fill_article(articles_filtred)
    }
}



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