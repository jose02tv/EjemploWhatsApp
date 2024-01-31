"use strict";
// API/src/infrastructure/repositories/ws.external.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qr_image_1 = require("qr-image");
const path_1 = require("path");
/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends whatsapp_web_js_1.Client {
    constructor() {
        super({
            authStrategy: new whatsapp_web_js_1.LocalAuth(),
            puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
        });
        this.status = false;
        this.generateImage = (base64) => {
            try {
                const tmpPath = (0, path_1.join)(process.cwd(), "tmp");
                let qr_svg = (0, qr_image_1.image)(base64, { type: "svg", margin: 4 });
                qr_svg.pipe(require("fs").createWriteStream(`${tmpPath}/qr.svg`));
                console.log("⚡ QR generado en", tmpPath, "⚡");
                console.log("⚡ Recuerda que el QR se actualiza cada minuto ⚡");
                console.log("⚡ Actualiza F5 el navegador para mantener el mejor QR⚡");
            }
            catch (e) {
                console.error("Error en generateImage:", e.message);
            }
        };
        console.log("Iniciando....");
        this.initialize();
        this.on("ready", () => {
            this.status = true;
            console.log("LOGIN_SUCCESS");
        });
        this.on("auth_failure", () => {
            this.status = false;
            console.log("LOGIN_FAIL");
        });
        this.on("qr", (qr) => this.generateImage(qr));
    }
    /**
     * Enviar mensaje de WS
     * @param lead
     * @returns
     */
    sendMsg(lead) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.status)
                    return Promise.resolve({ error: "WAIT_LOGIN" });
                const { message, phone } = lead;
                const response = yield this.sendMessage(`${phone}@c.us`, message);
                return { id: response.id.id };
            }
            catch (e) {
                console.error("Error en sendMsg:", e.message);
                return Promise.resolve({ error: e.message });
            }
        });
    }
    getStatus() {
        return this.status;
    }
}
exports.default = WsTransporter;
