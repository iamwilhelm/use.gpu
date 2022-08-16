import fs from 'fs';
import fetch from 'node-fetch';

const urls = [
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/4/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/4/4.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/4/5.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/5/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/5/4.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/5/5.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/6/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/6/4.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/6/5.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/3/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/3/4.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/3/3/5.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/1.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/2.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/3.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/0/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/1/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/2/0.mvt",
"https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/2/3/0.mvt",
];

const TOKEN = "pk.eyJ1IjoidW5jb25lZCIsImEiOiJjamF2NjhnM2k2MzVmMzNxZXd5djVycTk0In0.a81fYpLbT1COl4RMHvh_sQ";

for (const url of urls) {
  console.log(url)
  const src = url.match(/[0-9]+\/[0-9]+\/[0-9]+\.mvt$/)[0];
  const dest = 'public/tiles/' + src.replace(/\//g, '-');
	await fetch(url + '?access_token=' + TOKEN).then(res => res.buffer()).then(buffer => fs.writeFileSync(dest, buffer));
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
}

