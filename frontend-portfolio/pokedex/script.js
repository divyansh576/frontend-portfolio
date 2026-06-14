const list = document.getElementById("pokemon-list")
const search = document.getElementById("search")

const img = document.getElementById("pokemon-img")
const nameEl = document.getElementById("pokemon-name")
const typesEl = document.getElementById("pokemon-types")
const statsEl = document.getElementById("stats")

let pokemonData=[]

async function loadPokemon(){

for(let i=1;i<=898;i++){

let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
let data = await res.json()

pokemonData.push(data)

let li=document.createElement("li")
li.textContent=`${data.id}. ${data.name}`

li.onclick=()=>showPokemon(data)

list.appendChild(li)

}

}

function showPokemon(p){

img.src=p.sprites.other["official-artwork"].front_default
nameEl.textContent=`${p.id} - ${p.name.toUpperCase()}`

typesEl.innerHTML=p.types
.map(t=>`<span class="type ${t.type.name}">${t.type.name}</span>`)
.join("")

statsEl.innerHTML=""

p.stats.forEach(stat=>{

let div=document.createElement("div")
div.classList.add("stat")

div.innerHTML=`

${stat.stat.name}

<div class="bar">
<div class="fill" style="width:${stat.base_stat/2}%"></div>
</div>

`

statsEl.appendChild(div)

})

}

search.addEventListener("input",()=>{

let value=search.value.toLowerCase()

list.innerHTML=""

pokemonData
.filter(p=>p.name.includes(value))
.forEach(p=>{

let li=document.createElement("li")
li.textContent=`${p.id}. ${p.name}`

li.onclick=()=>showPokemon(p)

list.appendChild(li)

})

})

loadPokemon()