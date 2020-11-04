const { response } = require('express');
const firebase = require('../services/firebase2')

module.exports = {
    async criar(req, res) {
        const { 
            nome,
            email,
            senha,
            cidade,
            nivel
        } = req.body;
        
        //console.log(req)

        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, senha)
            .then(async (value) => {
                await firebase
                    .firestore()
                    .collection("usuarios")
                    .doc(value.user.uid)
                    .set({
                        nome,
                        email,
                        cidade,
                        nivel,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(async (snapshot) => {
                        console.log('Usuario criado')
                    })
                    .catch((err) => {
                        console.log("Erro ao criar usuário");
                    });
            })
            .catch((err) => {
                if (err.code === "auth/invalid-email") {
                    console.log("E-mail inválido.");
                    return res.status(400).send({ erro: 'E-mail inválido.'})
                }
                if (err.code === "auth/weak-password") {
                    console.log("Senha muito fraca.");
                    return res.status(400).send({ erro: 'Senha muito fraca.'})
                }
                if (err.code === "auth/email-already-in-use") {
                    console.log("O e-mail digitado já foi cadastrado.");
                    return res.status(400).send({ erro: 'O e-mail digitado já foi cadastrado.'})
                }
            });

        return res.status(200).send({ mensagem: 'Sucesso'})
    },
    
    async recuperarSenha(req, res) {
        const { email } = req.body;

        await firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then((value) => {
                console.log(`Um link de recuperação de senha foi enviado para ${email}`);
                return res.status(200).send({ mensagem: `Um link de recuperação de senha foi enviado para ${email}`})
            })
            .catch((err) => {
                //console.log(err.code);
                if (err.code === "auth/invalid-email") {
                    console.log("E-mail inválido.");
                    return res.status(400).send({ erro: 'E-mail inválido.'})
                }

                if (err.code === "auth/user-not-found") {
                    console.log("E-mail não cadastrado.");
                    return res.status(400).send({ erro: 'E-mail não cadastrado.'})
                }

                console.log("Erro ao enviar e-mail de recuperação de senha.");
                return res.status(400).send({ erro: 'Erro ao enviar e-mail de recuperação de senha.'})
            });
        
        return res.status(200).send({ mensagem: 'Sucesso'})
    }, 

    async login (req, res){
        const {
            email,
            senha
        } = req.body;

        await firebase.auth().signInWithEmailAndPassword(email, senha).then(async () => {
            await firebase
                .firestore()
                .collection('usuarios')
                .where('email', '==', email)
                .get()
                .then(querySnapshot =>{
                    let item = []

                    querySnapshot.forEach((documentSnapshot) => {
                        item.push({ id: documentSnapshot.id, ...documentSnapshot.data() })
                    });

                    res.json(item[0])
                })
                .catch(err => res.status(200).send({erro: 'Erro'}))
        })
        .catch(function(error) {
            console.log(error.code)

            if(error.code == 'auth/user-not-found'){
                return res.status(400).send({ erro: 'E-mail não cadastrado.'})
            }

            if(error.code == 'auth/wrong-password'){
                return res.status(400).send({ erro: 'Senha inválida.'})
            }

            return res.status(400).send({ erro: 'Erro no login.'})
        });
    },

    async logout (req, res){
        firebase.auth().signOut().then(() => {
            return res.status(200).send({ mensagem: 'Desconectado.'})
        }).catch((err) => {
            return res.status(400).send({ erro: 'Erro ao desconectar.'})
        });
    }
}