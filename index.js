const express = require('express');
const url = require('url');
const path = require('path');
const fs = require('fs');

const app = express();
const dataPath = path.join(__dirname, '/../','testdata');
const championList = JSON.parse(fs.readFileSync(path.join(dataPath, 'champion.json'))).data;

/**
 * 선택한 챔피언의 data 다운로드
 * @param championId [string] 챔피언 id
 */
app.get('/champion/:championId', (req, res) => {
  let championId = req.params.championId.charAt(0).toUpperCase()+req.params.championId.slice(1)
  // res.send(championList).json();
  if(championList[championId] == null) {
    return res.status(400).json({error: 'Incorrect champion'});
  }
  const data = (fs.readFileSync(path.join(dataPath, `${championId}_data.json`), 'utf8'));
  console.log(data);
  return res.json(data);
});

/**
 * data dragon 버전 체크
 */
app.get('/ddver', (req, res) => {
  const remoteVersion = JSON.parse(fs.readFileSync('https://ddragon.leagueoflegends.com/realms/na.json', 'utf-8'));
  const cdnUrl = remoteVersion.cdn;
  const remoteddVersion = remoteVersion.dd;
  const localVersion = JSON.parse(fs.readFileSync(path.join(dataPath, 'manifest.json')));
  const localddVersion = localVersion.dd;

  if(localVersion == remoteVersion) {
    return res.json({needUpdate: false});
  }
  else {
    return res.json({needUpdate: true});
  }

})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
