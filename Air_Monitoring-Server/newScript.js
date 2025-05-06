function getRandomDeviceId() {
  return Math.random().toString(36).substring(2, 20).toUpperCase();
}

async function main() {
  const res = await fetch("http://localhost:3501/air");

  const allAirs = await res.json();
  //   console.log("all airs", allAirs);
  const AirsWithIds = allAirs.data.map((oldAir) => {
    return {
      ...oldAir,
      deviceId: getRandomDeviceId(),
    };
  });
  AirsWithIds.forEach(async (air) => {
    const res = await fetch("http://localhost:3501/air", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...air,
      }),
    });
    const json = await res.json();
    console.log("air", json);
  });
  //   console.log("AirsWithIds", AirsWithIds);

  //   try {
  //     const deviceId = getRandomDeviceId();
  //     const res = await fetch("http://localhost:3501/air", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         deviceId: deviceId,
  //       }),
  //     });
  //     console.log("success", await res.json());
  //   } catch (err) {
  //     console.error("err in ", deviceId, err);
  //   }
}
main();
