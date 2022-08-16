export const π = Math.PI;

export const EARTH_CIRCUMFERENCE = 40075016.686; // meter

export const MAPBOX_TILE_SIZE = 512;
export const MAPBOX_STYLE = 'streets-v11';
export const MAPBOX_USERNAME = 'mapbox';

export const toRad = π / 180;

export const makeMapTileSource = (username, style, size, accessToken) => (x, y, zoom) =>
  `https://api.mapbox.com/styles/v1/${username}/${style}/tiles/${size}/${zoom}/${x}/${y}.mvt?access_token=${accessToken}`;

export const getTileFromLatLong = (latitude, longitude, zoom = 1) => {
  const lat = toRad * latitude;

  const n = Math.pow(2, zoom);
  const x = n * (longitude + 180) / 360;
  const y = n * (1 - (Math.log(Math.tan(lat) + 1/Math.cos(lat)) / π)) / 2;

  const scale = EARTH_CIRCUMFERENCE * Math.cos(lat) / n; // m / tile

  return [x, y, n, scale];
};

const seq = (n, start = 0, step = 1) => Array.from({length: n}).map((_, i) => start + i * step);
