const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

const app = express();

var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();

        let item = {
            id: req.body.user,
            user: req.body.user,
            textboard: req.body.textboard,
        };
        itemsRef.doc(item.user.toString()).set(item);
        res.send(item);

      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.delete('/api/items/:id', async (req, res) => {
  let id = req.params.id.toString();
    var documentToDelete = itemsRef.doc(id);
    try{
        var doc = await documentToDelete.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else{
            documentToDelete.delete();
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
});

app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.put('/api/items/:id', async (req, res) => {
  let id = req.params.id.toString();
    var documentToEdit = itemsRef.doc(id);
    try{
        var doc = await documentToEdit.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else{
            documentToEdit.update({
              textboard: req.body.textboard,
              moves:req.body.moves,
            });
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
});




exports.app = functions.https.onRequest(app);
