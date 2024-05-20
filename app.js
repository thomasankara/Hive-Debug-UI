const socket = io.connect('http://localhost:5000', {
    transports: ['websocket', 'polling']
});

socket.on('connect', function() {
    console.log('Connected to server via Socket.IO');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('new_message', function(data) {
    console.log('Message received:', data); // Log the message
    console.log('testlog4'); // Log supplémentaire pour vérifier la réception

    const messagesDiv = document.getElementById('messages');
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message');
    newMessageDiv.innerText = `${data.timestamp}: ${data.message}`;

    // Ajouter des classes conditionnelles
    if (data.message.startsWith('[DESTINATION_REACH]')) {
        newMessageDiv.classList.add('destination-reach');
    } else if (data.message.startsWith('[TEST]')) {
        newMessageDiv.classList.add('test-message');
    }

    // Insert new messages at the top
    messagesDiv.insertBefore(newMessageDiv, messagesDiv.firstChild);

    // Limiter le nombre de messages affichés à 5
    // while (messagesDiv.children.length > 5) {
    //     messagesDiv.removeChild(messagesDiv.lastChild);
    // }
});

// Update current date and time every second
setInterval(updateDateTime, 1000);

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent = now.toLocaleString();
    document.getElementById('currentTimestamp').textContent = now.getTime();
}

function updateSenderId(value) {
    const senderIdInputs = [
        'id_sender_pause', 
        'id_sender_unpause', 
        'id_sender_abort', 
        'id_sender_coworker', 
        'id_sender_pause_plus',
        'id_sender_add_activity',
        'id_sender'
    ];

    senderIdInputs.forEach(id => {
        document.getElementById(id).value = value;
    });
}

function startActivity() {
    const idSender = document.getElementById('id_sender').value || "0";
    const infoType = document.getElementById('info_type').value;
    const timestamp = Date.now();

    fetch('http://localhost:5000/start_activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            id_sender: idSender,
            info: infoType
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function pauseActivity() {
    const idSender = document.getElementById('id_sender_pause').value || "0";
    const infoType = document.getElementById('info_type_pause').value;
    const timestamp = Date.now();

    fetch('http://localhost:5000/pause_activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            id_sender: idSender,
            info: infoType
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function unpauseActivity() {
    const idSender = document.getElementById('id_sender_unpause').value || "0";
    const infoType = document.getElementById('info_type_unpause').value;
    const timestamp = Date.now();

    fetch('http://localhost:5000/unpause_activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            id_sender: idSender,
            info: infoType
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function abortActivity() {
    const idSender = document.getElementById('id_sender_abort').value || "0";
    const infoType = document.getElementById('info_type_abort').value;
    const timestamp = Date.now();

    fetch('http://localhost:5000/abort_activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            id_sender: idSender,
            info: infoType
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function addCoworker() {
    const idSender = document.getElementById('id_sender_coworker').value || "0";
    const newCoworkerId = document.getElementById('new_coworker_id').value;
    const timestamp = Date.now();

    fetch('http://localhost:5000/add_coworker', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            id_sender: idSender,
            new_coworker_id: newCoworkerId
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function pausePlusActivity() {
    const idSender = document.getElementById('id_sender_pause_plus').value || "0";
    const infoType = document.getElementById('info_type_pause_plus').value;
    const info1 = document.getElementById('info1_pause_plus').value || "0";
    const info2 = document.getElementById('info2_pause_plus').value || "0";
    const timestamp = Date.now();

    fetch('http://localhost:5000/pause_plus_activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            id_sender: idSender,
            info_type: infoType,
            info1: info1,
            info2: info2
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function addActivity() {
    const timestamp = Date.now();
    const infoType = document.getElementById('info_type').value || "";
    const idSender = document.getElementById('id_sender_add_activity').value || "0";
    const activityType = document.getElementById('activityType').value || "";
    const activityInfo = document.getElementById('activityInfo').value || "";
    const info1 = document.getElementById('info1').value || "0";
    const info2 = document.getElementById('info2').value || "0";

    fetch('http://localhost:5000/add_activity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp,
            info_type: infoType,
            id_sender: idSender,
            activityType: activityType,
            activityInfo: activityInfo,
            info1: info1,
            info2: info2
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function getActivityList() {
    const timestamp = Date.now();
    fetch('http://localhost:5000/get_activity_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function getEventList() {
    const timestamp = Date.now();
    fetch('http://localhost:5000/get_event_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

function getCoworkerList() {
    const timestamp = Date.now();
    fetch('http://localhost:5000/get_coworker_list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: timestamp
        })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}
