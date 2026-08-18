// healthController.js fornisce un metodo per verificare lo stato del server.

function healthCheck(req, res) {
    try{
        res.status(200).json({
            status: 'success',
            message: 'Il server è correttamente in funzione' 
        });
    }
    catch(error){
        res.status(500).json({
            status: 'error', 
            message: 'Errore del server' 
        });
    }
}

module.exports = { healthCheck };
