var Evernote = require('evernote');
var config = require('../config.json');

exports.createnotes = function(req,res){
    if (req.session.oauthAccessToken) {
    var token = req.session.oauthAccessToken;
    var client = new Evernote.Client({
      token: token,
      sandbox: config.SANDBOX,
      china: config.CHINA
    });
    var noteStore = client.getNoteStore();
    var noteTitle = "TESTING";
    var noteBody = "test script";
    client.getNoteStore().listNotebooks().then(function(notebooks) {
      console.log(notebooks);
      var callback = function(note) {
           res.status(201).send({data: note});
      };
      for (var i in notebooks) {
         makeNote(noteStore,noteTitle,noteBody,notebooks[i].guid,callback).catch(function(err){
           console.log('Error:',err);
             });
      }
       req.session.notes=notebooks;
       res.render('index', {session: req.session});
    }).catch(function(error) {
        console.log(error);
       req.session.error = JSON.stringify(error);
      res.render('index', {session: req.session});
    });
  }else {
    console.log('index', {session: req.session});
  }
};


 async function makeNote(noteStore, noteTitle, noteBody, parentNotebookId, callback) {

  var nBody = '<?xml version="1.0" encoding="UTF-8"?>';
  nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
  nBody += "<en-note>" + noteBody + "</en-note>";
   
  var ourNote = new Evernote.Types.Note();
  ourNote.title = noteTitle;
  ourNote.content = nBody;
  ourNote.notebookGuid = parentNotebookId;
 
  noteStore.createNote(ourNote).then(function(note) {
      // console.log(note);
       callback(note);
   }).catch(function (err) {
   
      console.log(err);
    }); 
};