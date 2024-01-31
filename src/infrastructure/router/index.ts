import { readdirSync } from "fs";
import express, { Router, static as expressStatic } from "express";
import { join } from "path";
const router: Router = express.Router();

const PATH_ROUTES = __dirname;

function removeExtension(fileName: string): string {
  const cleanFileName = fileName.split(".").shift() || "";
  return cleanFileName;
}

/**
 *
 * @param file tracks.ts
 */
function loadRouter(file: string): void {
  const name = removeExtension(file);
  if (name !== "index") {
    import(`./${file}`).then((routerModule) => {
      console.log("cargado", name);
      router.use(`/${name}`, routerModule.router);
    });
  }
}

// Sirve la carpeta 'tmp' como recurso estático
const tmpPath = join(process.cwd(), "tmp");
router.use("/tmp", expressStatic(tmpPath));

readdirSync(PATH_ROUTES).filter((file) => loadRouter(file));

export default router;
