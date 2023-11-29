"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cron_1 = __importDefault(require("cron"));
require("dotenv-safe/config");
const axios_1 = __importDefault(require("axios"));
const url_1 = require("./utils/url");
const db_1 = require("@bettrdash/db");
const main = () => {
    const app = (0, express_1.default)();
    cron_1.default;
    const CronJob = cron_1.default.CronJob;
    try {
        const job = new CronJob("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            let websites = yield db_1.prisma.website.findMany();
            websites.forEach((website) => __awaiter(void 0, void 0, void 0, function* () {
                if ((0, url_1.isURL)(website.url)) {
                    let url = website.url;
                    if (website.url.substring(0, 4) !== "http") {
                        url = "https://" + website.url;
                    }
                    yield axios_1.default
                        .get(url)
                        .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                        if (res.status === 200) {
                            if (website.status !== "UP") {
                                yield db_1.prisma.website.update({
                                    where: {
                                        id: website.id,
                                    },
                                    data: {
                                        status: "UP",
                                    },
                                });
                            }
                        }
                        else {
                            if (website.status !== "DOWN") {
                                yield db_1.prisma.website.update({
                                    where: {
                                        id: website.id,
                                    },
                                    data: {
                                        status: "UP",
                                    },
                                });
                            }
                        }
                    }))
                        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
                        yield db_1.prisma.website.update({
                            where: {
                                id: website.id,
                            },
                            data: {
                                status: "INVALID URL",
                            },
                        });
                        console.log(`${website.url} --> ${e.message}`);
                        console.log("----DOWN----");
                        return;
                    }));
                }
                else {
                    yield db_1.prisma.website.update({
                        where: {
                            id: website.id,
                        },
                        data: {
                            status: "INVALID URL",
                        },
                    });
                }
            }));
        }), null, true, "America/Los_Angeles");
        job.start();
    }
    catch (e) {
        console.log(e.message);
    }
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Monitor API ready at http://localhost:${process.env.PORT}`);
    });
};
main();
//# sourceMappingURL=index.js.map