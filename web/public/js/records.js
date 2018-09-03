/*$(document).ready(function(){
    $("#imgLoad").hide();  //Скрываем прелоадер
});*/

let inProgress = false;
let startFrom = 0;
let quantity = 10;

function getMessages (){
    inProgress = true;
    $.get(document.location.pathname + '/' +  startFrom + '/' + quantity,
        function(data) {
            inProgress = false;
            let messages = data;
            if (messages){
                startFrom = startFrom + messages.length;
                messages.forEach(function (item , i , arr ){
                    $("#messages").append('<tr class="message" id="' + item.id + '">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.createdDate + '</td>' +
                        '<td>' + item.hostname + '</td>' +
                        '<td>' + item.message + '</td>' +
                        '<td class="acknowledgedDate">' + item.acknowledgedDate + '</td>' +
                        '</tr>'
                    );
                });
                if ($(window).height() >= $(document).height() && messages.length!=0){
                    getMessages();
                }

            }
        },
        'json');
}

function getClients (){
    inProgress = true;
    $.get(document.location.pathname + '/' +  startFrom + '/' + quantity,
        function(data) {
            inProgress = false;
            let clients = data;
            if (clients){
                startFrom = startFrom + clients.length;
                clients.forEach(function (item , i , arr ){
                    $("#clients").append('<tr class="clients" id="' + item.id + '">' +
                        '<td>' + item.id + '</td>' +
                        '<td>' + item.mac + '</td>' +
                        '<td class="hostname">' + item.hostname + '</td>' +
                        '</tr>'
                    );
                });
                if ($(window).height() >= $(document).height() && clients.length!=0){
                    getClients();
                }

            }
        },
        'json');
}

$(document).ready(function () {
    if (document.location.pathname == '/messages' ||
        document.location.pathname == '/messages/notacknowledged' ){

        getMessages();

        $(window).scroll(function () {
            if($(window).scrollTop() + $(window).height() >= $(document).height() - 200
                && !inProgress
                && document.location.pathname != '/messages/notacknowledged'
            ) {
                getMessages();
            }
        });

        $(window).resize(function () {
            if($(window).height() >= $(document).height()
                && !inProgress
                && document.location.pathname != '/messages/notacknowledged') {
                getMessages();
            }
        });

        $('#messages').on('click', 'tr', function () {
            let id = $(this).attr('id');
            if (id)
                $.post('/messages/acknowledge/' + id, function (data) {
                    if (data &&  document.location.pathname == '/messages/notacknowledged'){
                        $('#' + id).remove();
                        startFrom = startFrom - 1;
                        if (startFrom == 0)
                            getMessages();
                    }
                    else
                        $('#' + id + '>.acknowledgedDate').text(data.acknowledgedDate);

                });
        });
    }

    if (document.location.pathname == '/clients' ||
        document.location.pathname == '/clients/notacknowledged' ){

        getClients();

        $(window).scroll(function () {
            if($(window).scrollTop() + $(window).height() >= $(document).height() - 200
                && !inProgress
                && document.location.pathname != '/clients/notacknowledged') {
                getClients();
            }
        });

        $(window).resize(function () {
            if($(window).height() >= $(document).height()
                && !inProgress
                && document.location.pathname != '/clients/notacknowledged') {
                getClients();
            }
        });

        $('#saveClient').on('click', function () {
            let modalEditClient = $('#editClientModal');
            let id = modalEditClient.find('#idClient').val();
            $.post('/clients/' + id + '/update', {hostname: modalEditClient.find('#hostnameClient').val()},
                function (data) {
                    if (data){
                        $('#editClientModal').modal('hide');
                        if (document.location.pathname == '/clients/notacknowledged'){
                            $('#' + id).remove();
                            startFrom = startFrom - 1;
                            if (startFrom = 0 )
                                getClients();
                            }
                        else
                            $('#' + id + '>.hostname').text(data.hostname);
                    }
            });
        });

        $('#clients').on('click', 'tr', function () {
            let id = $(this).attr('id');
            if (id)
                $.get('/clients/' + id,
                    function(data) {
                        let modalEditClient = $('#editClientModal');
                        if (data){
                            modalEditClient.find('#editClientModalLabel').text('Edit ID - ' + id + '  MAC - ' + data.mac);
                            modalEditClient.find('#hostnameClient').val(data.hostname);
                            modalEditClient.find('#idClient').val(data.id);
                            $('#editClientModal').modal('show');
                        }
                });

        });
    }
});






