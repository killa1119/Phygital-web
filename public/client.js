
const { BearerTokenAuthenticator } = require('ibm-watson/auth');
const TokenData = {
  tone: {},
  speek: {}
}
function getToken() {
  fetch('/api/token').then(resp => resp.json()).then(res => {
    TokenData.tone = res
  });
  fetch('/api/speek').then(resp => resp.json()).then(res => {
    TokenData.speek = res
  });
}
window.tone = (text) => {
  const credentials = TokenData.tone
  const authorization = new BearerTokenAuthenticator({
    bearerToken: credentials.accessToken,
  }).bearerToken
  return axios({
    method: 'post',
    url: credentials.url,
    headers: {
      authorization: 'Bearer ' + authorization,
      'Content-Type': "application/json"
    },
    data: {
      "language": "en",
      "text": text,
      "features": {
        "classifications": {
          "model": "tone-classifications-en-v1"
        }
      }
    }
  })
}
window.speek = (file) => {
  const credentials = TokenData.speek
  const authorization = new BearerTokenAuthenticator({
    bearerToken: credentials.accessToken,
  }).bearerToken
  return axios({
    method: 'post',
    url: credentials.url,
    headers: {
      Authorization: 'Bearer ' + authorization,
      'Content-Type': "audio/webm;codecs=opus"
    },
    data: file
  })
}
getToken();
const recordBtn = document.querySelector(".record-btn");

if (navigator.mediaDevices.getUserMedia) {
  var chunks = [];
  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(
    stream => {
      console.log("授权成功！");

      const mediaRecorder = new MediaRecorder(stream);

      recordBtn.onclick = () => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          recordBtn.textContent = "record";
          console.log("录音结束");
        } else {
          mediaRecorder.start();
          console.log("录音中...");
          recordBtn.textContent = "stop";
        }
        console.log("录音器状态：", mediaRecorder.state);
      };
      mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
      };
      mediaRecorder.onstop = e => {
        speek(chunks[0]).then(res => {
          const text = res.data.results.map(result => result.alternatives[0].transcript).join('.')
          console.log(text)
          tone(text).then(res => {
            console.log(res.data.classifications.class_name)
          })

        })
        chunks = [];
      };
    },
    () => {
      console.error("授权失败！");
    }
  );
} else {
  console.error("浏览器不支持 getUserMedia");
}