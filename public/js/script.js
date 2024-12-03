// event listeners
let commentLinks = document.querySelectorAll("a.commentLink");
for (link of commentLinks) {
    link.addEventListener("click", getComments);
}
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

async function getComments(){
    var myModal = new bootstrap.Modal(document.getElementById("commentModal"));
    myModal.show();
    // alert("success");
    let url = `/api/comments/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let comments = document.querySelector("#comments");
    comments.innerHTML = "";
    for(i of data){
        comments.innerHTML += `
        <div>
            <p>${i.author}(${i.email}): ${i.comment}</p>
        </div>`
    }
}