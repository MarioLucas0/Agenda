const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
    res.render("contato", { contato: {} });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();

        if (contato.errors.length > 0) {
            req.flash("errors", contato.errors);
            req.session.save(() => res.redirect("/contato"));
            return;
        }

        req.flash("success", "Contato cadastrado com sucesso!");
        req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render("404");

        const contato = await Contato.buscaPorId(req.params.id);

        if (!contato) return res.render("404");

        res.render("contato", { contato });
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.params.id) return res.render("404");

        const contato = new Contato(req.body);
        await contato.update(req.params.id);

        if (contato.errors.length > 0) {
            req.flash("errors", contato.errors);
            req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
            return;
        }

        req.flash("success", "Contato editado com sucesso!");
        req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.params.id) return res.render("404");

        const contato = await Contato.delete(req.params.id);
        if (!contato) return res.render("404");

        req.flash("success", "Contato deletado com sucesso!");
        req.session.save(() => res.redirect("/"));
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};
