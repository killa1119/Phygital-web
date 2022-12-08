const express = require('express');
const app = express();
const expressBrowserify = require('express-browserify');
const { IamTokenManager } = require('ibm-watson/auth');
const toneApikey = '0ku0c_7C7FOMOu7V0hX4fxch-2716zfaagXrUgSDqfNH'
const speekApiKey = 'RV7Jx_Pnl5dDQxzaz4-rpUyEelAxvn8qV4tsDlE5gQoM'
const url = 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/0859232b-337a-4ab3-87bc-a7c46e0cb4c6/v1/analyze?version=2019-07-12'
const url2 = "https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/5924dd6f-8099-4329-a3a9-3ee829f06bc6/v1/recognize?version=2019-07-12"
const toneAuth = new IamTokenManager({
  apikey:toneApikey,
});
const speekAuth = new IamTokenManager({
  apikey:speekApiKey,
});
const isDev = app.get('env') === 'development';
app.get(
  '/bundle.js',
  expressBrowserify('public/client.js', {
    watch: isDev,
    debug: isDev,
  })
);
app.use(express.static('public/'));
app.get('/api/token', function (req, res) {
  return toneAuth
    .requestToken()
    .then(({ result }) => {
      res.json({ accessToken: result.access_token, url });
    })
    .catch(console.error);
});
app.get('/api/speek', function (req, res) {
  return speekAuth
    .requestToken()
    .then(({ result }) => {
      res.json({ accessToken: result.access_token, url:url2 });
    })
    .catch(console.error);
})
const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
app.listen(port, function () {
  console.log('Watson browserify example server running at http://localhost:%s/', port);
});
