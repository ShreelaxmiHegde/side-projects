let dogImg = document.querySelector(".dog-img");
let breedSearch = document.querySelector(".breed-search");
let breedInput = document.querySelector("#breed-input");

//search dog through input 
breedSearch.addEventListener("click", async function () {
    let breed = breedInput.value.toLowerCase().trim(); //user entered breed name

    //ERROR FIX: originally you used "dog.value" which does not exist
    let selected = breed; //use the breed from input

    //convert "hound plott" to "hound/plott"
    let urlBreed = selected.replace(" ", "/");

    let search = await fetch(`https://dog.ceo/api/breed/${urlBreed}/images/random`);
    let response = await search.json();

    if(response.status === "error") {
        dogImg.innerHTML = `<p>Breed not found!</p>`;
    } else {
        //ERROR FIX: alt should not be ${dog}, since dog is undefined
        dogImg.innerHTML = `<img src="${response.message}" alt="${breed}" width="300">`;
    }
});

//display breed list
let breedList = document.querySelector("#breed-list");
//search option generation while input
let allBreeds = [];

async function loadBreeds() {
    let breedlist = await fetch("https://dog.ceo/api/breeds/list/all");
    let response = await breedlist.json();
    let breeds = response.message;

    for(let breed in breeds) {
        if(breeds[breed].length == 0) { //no sub breed
            let opt = document.createElement("option");
            opt.value = `${breed}`;
            opt.innerText = `${breed}`;
            breedList.appendChild(opt);

            allBreeds.push(breed); //move to existing breed list
        } else { //has sub breed
            breeds[breed].forEach((sub) => {
                let opt = document.createElement("option");
                opt.value = `${breed}/${sub}`;
                opt.innerText = `${breed} ${sub}`;
                breedList.appendChild(opt);

                allBreeds.push(`${breed} ${sub}`); //move to existing breed list
            });
        }
    }

    // after fetching, now populate datalist (previously it was empty at start)
    populateBreeds(allBreeds);
}

// Show image for selected breed
let exploreDogImg = document.querySelector(".explore-dog-img");
let showDogBtn = document.querySelector("#show-dog");

showDogBtn.addEventListener("click", async function () {
    let selectedBreed = breedList.value;

    //prevent empty selection
    if(!selectedBreed) {
        exploreDogImg.innerHTML = `<p>Please select a breed!</p>`;
        return;
    }

    let resp = await fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random`);
    let data = await resp.json();
    exploreDogImg.innerHTML = `<img src="${data.message}" width="300" alt="dog">`;
    showDogBtn.innerText = "show another";
});

loadBreeds(); //initialize breeds list

let datalist = document.querySelector("#breeds");

// populate <datalist> for input suggestions
function populateBreeds(breeds) {
    datalist.innerHTML = ""; //clear old options
    breeds.forEach(breed => {
        let opt = document.createElement("option");
        opt.value = breed; // shows directly in input as selectable
        datalist.appendChild(opt);
    });
}

//when user presses enter after typing a breed name
breedInput.addEventListener("change", function () {
    let selected = breedInput.value.trim().toLowerCase();
    let urlBreed = selected.replace(" ", "/");
    let url = `https://dog.ceo/api/breed/${urlBreed}/images/random`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                dogImg.innerHTML = `<img src="${data.message}" width="300" alt="dog">`;
            } else {
                dogImg.innerHTML = `<p>Breed not found!</p>`;
            }
        })
        .catch(err => {
            console.error(err);
            dogImg.innerHTML = `<p>Error loading dog!</p>`;
        });
});

//update datalist dynamically while typing
breedInput.addEventListener("input", function() {
    let query = breedInput.value.toLowerCase().trim(); 
    if(query.length === 0) {
        populateBreeds(allBreeds); //show all breeds
    } else {
        let matches = allBreeds.filter(breed => breed.startsWith(query));
        populateBreeds(matches);    
    }
});

//random dog pic generation
let randomDog = document.querySelector(".random-dog-img");
let randomBtn = document.querySelector(".random-btn");

randomBtn.addEventListener("click", async function() {
    let data = await fetch("https://dog.ceo/api/breeds/image/random");
    let response = await data.json();

    randomDog.innerHTML = `<img src="${response.message}" width="300" alt="dog">`;
});