require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
    .connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        app.emit("pronto");
    })
    .catch((e) => console.log(e));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

const { middlewareGlobal, checkError, csrfMiddleware } = require("./src/middlewares/middleware");

const sessionOptions = session({
    secret: "*C^HwN*sX8^lMoimuL7ddSteQSE*fQKu6!hiVTiZWKpTMiefLV",
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());
app.use(middlewareGlobal);
app.use(checkError);
app.use(csrfMiddleware);
app.use(routes);

app.on("pronto", () => {
    app.listen(3000, () => {
        console.error("Acessar http://localhost:3000");
        console.error("Servidor executando na porta 3000");
    });
});
