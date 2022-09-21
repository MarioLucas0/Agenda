const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        for (const key in this.body) {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        }

        this.body = {
            username: this.body.username.trim(),
            password: this.body.password.trim(),
        };

        this.user = await LoginModel.findOne({ username: this.body.username });

        if (!this.user || !bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push("Usuário não existe ou senha incorreta!");
            this.user = null;
            return;
        }
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push("E-mail já cadastrado!");

        this.user = await LoginModel.findOne({ username: this.body.username });
        if (this.user) this.errors.push("Usuário já existe!");
    }

    valida() {
        this.cleanUp();

        if (!validator.isEmail(this.body.email)) this.errors.push("E-mail inválido!");

        if (this.body.password.length < 6 || this.body.password.length > 25) this.errors.push("A senha precisa ter entre 6 e 25 caracteres!");
        if (this.body.username.length < 6 || this.body.username.length > 25) this.errors.push("Seu nome precisa ter entre 6 e 25 caracteres!");
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        }

        this.body = {
            username: this.body.username.trim(),
            email: this.body.email.trim(),
            password: this.body.password.trim(),
        };
    }
}

module.exports = Login;
