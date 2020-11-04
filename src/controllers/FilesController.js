const firebase = require('../services/firebase')
const fs = require('fs');
const { excluir } = require('./TarefasController');

module.exports = {
    async enviar(req, res) {
        const {
            originalname,
            filename,
            path,
            size
        } = req.file;

        console.log(req.file)
        
        let bucket = firebase.storage().bucket()

            bucket.upload(path, { destination: `files/${filename}` })
              .then((data) => {
                let file = data[0]
                
                file.getSignedUrl({
                  action: 'read',
                  expires: '03-17-2025'
                }, async (err, url) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  
                  console.log(url)

                  await firebase
                    .firestore()
                    .collection('files')
                    .add({
                        originalname,
                        size,
                        filename,
                        url,
                    })
                    .then((value) => {
                        return res.status(200).send({
                            id: value.id,
                            ...req.file,
                            url,
                        })
                    })
                    .catch((err) => {
                        return res.status(400).send({erro: "Erro ao salvar dados do arquivo."})
                    })
                })
            })
    },

    async listar(req, res) {
        let arquivos = []

        await firebase
            .firestore()
            .collection("files")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                    arquivos.push({ id: documentSnapshot.id, ...documentSnapshot.data() })
                });
            })
            .catch((err) => {
                console.log("Erro ao carregar tarefas.");
                return res.status(400).send({ erro: 'Erro ao carregar tarefas.'})
            });

        return res.json(arquivos)
    },
    
    async excluir(req, res) {
        const { 
            idFile
         } = req.params;

         await firebase
            .firestore()
            .collection("files")
            .doc(idFile)
            .delete()
            .then(() => {
                console.log("A tarefa foi excluída.")
                return res.status(200).send({ mensagem: 'Sucesso'})
            })
            .catch((err) => {
                console.log(err)
                return res.status(400).send({ erro: 'Erro ao excluir tarefa.'})
            })
    },
}