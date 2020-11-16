import { config } from "./config";
import {
  baseUrl,
  getPlayerUrls,
  getStreamUrl,
  wait,
  getCountryPage,
  getFileName,
} from "./helpers";
import axios from "axios";
const fs = require("fs");
const countries = ["Argentina", "Mexico"]; //todo populate

const start = async () => {
  if (config.useExamplePage) {
    console.log("running in test mode, using example data");
    fs.readFile("src/exampleData.html", "utf8", async (err, d) => {
      if (err) {
        console.error(err);
      }
      const playerUrls = getPlayerUrls(d);
      await wait(1000);
      const playerData = (await axios(baseUrl + playerUrls[0])).data;
      getStreamUrl(playerData);
      console.log("done");
    });
    return;
  }

  const results = await Promise.all(
    countries.map(async (c) => {
      const countryPageData = await getCountryPage(c);
      console.log("country page data", countryPageData.slice(0, 12));
      const playerUrls = await getPlayerUrls(countryPageData);
      console.log("playerUrls", playerUrls.slice(0, 1));
      const streamUrls = await Promise.all(
        playerUrls.map(async (e) => {
          const playerData = (await axios(baseUrl + e)).data;
          return getStreamUrl(playerData);
        })
      );
      console.log("streamUrls", streamUrls);
      return streamUrls;
    })
  );

  fs.writeFile(
    `.results/${getFileName()}.json`,
    JSON.stringify(results),
    () => {
      console.log("written");
    }
  );
};

start();
