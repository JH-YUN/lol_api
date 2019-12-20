const express = require('express');
const url = require('url');
const path = require('path');
const fs = require('fs');
const request = require('request');

const app = express();
const dataPath = path.join(__dirname, '/../', 'testdata');
const championList = JSON.parse(fs.readFileSync(path.join(dataPath, 'champion.json'))).data;

/**
 * 선택한 챔피언의 data 다운로드
 * @param championId [string] 챔피언 id
 */
app.get('/champion/:championId', (req, res) => {
  let championId = req.params.championId.charAt(0).toUpperCase() + req.params.championId.slice(1)
  // res.send(championList).json();
  if (championList[championId] == null) {
    return res.status(400).json({ error: 'Incorrect champion' });
  }
  const data = (fs.readFileSync(path.join(dataPath, `${championId}_data.json`), 'utf8'));
  console.log(data);
  return res.json(data);
});

/**
 * data dragon 버전 체크
 */
app.get('/ddver', (req, res) => {
  request('https://ddragon.leagueoflegends.com/realms/na.json', (error, respone, body) => {
    const remoteVersion = JSON.parse(body);
    const cdnUrl = remoteVersion.cdn;
    const remoteddVersion = remoteVersion.dd;
    const localVersion = JSON.parse(fs.readFileSync(path.join(dataPath, 'manifest.json')));
    const localddVersion = localVersion.dd;
    console.log(remoteVersion);
    console.log(localVersion);
    if (remoteddVersion == localddVersion) {
      return res.json({ needUpdate: false });
    }
    else {
      return res.json({ needUpdate: true });
    }
  })
})

/**
 * 챔피언 데이터 날짜 체크
 */
app.get('/champver', (req, res)=> {

})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
