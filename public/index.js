const startBtn = document.querySelector(".startBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const player = document.querySelector(".audio-player");
if (navigator.mediaDevices.getUserMedia) {
    var chunks = [];
    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints).then(
        stream => {
            console.log("授权成功！");
            const mediaRecorder = new MediaRecorder(stream);
            setInterval(() => {
                send()
            }, 4000)
            function send() {                
                if (document.querySelector('.record-box').classList.contains('isRecording')) {
                    mediaRecorder.stop();
                    mediaRecorder.start();
                }
            }
            startBtn.onclick = () => {
                mediaRecorder.start();
                document.querySelector('.record-box').classList.add('isRecording')
                console.log("录音中...");
            }
            pauseBtn.onclick = () => {
                mediaRecorder.stop();
                document.querySelector('.record-box').classList.remove('isRecording')
                console.log("录音结束");
            }
            mediaRecorder.ondataavailable = e => {
                chunks.push(e.data);
            };
            mediaRecorder.onstop = e => {
                if (chunks[0].size > 100) {
                    speek(chunks[0]).then(res => {
                        const text = res.data.results.map(result => result.alternatives[0].transcript).join('.')
                        tone(text).then(res => {
                            console.log()
                            const className = res.data.classifications[0].class_name
                            const textItem = `<div class="record-text-item">
                               ${text}
                                <div class="tone-info"> ${className}</div>
                            </div>`
                            document.querySelector('.record-text-content').innerHTML += textItem
                        })
    
                    })
                    chunks = [];
                }
                
            };
        },
        () => {
            console.error("授权失败！");
        }
    );
} else {
    console.error("浏览器不支持 getUserMedia");
}