export default class VideoController extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
        // VIDEO
        this.video = this.querySelector("video");
        console.dir(this.video);
        this.video.src = this.getAttribute("src");
        // CONTROLS
        this.playButton = this.querySelector(".play");
        this.pauseButton = this.querySelector(".pause");
        this.volumeOn = this.querySelector(".volume-on");
        this.volumeOff = this.querySelector(".volume-off");
        this.volumeValue = this.querySelector(".volume-value");
        // EVENTS
        this.toggleWatching();
        this.toggleMuted();
        this.setVolume();
    }

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

    setBackgroundSize(element, value) {
        element.style.backgroundSize = `${value}% 100%`;
    }

    setVolumeValueInput(value) {
        this.volumeValue.value = value;
        this.setBackgroundSize(this.volumeValue, value);
    }

    toggleWatching() {
        this.playButton.addEventListener("click", () => {
            this.video.play();
            this.toggleIcon(this.playButton, this.pauseButton);
        });
        this.pauseButton.addEventListener("click", () => {
            this.video.pause();
            this.toggleIcon(this.playButton, this.pauseButton);
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

    toggleIcon(firstIcon, secondIcon) {
        firstIcon.classList.toggle("hide");
        secondIcon.classList.toggle("hide");
    }

    getTemplate() {
        return `
        <video></video>
        <div class="controls-container">
            <div class="progress-bar">
                <input type="range" class="progress-watching video-range" />
            </div>
            <div class="controls-button-container">
                <div class="left">
                    <div class="watch-button flex-align">
                        <svg class="play" width="32" height="32" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M9.525 18.025q-.5.325-1.013.037Q8 17.775 8 17.175V6.825q0-.6.512-.888q.513-.287 1.013.038l8.15 5.175q.45.3.45.85t-.45.85Z"
                            />
                        </svg>
                        <svg
                            class="pause hide"
                            width="32"
                            height="32"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill="currentColor"
                                d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
                            />
                        </svg>
                    </div>
                    <div class="volume-container flex-align">
                        <svg
                            class="volume-on"
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M14 20.725v-2.05q2.25-.65 3.625-2.5t1.375-4.2q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.137Q21 8.8 21 11.975q0 3.175-1.95 5.612q-1.95 2.438-5.05 3.138ZM3 15V9h4l5-5v16l-5-5Zm11 1V7.95q1.175.55 1.838 1.65q.662 1.1.662 2.4q0 1.275-.662 2.362Q15.175 15.45 14 16Z"
                            />
                        </svg>
                        <svg
                            class="volume-off hide"
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="m19.8 22.6l-3.025-3.025q-.625.4-1.325.688q-.7.287-1.45.462v-2.05q.35-.125.688-.25q.337-.125.637-.3L12 14.8V20l-5-5H3V9h3.2L1.4 4.2l1.4-1.4l18.4 18.4Zm-.2-5.8l-1.45-1.45q.425-.775.638-1.625q.212-.85.212-1.75q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.137Q21 8.8 21 11.975q0 1.325-.362 2.55q-.363 1.225-1.038 2.275Zm-3.35-3.35L14 11.2V7.95q1.175.55 1.838 1.65q.662 1.1.662 2.4q0 .375-.062.738q-.063.362-.188.712ZM12 9.2L9.4 6.6L12 4Z"
                            />
                        </svg>
                        <div class="volume-range flex-align">
                            <input type="range" class="volume-value video-range" value="50"/>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="display-container">
                        <svg
                            class="fullscreen"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M6 19q-.425 0-.713-.288Q5 18.425 5 18v-3q0-.425.287-.713Q5.575 14 6 14t.713.287Q7 14.575 7 15v2h2q.425 0 .713.288q.287.287.287.712t-.287.712Q9.425 19 9 19Zm0-9q-.425 0-.713-.288Q5 9.425 5 9V6q0-.425.287-.713Q5.575 5 6 5h3q.425 0 .713.287Q10 5.575 10 6t-.287.713Q9.425 7 9 7H7v2q0 .425-.287.712Q6.425 10 6 10Zm9 9q-.425 0-.712-.288Q14 18.425 14 18t.288-.712Q14.575 17 15 17h2v-2q0-.425.288-.713Q17.575 14 18 14t.712.287Q19 14.575 19 15v3q0 .425-.288.712Q18.425 19 18 19Zm3-9q-.425 0-.712-.288Q17 9.425 17 9V7h-2q-.425 0-.712-.287Q14 6.425 14 6t.288-.713Q14.575 5 15 5h3q.425 0 .712.287Q19 5.575 19 6v3q0 .425-.288.712Q18.425 10 18 10Z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>        
        `;
    }
}

customElements.define("devo-video", VideoController);
