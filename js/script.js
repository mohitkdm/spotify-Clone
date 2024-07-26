console.log('let write JavaScript');
let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${remainingSeconds}`
}

async function getSongs(folder) {
    currfolder = folder

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // show all the songs in the list 
    let SongUL = document.querySelector(".Songlist").getElementsByTagName("ul")[0]
    SongUL.innerHTML = ""
    for (const Song of songs) {
        SongUL.innerHTML = SongUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${Song.replaceAll("%20", " ")}</div>
                                <div>Mohit</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>  </li>`
    }
    // Attech an element to a listner
    Array.from(document.querySelector(".Songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}
const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".sondinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardconatiner=document.querySelector(".cardconatiner")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardconatiner.innerHTML=cardconatiner.innerHTML+`<div data-folder="${folder}" class="cards">
            <div class="playbutton">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="84" height="84"
                    fill="none">
                    <!-- Green circular background with padding -->
                    <circle cx="14" cy="14" r="12" fill="#1dfd64" />

                    <!-- Black SVG content -->
                    <g stroke="#0000" stroke-width="1">
                        <circle cx="14" cy="14" r="10" />
                        <path
                            d="M11.5 13.1998V14.8002C11.5 16.3195 11.5 17.0791 11.9558 17.3862C12.4115 17.6932 13.0348 17.3535 14.2815 16.6741L15.7497 15.8738C17.2499 15.0562 18 14.6474 18 14C18 13.3526 17.2499 12.9438 15.7497 12.1262L14.2815 11.32594C13.0348 10.6465 12.4115 10.3068 11.9558 10.6138C11.5 10.9209 11.5 11.6805 11.5 13.1998Z"
                            fill="#000000" />
                    </g>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // load the library then click on play
    
    Array.from(document.getElementsByClassName("cards")).forEach(e => {
        e.addEventListener("click", async event => {
            try {
                const folder = event.currentTarget.dataset.folder;
                const songs = await getSongs(`songs/${folder}`);
                playMusic(songs[0])
                // Handle the songs data here, e.g., display or use it in some way
                console.log(songs);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        });
    });

        
    
}

async function main() {

    // get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    // display all the albums in the dynaically
    displayAlbums()

    // attach an event listener to play , next and previous 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg  "
        }
    })

    // listner for time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}  / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //  add an event listner in the seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration) * percent / 100
    })
    // add an event to an hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an event for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Previous button event listener
    previous.addEventListener("click", () => {

        let currentSrc = currentsong.src.split("/").pop();
        let index = songs.indexOf(currentSrc);

        console.log("Current song filename:", currentSrc);
        console.log("Index of current song:", index);

        if (index === -1) {
            console.error("Current song not found in the songs list.");
            return;
        }

        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            console.log("This is the first song, no previous song to play.");
        }
    });

    // Next button event listener
    next.addEventListener("click", () => {

        let currentSrc = currentsong.src.split("/").pop();
        let index = songs.indexOf(currentSrc);

        console.log("Current song filename:", currentSrc);
        console.log("Index of current song:", index);

        if (index === -1) {
            console.error("Current song not found in the songs list.");
            return;
        }

        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        } else {
            console.log("This is the last song, no next song to play.");
        }
    })

    // add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume To", e.target.value, "/100");
        currentsong.volume = parseInt(e.target.value) / 100
    })

    // add event to mute
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg" )
            currentsong.volume=.1
            document.querySelector(".range").getElementsByTagName("input")[0].value=10

        }
    })
}

main()