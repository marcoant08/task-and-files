const firebase = require('../services/firebase2')

module.exports = {
    async listar(req, res) {
        let tarefas = []

        await firebase
            .firestore()
            .collection("tarefas")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                    tarefas.push({ id: documentSnapshot.id, ...documentSnapshot.data() })
                });

                tarefas.sort(function (a, b) {
                    if (a.createdAt.seconds < b.createdAt.seconds) {
                      return 1;
                    }
                    if (a.createdAt.seconds > b.createdAt.seconds) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                  });
            })
            .catch((err) => {
                console.log("Erro ao carregar tarefas.");
                return res.status(400).send({ erro: 'Erro ao carregar tarefas.'})
            });

        return res.json(tarefas)
    },
    
    async criar(req, res) {
        const { 
            tarefa,
            mail
         } = req.body;

         let data = new Date();

         let dia = data.getDate();
         let mes = data.getMonth() + 1;
         let ano = data.getFullYear();
         let hora = data.getHours();
         let min = data.getMinutes();

         await firebase
            .firestore()
            .collection("tarefas")
            .add({
                tarefa,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (value) => {
                await firebase
                    .firestore()
                    .collection("logs")
                    .add({
                        id: value.id,
                        registro: `Criada por ${mail} em ${dia}/${mes}/${ano} às ${hora}:${min}`,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((value) => {
                        console.log("Log registrado.");
                    })
                    .catch((err) => {
                        console.log("Erro ao registrar log.");
                        return res.status(400).send({ erro: 'Erro ao registrar log.'})
                    });

                console.log("Sua tarefa foi postada!");
            })
            .catch((err) => {
                console.log("Erro ao postar tarefa.");
                return res.status(400).send({ erro: 'Erro ao postar tarefa.'})
            });

        return res.status(200).send({ mensagem: 'Sucesso'})
    },
    
    async editar(req, res) {
        const { 
            idTarefa,
            tarefa,
            mail
         } = req.body;

         let data = new Date();

         let dia = data.getDate();
         let mes = data.getMonth() + 1;
         let ano = data.getFullYear();
         let hora = data.getHours();
         let min = data.getMinutes();

         await firebase
            .firestore()
            .collection("tarefas")
            .doc(idTarefa)
            .update({
                tarefa,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (value) => {
                await firebase
                    .firestore()
                    .collection("logs")
                    .add({
                        id: idTarefa,
                        registro: `Editada por ${mail} em ${dia}/${mes}/${ano} às ${hora}:${min}`,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((value) => {
                        console.log("Log registrado.");
                    })
                    .catch((err) => {
                        console.log("Erro ao registrar log.");
                        return res.status(400).send({ erro: 'Erro ao registrar log.'})
                    });


                console.log("Sua tarefa foi alterada!");
            })
            .catch((err) => {
                console.log("Erro ao alterar tarefa.");
                return res.status(400).send({ erro: 'Erro ao alterar tarefa.'})
            });

        return res.status(200).send({ mensagem: 'Sucesso'})
    },
    
    async excluir(req, res) {
        const { 
            idTarefa,
            mail
         } = req.body;

         let data = new Date();

         let dia = data.getDate();
         let mes = data.getMonth() + 1;
         let ano = data.getFullYear();
         let hora = data.getHours();
         let min = data.getMinutes();

         await firebase
            .firestore()
            .collection("tarefas")
            .doc(idTarefa)
            .delete()
            .then(async () => {
                await firebase
                    .firestore()
                    .collection("logs")
                    .add({
                        id: idTarefa,
                        registro: `Deletada por ${mail} em ${dia}/${mes}/${ano} às ${hora}:${min}`,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((value) => {
                        console.log("Log registrado.");
                    })
                    .catch((err) => {
                        console.log("Erro ao registrar log.");
                        return res.status(400).send({ erro: 'Erro ao registrar log.'})
                    });

                console.log("A tarefa foi excluída.")
            })
            .catch((err) => {
                console.log(err)
                return res.status(400).send({ erro: 'Erro ao excluir tarefa.'})
            })

        return res.status(200).send({ mensagem: 'Sucesso'})
    },

    async listarLogs(req, res){
        const { idTarefa } = req.params;

        let logs = []

        await firebase
            .firestore()
            .collection("logs")
            .where("id", "==", idTarefa)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                    logs.push({ myid: documentSnapshot.id, ...documentSnapshot.data() })
                });

                logs.sort(function (a, b) {
                    if (a.createdAt.seconds > b.createdAt.seconds) {
                      return 1;
                    }
                    if (a.createdAt.seconds < b.createdAt.seconds) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                  });
            })
            .catch((err) => {
            console.log("Erro ao carregar respostas.");
            });

        return res.json(logs)
    }
}