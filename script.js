let callDebounce = debouncing()
    let input = document.getElementById("input")
    input.addEventListener("keyup", callDebounce)
    function showSpinner() {
        document.getElementById("modal").style.display = "block";
    }
    function hideSpinner() {
        document.getElementById("modal").style.display = "none";

    }
    hideSpinner()

    function debouncing(fun, delay) {
        let debounce;
        return function () {
            clearTimeout(debounce)
            debounce = setTimeout(() => {
                getInput()
            }, 500)
        }
    }
    function getInput() {
        let val = $("input").val()
        search(val)
    }
    function search(val) {

        if (val.length >= 4) {
            showSpinner()
            let promise = new Promise(async (resolve, reject) => {
                try {
                    let res = await fetch("http://www.omdbapi.com/?apikey=fcc8d66d&s=" + val)
                    let response = await res.json()
                    resolve(response)
                    let len = response.Search.length
                    hideSpinner()
                    liveSearch(response.Search, len)
                } catch (err) {
                    hideSpinner()
                    reject("Error is :" + err)
                }
            })
        }
    }

    function liveSearch(res, length) {
        let data = res
        let len = length
        let ul = document.getElementById("list")
        ul.innerHTML = ""
        for (let i = 0; i < len; i++) {
            let li = document.createElement("li")
            li.setAttribute("class", "list-box")
            li.setAttribute("value", data[i].Title)
            li.textContent = data[i].Title
            li.addEventListener("click", getSelected)
            ul.appendChild(li)
        }
    }

    function getSelected() {
        document.getElementById("input").value = ""
        let val = $(this).text()

        document.getElementById("input").value = val
    }

    function getFinalInput() {
        showSpinner()
        let val = $("input").val()
        let myPromise = new Promise(async (resolve, reject) => {
            try {
                let res = await fetch("http://www.omdbapi.com/?apikey=fcc8d66d&s=" + val)
                let response = await res.json()
                resolve(response)
                hideSpinner()
                makePage(response)
            } catch (err) {
                hideSpinner()
                reject("Error is :" + err)
            }
        })
        $("#list").html("")


    }


    function makePage(data) {
        $("#list").html("")
        var state = {
            "items": data.Search,
            "page": 1,
            "col": 5,
            // "window":
        }
        console.log(data)
        function pagination(items, page, col) {
            var startIndex = (page - 1) * col
            var endIndex = startIndex + col
            var selectedItems = items.slice(startIndex, endIndex)
            var pages = Math.ceil(items.length / col)
            return {
                "selectedItems": selectedItems,
                "pages": pages
            }
        }

        function buildCards() {
            let data = pagination(state.items, state.page, state.col)
            let movieItems = data.selectedItems
            let len = data.selectedItems.length
            var div = document.getElementById("movie_cards")
            div.innerHTML = ""
            for (let i = 0; i < len; i++) {
                var col = document.createElement("div")
                col.setAttribute("class", "col-2  mx-4")
                var card = document.createElement("div")
                card.setAttribute("class", "card text-center")

                var image = document.createElement("img")
                image.setAttribute("src", movieItems[i].Poster)
                image.setAttribute("class", "card-img-top  p-2")
                image.setAttribute("style", "width:316; height:461px")
                image.setAttribute("alt", "Image May Not be Available")

                var heading = document.createElement("h5")
                heading.setAttribute("class", "card-title")
                heading.textContent = movieItems[i].Title

                var para_1 = document.createElement("p")
                para_1.textContent = "Released Year :" + movieItems[i].Year
                var para_2 = document.createElement("p")
                para_2.textContent = "IMDB ID :" + movieItems[i].imdbID

                card.appendChild(image)
                card.appendChild(heading)
                card.appendChild(para_1)
                card.appendChild(para_2)
                col.appendChild(card)
                div.appendChild(col)

            }
            pagination_wrapper(data.pages)
        }

        function pagination_wrapper(pages) {
            var wrapper = document.getElementById("wrapper")
            wrapper.innerHTML = ""
            for (let page = 1; page <= pages; page++) {
                wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-primary" >${page}</button>`
            }
            $(".page").on("click", function () {
                $("#movie_cards").empty()
                state.page = $(this).val()
                buildCards()
            })


        }
        buildCards()
    }

