import { config } from "../../map.js";
import * as Physics from "../../physics/body.js";

export const confg = { config: null };

export const getNewConfig = () => {
  let conf = config(15);
  conf.walls = Physics.wallCoordinates(conf.maze);
  return conf;
};
