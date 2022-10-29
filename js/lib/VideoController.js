export default class VideoController extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
        this.styleSheet = this.querySelector("style");
        console.log(this.styleSheet);
        // * VIDEO
        this.video = this.querySelector("video");
        // * CONTROLS
        this.controls = this.querySelector(".controls-container");
        this.playButton = this.querySelector(".play");
        this.pauseButton = this.querySelector(".pause");

        this.volumeOn = this.querySelector(".volume-on");
        this.volumeOff = this.querySelector(".volume-off");
        this.volumeValue = this.querySelector(".volume-value");

        this.progressWatching = this.querySelector(".progress-watching");
        this.currentDuration = this.querySelector(".current-duration");
        this.totalDuration = this.querySelector(".total-duration");

        this.downloadButton = this.querySelector(".download");
        this.fullscreenOn = this.querySelector(".fullscreen-on");
        this.fullscreenOff = this.querySelector(".fullscreen-off");

        // * EVENTS
        this.init();
        this.customize();
        this.toggleWatching();
        this.toggleMuted();
        this.setVolume();
        this.isPlaying();
        this.setCurrentTime();
        this.toggleFullscreen();
    }

    // * GENERAL
    toggleIcon(firstIcon, secondIcon) {
        firstIcon.classList.toggle("hide");
        secondIcon.classList.toggle("hide");
    }

    setBackgroundSize(element, value) {
        element.style.backgroundSize = `${value}% 100%`;
    }

    // * VOLUME
    setVolume() {
        this.video.volume = 0.5;
        this.volumeValue.addEventListener("input", (event) => {
            const value = +event.target.value;
            this.video.volume = value / 100;
            this.setBackgroundSize(this.volumeValue, value);
            if (value == 0) {
                this.video.muted = true;
                this.volumeOn.classList.add("hide");
                this.volumeOff.classList.remove("hide");
            } else {
                this.video.muted = false;
                this.volumeOn.classList.remove("hide");
                this.volumeOff.classList.add("hide");
            }
        });
    }

    toggleMuted() {
        this.volumeOn.addEventListener("click", () => {
            this.video.muted = true;
            this.setVolumeValueInput(0);
            this.toggleIcon(this.volumeOn, this.volumeOff);
        });
        this.volumeOff.addEventListener("click", () => {
            this.video.muted = false;
            this.video.volume = 0.5;
            this.setVolumeValueInput(50);
            this.toggleIcon(this.volumeOn, this.volumeOff);
        });
    }

    setVolumeValueInput(value) {
        this.volumeValue.value = value;
        this.setBackgroundSize(this.volumeValue, value);
    }

    // * FULLSCREEN
    toggleFullscreen() {
        this.fullscreenOn.addEventListener("click", () => {
            if (this.requestFullscreen) {
                this.requestFullscreen();
            }
            this.video.classList.add("fullscreen");
            this.toggleIcon(this.fullscreenOn, this.fullscreenOff);
        });
        this.fullscreenOff.addEventListener("click", () => {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            this.video.classList.remove("fullscreen");
            this.toggleIcon(this.fullscreenOn, this.fullscreenOff);
        });
    }

    // * WATCHING
    toggleWatching() {
        this.playButton.addEventListener("click", () => {
            this.video.play();
            this.setTotalDurationIfNotSetted();
            this.toggleIcon(this.playButton, this.pauseButton);
        });
        this.pauseButton.addEventListener("click", () => {
            this.video.pause();
            this.toggleIcon(this.playButton, this.pauseButton);
        });
        this.video.addEventListener("click", () => {
            if (this.video.paused) {
                this.video.play();
                this.setTotalDurationIfNotSetted();
                this.toggleIcon(this.playButton, this.pauseButton);
            } else {
                this.video.pause();
                this.toggleIcon(this.playButton, this.pauseButton);
            }
        });
    }

    setTotalDurationIfNotSetted() {
        if (this.video.duration) {
            this.setDuration(this.totalDuration, this.video.duration);
        }
    }

    setCurrentTime() {
        this.progressWatching.addEventListener("input", (e) => {
            const value = +e.target.value;
            this.video.currentTime = (value * this.video.duration) / 100;
        });
    }

    setProgressWatchingValue(value) {
        this.progressWatching.value = value;
        this.setBackgroundSize(this.progressWatching, value);
    }

    isPlaying() {
        this.video.addEventListener("timeupdate", (e) => {
            const value = (this.video.currentTime / this.video.duration) * 100;
            console.log(value);
            this.setProgressWatchingValue(value.toFixed(2));
            this.setDuration(this.currentDuration, this.video.currentTime);
            // this.setTotalDurationIfNotSetted();
            if (this.video.currentTime == this.video.duration) {
                this.toggleIcon(this.playButton, this.pauseButton);
            }
        });
    }

    setDuration(durationElement, duration) {
        durationElement.textContent = Math.round(duration)
            .toString()
            .toHHMMSS(this.video.duration);
    }

    getTemplate() {
        return `
        <style data="devo-video"></style>
        <video src="#"></video>
        <div class="controls-container">
            <div class="progress-bar">
                <input type="range" class="progress-watching video-range" value="0" max="100" step="0.01"/>
            </div>
            <div class="controls-button-container">
                <div class="left">
                    <div class="watch-button flex-align">
                        <svg class="play" width="32" height="32" viewBox="0 0 24 24"> <path fill="currentColor" d="M9.525 18.025q-.5.325-1.013.037Q8 17.775 8 17.175V6.825q0-.6.512-.888q.513-.287 1.013.038l8.15 5.175q.45.3.45.85t-.45.85Z" /> </svg>
                        <svg class="pause hide" width="32" height="32" viewBox="0 0 16 16"> <path fill="currentColor" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" /> </svg>
                    </div>
                    <div class="volume-container flex-align">
                        <svg class="volume-on" width="32" height="32" viewBox="0 0 24 24" > <path fill="currentColor" d="M14 20.725v-2.05q2.25-.65 3.625-2.5t1.375-4.2q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.137Q21 8.8 21 11.975q0 3.175-1.95 5.612q-1.95 2.438-5.05 3.138ZM3 15V9h4l5-5v16l-5-5Zm11 1V7.95q1.175.55 1.838 1.65q.662 1.1.662 2.4q0 1.275-.662 2.362Q15.175 15.45 14 16Z" />
                        </svg>
                        <svg class="volume-off hide" width="32" height="32" viewBox="0 0 24 24" > <path fill="currentColor" d="m19.8 22.6l-3.025-3.025q-.625.4-1.325.688q-.7.287-1.45.462v-2.05q.35-.125.688-.25q.337-.125.637-.3L12 14.8V20l-5-5H3V9h3.2L1.4 4.2l1.4-1.4l18.4 18.4Zm-.2-5.8l-1.45-1.45q.425-.775.638-1.625q.212-.85.212-1.75q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.137Q21 8.8 21 11.975q0 1.325-.362 2.55q-.363 1.225-1.038 2.275Zm-3.35-3.35L14 11.2V7.95q1.175.55 1.838 1.65q.662 1.1.662 2.4q0 .375-.062.738q-.063.362-.188.712ZM12 9.2L9.4 6.6L12 4Z" />
                        </svg>
                        <div class="volume-range flex-align">
                            <input type="range" class="volume-value video-range" value="50"/>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="duration-container">
                        <span class="current-duration">00:00</span>
                        /
                        <span class="total-duration">00:00</span>
                    </div>
                    <a href="#" download class="download hide flex-align">
                        <svg width="32" height="27" viewBox="0 0 24 24"><path fill="currentColor" d="M14.225 21.75q-.5.125-.875-.2t-.375-.9q0-.275.213-.513q.212-.237.487-.312q.7-.175 1.363-.438q.662-.262 1.262-.662q.275-.175.575-.15q.3.025.5.225q.4.4.363.912q-.038.513-.488.788q-.7.425-1.462.738q-.763.312-1.563.512Zm4.6-4.375q-.2-.2-.238-.512q-.037-.313.138-.563q.375-.6.65-1.263q.275-.662.425-1.362q.075-.3.325-.5t.55-.2q.55 0 .863.4q.312.4.187.9q-.2.8-.512 1.55q-.313.75-.738 1.45q-.275.425-.762.462q-.488.038-.888-.362Zm1.825-6.4q-.275 0-.525-.2t-.325-.5q-.15-.7-.425-1.363q-.275-.662-.65-1.262q-.175-.25-.138-.575q.038-.325.238-.525q.375-.4.875-.35q.5.05.775.475q.45.7.763 1.45q.312.75.512 1.55q.125.5-.2.9t-.9.4ZM9.725 21.725q-3.35-.8-5.525-3.5q-2.175-2.7-2.175-6.25T4.2 5.725q2.175-2.7 5.55-3.5q.5-.125.875.2T11 3.3q0 .275-.212.512q-.213.238-.488.313q-2.75.625-4.512 2.8q-1.763 2.175-1.763 5.05t1.763 5.05q1.762 2.175 4.487 2.8q.275.075.488.312q.212.238.212.538q0 .55-.375.863q-.375.312-.875.187ZM16.35 5.25q-.625-.4-1.275-.675q-.65-.275-1.375-.45q-.275-.075-.487-.313Q13 3.575 13 3.275q0-.55.375-.875q.375-.325.875-.2q.8.2 1.562.512q.763.313 1.463.738q.45.275.5.787q.05.513-.35.913q-.2.2-.512.225q-.313.025-.563-.125Zm-4.375 11.325q-.2 0-.375-.075t-.325-.2L7.65 12.65q-.275-.275-.275-.7q0-.425.3-.725q.275-.275.7-.275q.425 0 .725.275l1.875 1.9V8q0-.425.288-.713Q11.55 7 11.975 7t.713.287q.287.288.287.713v5.125l1.85-1.85q.3-.3.725-.3t.725.3q.3.3.287.725q-.012.425-.312.725L12.675 16.3q-.125.125-.312.2q-.188.075-.388.075Z"/></svg>
                    </a>
                    <div class="display-container">
                        <svg class="fullscreen-on" width="32" height="32" viewBox="0 0 24 24"> <path fill="currentColor" d="M6 19q-.425 0-.713-.288Q5 18.425 5 18v-3q0-.425.287-.713Q5.575 14 6 14t.713.287Q7 14.575 7 15v2h2q.425 0 .713.288q.287.287.287.712t-.287.712Q9.425 19 9 19Zm0-9q-.425 0-.713-.288Q5 9.425 5 9V6q0-.425.287-.713Q5.575 5 6 5h3q.425 0 .713.287Q10 5.575 10 6t-.287.713Q9.425 7 9 7H7v2q0 .425-.287.712Q6.425 10 6 10Zm9 9q-.425 0-.712-.288Q14 18.425 14 18t.288-.712Q14.575 17 15 17h2v-2q0-.425.288-.713Q17.575 14 18 14t.712.287Q19 14.575 19 15v3q0 .425-.288.712Q18.425 19 18 19Zm3-9q-.425 0-.712-.288Q17 9.425 17 9V7h-2q-.425 0-.712-.287Q14 6.425 14 6t.288-.713Q14.575 5 15 5h3q.425 0 .712.287Q19 5.575 19 6v3q0 .425-.288.712Q18.425 10 18 10Z" /> </svg>
                        <svg class="fullscreen-off hide" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1v2zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1h-2z"/></svg>
                    </div>
                </div>
            </div>
        </div>        
        `;
    }

    init() {
        this.checkAttribute(
            "src",
            () => {
                this.video.src = this.getAttribute("src");
            },
            true
        );

        this.checkAttribute(
            "poster",
            () => {
                this.video.poster = this.getAttribute("poster");
            },
            true
        );

        this.checkAttribute("autoplay", () => {
            this.video.autoplay = true;
        });

        this.checkAttribute("muted", () => {
            this.video.muted = true;
        });
        this.checkAttribute("loop", () => {
            this.video.loop = true;
        });
        this.checkAttribute("download", () => {
            this.downloadButton.classList.remove("hide");
            this.downloadButton.href = this.video.src;
        });
    }

    checkAttribute(attribute, callback, noEmpty = false) {
        let condition = this.hasAttribute(attribute);
        noEmpty = this.getAttribute(attribute) !== "" || noEmpty;
        if (noEmpty) {
            if (condition) {
                return callback();
            }
        } else if (condition && noEmpty == false) {
            return callback();
        }
    }

    customize() {
        this.customizeElement(
            "progressColor",
            this.progressWatching,
            "colorRange"
        );
        this.customizeElement(
            "progressBackground",
            this.progressWatching,
            "background"
        );
        this.customizeElement(
            "progressThumbColor",
            "progress-watching",
            "colorThumb"
        );
        this.customizeElement(
            "progressThumbSize",
            "progress-watching",
            "sizeThumb"
        );

        this.customizeElement("volumeColor", this.volumeValue, "colorRange");
        this.customizeElement(
            "volumeBackground",
            this.volumeValue,
            "background"
        );
        this.customizeElement("volumeThumbColor", "volume-value", "colorThumb");
        this.customizeElement("volumeThumbSize", "volume-value", "sizeThumb");

        this.customizeElement("color", this, "color");
        this.customizeElement("background", this.controls, "background");
    }

    customizeElement(attribute, element, type) {
        this.checkAttribute(
            attribute,
            () => {
                const value = this.getAttribute(attribute);
                switch (type) {
                    case "colorRange":
                        element.style.backgroundImage = `linear-gradient( ${value} , ${value} )`;
                        break;
                    case "background":
                        element.style.backgroundColor = value;
                        break;
                    case "color":
                        element.style.color = value;
                        break;
                    case "colorThumb":
                        this.customizeThumb(value, "background", element);
                        break;
                    case "sizeThumb":
                        this.customizeThumb(value, "size", element);
                        break;
                }
            },
            true
        );
    }

    customizeThumb(value, property, className) {
        if (property == "size") {
            property = `
                width: ${value}px !important;
                height: ${value}px !important;
            `;
        } else {
            property = `${property}: ${value} !important;`;
        }
        const style = `
            .${className}::-webkit-slider-thumb {
                ${property}
            }
        `;
        if (this.styleSheet.innerHTML == "") {
            this.styleSheet.innerHTML = style;
        } else {
            this.styleSheet.innerHTML += style;
        }
    }
}

customElements.define("devo-video", VideoController);

String.prototype.toHHMMSS = function (totalDuration) {
    const sec_num = parseInt(this, 10);
    const hours = Math.floor(sec_num / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((sec_num - hours * 3600) / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (sec_num - hours * 3600 - minutes * 60)
        .toString()
        .padStart(2, "0");

    if (totalDuration >= 3600) {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
};
