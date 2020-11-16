import axios from "axios";
import { config } from "./config";
type Data =
  | {
      [country: string]: {
        streemaUrls: Array<string>;
        actualUrls: Array<string>;
      };
    }
  | {};

const fs = require("fs");
const cheerio = require("cheerio");
export const baseUrl = "https://streema.com/";
const countryDirectoryUrl = baseUrl + "radios/country/";

export const wait = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

export const getFileName = () => new Date().getTime().toString();

export const getPlayerUrls = (
  countryPageData: string
): Array<string | undefined> => {
  const $ = cheerio.load(countryPageData);
  const items = $(".item").toArray();
  const streemaUrls = items.map((i) => {
    if (!i.attribs || !i.attribs["data-url"]) {
      return undefined;
    }
    return i.attribs["data-url"];
  });
  return streemaUrls;
};

export const getStreamUrl = (playerData: string) => {
  if (!playerData) {
    return undefined;
  }
  const $ = cheerio.load(playerData);
  const src = $("#content-audio > source").get()[0].attribs.src;
  return src;
};

export const getCountryPage = async (country: string): Promise<string> => {
  return (await axios(countryDirectoryUrl + country)).data;
};
