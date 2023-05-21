const input = document.querySelector('.searching_input')
const autocomplite = document.querySelector('.searching_autocomplite')
const repoContainer = document.querySelector('.container')
let reposNow

//fetch

async function getRepos(q) {
    let response  = await fetch(`https://api.github.com/search/repositories?q=${q}`)
    response =  await response.json()
    response = response.items
    return response.splice(0, 5)
}

const debounce = (fn, debounceTime) => {
    let  timeId
    return function () {
        const func = () => {fn.apply(this, arguments)}

        clearTimeout(timeId)

        timeId = setTimeout(func, debounceTime)
    }
}

async function onChange (e) {
    if (e.target.value) {
        reposNow = []
        autocompliteDelete()
        reposNow = await getRepos(e.target.value)
        reposNow.forEach(repo => {
            autocompliteAdd(repo.name, repo.id)
        })
        autocomplite.classList.remove('hidden')
    } else {
        autocompliteDelete()
    }
}

onChange = debounce(onChange, 500)

//listeners

input.addEventListener('keyup', onChange)

autocomplite.addEventListener('click', (e) => {
    const id = e.target.id
    repoContainerAdd(id)
    input.value = ''
    autocompliteDelete()
})

repoContainer.addEventListener('click', e => {
    const elem = e.target
    if(elem.tagName === 'BUTTON') {
       elem.parentNode.remove()
    }
})



//add

function autocompliteAdd (name, id) {
    const  div = document.createElement('div')
    div.classList.add('searching_element')
    div.textContent = name
    div.id = id
    autocomplite.appendChild(div)
}

function repoContainerAdd (id) {
    let [elem] = reposNow.filter(repo => repo.id === +id)
    console.log(elem.stargazers_count)
    const repo = document.createElement('div')
    const repoInfo = document.createElement('div')
    const repoName = document.createElement('span')
    const owner = document.createElement('span')
    const stars = document.createElement('span')
    const deleteButton = document.createElement('button')

    repo.classList.add('repo')
    repoInfo.classList.add('repo_info')
    repoName.classList.add('repo_info--text')
    repoName.classList.add('name')
    owner.classList.add('repo_info--text')
    stars.classList.add('repo_info--text')
    deleteButton.classList.add('repo_delete')

    repoName.textContent = `Name: ${elem.name}`
    owner.textContent = `Owner: ${elem.owner.login}`
    stars.textContent = `Stars: ${elem.stargazers_count}`

    repoInfo.appendChild(repoName)
    repoInfo.appendChild(owner)
    repoInfo.appendChild(stars)

    repo.appendChild(repoInfo)
    repo.appendChild(deleteButton)

    repoContainer.appendChild(repo)


}



//delete

function autocompliteDelete () {
    autocomplite.classList.add('hidden')
    autocomplite.innerHTML = ''
    reposNow = []
}



