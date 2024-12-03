// event listeners
document.addEventListener("DOMContentLoaded", getRandomComic);
document.querySelector("#randomComic").addEventListener("click", getRandomComic);

// functions
async function getRandomComic(){
    let url = `/api/randomComic`;
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    let image = document.querySelector("#randomComicImg");
    let comicName = document.querySelector("#randomComicName");
    image.src = data[0].comicUrl;
    image.alt = data[0].comicTitle;
    comicName.innerHTML = data[0].comicSiteName;
}