function getRandomKathmanduCoords() {
  const minLat = 27.667;
  const maxLat = 27.7665;
  const minLon = 85.2775;
  const maxLon = 85.3815;

  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lon = Math.random() * (maxLon - minLon) + minLon;

  return { latitude: lat, longitude: lon };
}

function getRandomDeviceId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
// Example usage:
function getRandomPm2Levels() {
  const minPm2 = 0;
  const maxPm2 = 100;
  const pm2 = Math.random() * (maxPm2 - minPm2) + minPm2;
  return pm2;
}
async function main() {
  for (let i = 0; i < 1000; i++) {
    const coords = getRandomKathmanduCoords();
    const pm2 = getRandomPm2Levels();
    const deviceId = getRandomDeviceId();

    try {
      const res = await fetch("http://localhost:3501/air", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: coords.latitude,
          lon: coords.longitude,
          utc: new Date(),
          pm2: pm2,
          deviceId: deviceId,
        }),
      });
      console.log("success", await res.json());
    } catch (err) {
      console.error("err in ", coords, err);
    }
    console.log("body", {
      lat: coords.latitude,
      lon: coords.longitude,
      utc: new Date(),
      pm2: pm2,
    });
  }
}
main();
