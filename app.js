const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const watson = require('watson-developer-cloud');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

var workspace_id = '04192bcf-3e61-4f82-8433-8e58bdab4ffd';
var port = 3036;
var mensajes = [];
var context = '';

var assistant = new watson.AssistantV1({
    version: '2018-09-20',
    iam_apikey: 'T9lhk6zXFNL8PqicliiJtn8IkR6n7sKcrqOj3IXIi29I',
    url: 'https://gateway.watsonplatform.net/assistant/api'
});

app.get('/', function(req, res) {
    if(mensajes.length == 0) {
        var params = {
            workspace_id: workspace_id,
            input: {
                'text': ''
            }
        }
        assistant.message(params, function(err, result, response) {
            if(err)
                console.log('error', err);
            else {
                var respuesta;
                context = result.context;
                respuesta = result.output.text[0];
                let mensaje = {
                    mensaje: respuesta,
                    clase: 'bot'
                }
                mensajes.push(mensaje)
                res.render('home', {mensajes});
            }
        })
    } else {
        res.render('home', { mensajes });
    }
});

app.post('/mensaje', function(req, res) {
    var texto = req.body.texto;
    let mensaje = {
        mensaje: texto,
        clase: 'user'
    }
    mensajes.push(mensaje);
    var params = {
        workspace_id: workspace_id,
        input: {
            'text': texto
        },
        context: context
    }
    assistant.message(params, function(err, result, response) {
        if(err)
            console.log('error', err);
        else {
            var respuesta;
            context = result.context;
            respuesta = result.output.text[0];
            let mensaje = {
                mensaje: respuesta,
                clase: 'bot'
            }
            mensajes.push(mensaje)
            res.redirect('/')
        }
    });
});

app.listen(port, () => {
    console.log('El servidor está levantado en el puerto: ' + port);
})