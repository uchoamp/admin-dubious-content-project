/////////////////////////////////
//          HOME ADMIN        //
////////////////////////////////

const table_games = document.getElementById("table-games");


if (table_games) {
  const search = document.getElementById("search")
  const paginate = document.getElementById("paginate")
  const tbody = table_games.children[1];
  const clone = tbody.children[0].cloneNode(true);
  tbody.children[0].remove();

  const searchInput = search.children[0];

  searchInput.addEventListener('input', () => {
    if (!searchInput.value) {
      renderGames(1)
    }
  })
  // mostra o games quando a pagina for carregada pela primeira vez //
  renderGames(1)

  // Search //
  search.children[1].onclick = function () {
    nextPage(1);
  }

  // Modança de página //
  function nextPage(page) {
    renderGames(page, searchInput.value);

  }

  // buscar o games no backend //
  function renderGames(page, query) {
    fetch(`/getGamesJSON?page=${page || ""}&limit=10&query=${query || ""}`).then(res => {

      if (!res.ok) {
        return new Error('falhou a requisição')
      }

      if (res.status === 404) {
        return new Error('não encontrou qualquer resultado')
      }

      return res.json()
    })
      .then((res) => {

        let games = res.games

        removeAllChild(tbody)

        let tr = clone.cloneNode(true);
        let td = undefined;

        games.forEach(game => {
          tr = tr.cloneNode(true)

          tr.children[0].children[0].src = game.imgs.cover.imgURL
          tr.children[1].children[0].innerHTML = game.tittle
          tr.children[1].children[0].href = "http://www.h-natsu.com.br/game/" + game.gameURL
          tr.children[2].children[0].innerHTML = game.description
          tr.children[3].innerHTML = game.type
          tr.children[4].innerHTML = game.language
          tr.children[5].innerHTML = game.tags
          tr.children[6].innerHTML = game.censorship
          tr.children[7].innerHTML = game.platform
          tr.children[8].innerHTML = game.release_date
          tr.children[9].innerHTML = game.size
          tr.children[10].children[0].children[0].href = game.link_download
          tr.children[11].setAttribute("data-id", game._id)

          tbody.appendChild(tr)

        });

        createPaginate(page, res.totalPages)

      }).catch(console.error);


  }
  // criação do paginate //
  function createPaginate(page, pageFinal) {
    page = parseInt(page)

    let template = ""
    if ((page - 2) - 1 >= 2) {
      template += `<button onclick="nextPage(this.getAttribute('data-page'))" data-page="${page - 1}"><i class="fas fa-angle-double-left"></i></button>`
    }

    for (let i = 1; i <= pageFinal; i++) {

      if (i == page) {
        template += `<button disabled>${i}</button>`
        continue
      }

      template += `<button onclick="nextPage(this.innerText)">${i}</button>`
      if (i == 1 && page - 3 > 1) {
        i = page - 3;
        template += '<span>...</span>'

      } if (page + 4 < pageFinal && page + 2 == i) {
        i = pageFinal - 1;
        template += '<span>...</span>';
      }

    }

    if (page < pageFinal - 4) {
      template += `<button onclick="nextPage(this.getAttribute('data-page'))" data-page="${page + 1}"><i class="fas fa-angle-double-right"></i></button>`
    }
    paginate.innerHTML = template

  }

  // EDIT //
  function editGame(btn) {
    const id = btn.parentElement.parentElement.getAttribute("data-id");
    window.location.href = "/game/" + id;
  }



  // DELETE //
  function deleteGame(btn) {
    const id = btn.parentElement.parentElement.getAttribute("data-id")
    if (window.confirm("Confirme que o game deve ser apagado.")) {
      fetch("/game/" + id, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) {
            return new Error('falhou a requisição')
          }

          if (res.status === 404) {
            return new Error('não encontrou qualquer resultado')
          }
          return res.json()
        }).then((res) => {
          let classe = "success";
          if (res.deleted) {
            let quantGame = document.getElementById("quantGame");
            quantGame.innerText = parseInt(quantGame.textContent) - 1;
            renderGames(1);
          } else {
            classe = "error"
          }

          let divMsg = document.createElement("div"); divMsg.setAttribute("class", `${classe} msg`);
          let spanMsg = document.createElement("span").appendChild(document.createTextNode(res.message));
          let closeMsg = document.createElement("i"); closeMsg.setAttribute("class", "closeMsg far fa-window-close");
          divMsg.appendChild(spanMsg); divMsg.appendChild(closeMsg);
          document.body.prepend(divMsg)

          setTimeout(() => {
            divMsg.remove();
          }, 4000)

          closeMsg.onclick = () => divMsg.remove();

        }).catch(err => console.error(err))
    }
  }

}


/////////////////////////////////
//          NEW GAME          //
////////////////////////////////



if (document.getElementById("form-create-game")) {

  // verifica se URL existe //

  const gameURL = document.getElementById("gameURL");
  fetch("/getGamesJSON?gameURL=" + gameURL.value)
    .then((res) => { return res.json() })
    .then((resJSON) => {
      const gameURLs = [];
 
      resJSON.forEach(element => {
        gameURLs.push(element.gameURL)
      });
      
      let testIsURL = /^[a-z0-9]{1}[\w-]*$/i
      
      gameURLchange()
      gameURL.addEventListener("input", gameURLchange)
      
      function gameURLchange() {
        const value = gameURL.value;

        const TF = gameURLs.includes(value);

        if (TF || value == "" || !(testIsURL.test(value))) {
          document.getElementById("create-new-game").setAttribute("disabled", "true")
          gameURL.classList.remove("accepted")
          gameURL.classList.add("refused")
        } else {
          document.getElementById("create-new-game").removeAttribute("disabled")
          gameURL.classList.remove("refused")
          gameURL.classList.add("accepted")
        }

      }
    })
    .catch((err) => console.log(err))

  // CHECK PLATAFORMA //
  const platforms = document.getElementById("platforms");
  const platform = platforms.getAttribute("data-checked");
  if(platform == "Android"){
    platforms.children[0].removeAttribute("checked")
    platforms.children[2].setAttribute("checked", "true")
    
  }

  //  Input  CAPA   //
  const cover = document.getElementById("cover");
  const img_cover = document.getElementById("img-cover")

  cover.onchange = changeCover;
  function changeCover() {

    let fr = new FileReader();
    fr.onload = () => {
      img_cover.src = fr.result;
    }
    fr.readAsDataURL(cover.files[0]);
  }

  // Inputs screenshorts //
  document.getElementById("form-create-game").reset();

  const inputs_sc = document.getElementById("inputs-sc")
  if (inputs_sc) {
    const fr = new FileReader();
    let screenshorts = document.getElementById("screenshorts");

    let inputs_file = inputs_sc.children;
    let screenshorts_children = screenshorts.children

    for (let i = 0; i < inputs_file.length; i++) {
      inputs_file[i].children[0].onchange = () => {
        fr.onload = () => {
          screenshorts_children[i].children[0].src = fr.result;
        }
        fr.readAsDataURL(inputs_file[i].children[0].files[0])
        if (inputs_file[i].children[2]) {
          inputs_file[i].children[2].setAttribute("checked","checked");
        }
      }
    }

    function resetInFileImgs(index, ele) {
      inputs_file[index].children[0].type = "";
      inputs_file[index].children[0].type = "file";
      if (inputs_file[index].children[2]) {
        inputs_file[index].children[2].removeAttribute("checked");
      }
      screenshorts_children[index].children[0].src = ele.getAttribute("data-img");

    }

  }


  // Inputs events //
  const tittle = document.getElementById("tittle");
  tittleChange()
  tittle.addEventListener("input", tittleChange)
  function tittleChange() {
    if (tittle.value != "") { document.getElementById("tittle-here").innerText = tittle.value }
    else { document.getElementById("tittle-here").innerText = "Tittle" };
  }

  const size_game = document.getElementById("size-game");
  sizeChange()
  size_game.addEventListener("input", sizeChange)
  function sizeChange() {
    document.getElementById("here-size-game").innerText = size_game.value;
  }

  const link_download = document.getElementById("link_download");
  linkChange()
  link_download.addEventListener("input", linkChange)
  function linkChange() {
    let btn_down = document.getElementById("btn-down");
    if (link_download.value.length > 0) {
      btn_down.classList.remove("inative-btn-down");
      btn_down.href = link_download.value;
    } else {
      btn_down.classList.add("inative-btn-down");
      btn_down.href = "javascript:void(0)"
    }
  }
}












// Funções
function removeAllChild(parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
}