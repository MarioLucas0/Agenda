const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },
    telefone: { type: String, required: false, default: "" },
    criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.update = async function (id) {
    if (typeof id !== "string") return;

    this.valida();
    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

Contato.prototype.register = async function () {
    this.valida();

    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
    this.cleanUp();

    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push("E-mail inválido!");

    if (!this.body.nome) this.errors.push("Nome é um campo obrigatório!");

    if (!this.body.email && !this.body.telefone) this.errors.push("E-mail ou telefone precisam ser cadastrados!");
};

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== "string") {
            this.body[key] = "";
        }
    }

    this.body = {
        nome: this.body.nome.trim(),
        sobrenome: this.body.sobrenome.trim(),
        email: this.body.email.trim(),
        telefone: this.body.telefone.trim(),
    };
};

// Metodos estáticos

Contato.buscaPorId = async (id) => {
    if (typeof id !== "string") return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.buscaContatos = async () => {
    const contatos = await ContatoModel.find().sort({ criadoEm: -1 });
    return contatos;
};

Contato.delete = async (id) => {
    if (typeof id !== "string") return;

    const contato = await ContatoModel.findByIdAndDelete({ _id: id });
    return contato;
};

module.exports = Contato;
