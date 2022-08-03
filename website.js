function topNavResponse() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

let video_count = 0;
videoPlayer = document.getElementById("mainVideoSource");
video = document.getElementById("mainVideo");
videos = 8

videoShowcaseTexts = [1, 2, 3, 4, 5, 5, 6, 7]
projectNames = ["computer-vision", "computer-vision", "motion-control", "guitar", "computer-vision", "computer-vision", "computer-vision", "cnc"]

function playNextVideo() {
    if (video_count === videos - 1) {
        video_count = -1;
    }
    playVideo(video_count + 1)
}

function playVideo(index) {
    let x;
    video_count = index;
    videoPlayer.setAttribute("src", "videos/main-video-" + (video_count + 1) + ".mp4");
    video.load();
    video.play();
    for (let i = 0; i < videos; i++) {
        x = document.getElementById("showcaseText" + videoShowcaseTexts[i]);
        if (videoShowcaseTexts[i] !== videoShowcaseTexts[video_count]) {
            removeHref(i);
            x.className = "";
        } else {
            setTimeout(function () {
                addHref(video_count);
            }, 1);
            x.className = "activeShowcase";
        }
    }
}

function addHref(id) {
    var x = document.getElementById("showcaseText" + videoShowcaseTexts[id]);
    x.setAttribute("href", projectNames[id] + ".html")
}

function removeHref(id) {
    var x = document.getElementById("showcaseText" + videoShowcaseTexts[id]);
    x.removeAttribute("href")
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if(dots.length !== 0){
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" activeSlide", "");
            dots[slideIndex-1].className += " activeSlide";
        }
        if(captionText !== null){
            captionText.innerHTML = dots[slideIndex-1].alt;
        }
    }


    if(slides[slideIndex-1] != null){
        slides[slideIndex-1].style.display = "block";
    }

}



function plusSlidesNav(n) {
    showSlidesNav(slideIndex += n);
}
function currentSlideNav(n) {
    showSlidesNav(slideIndex = n);
}

function showSlidesNav(n){
    showSlides(n);
    var slides = document.getElementsByClassName("mySlides");

    for(let i = 1; i < slides.length+1; i++){

        if(i === slideIndex){
            document.getElementById("nav" + i).className = "activeNavBar";
            document.getElementById("caption"+i).style.display = "block";
        }
        else{
            document.getElementById("nav" + i).className = "mainSlideshowNavBar";
            document.getElementById("caption"+i).style.display = "none";
        }
    }
}