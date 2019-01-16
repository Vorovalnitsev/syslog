/*$(document).ready(function(){
    $("#imgLoad").hide();  //Скрываем прелоадер
});*/

let inProgress = false;
let startFrom = 0;
let quantity = 10;

function getClients(){
    if(document.location.pathname.indexOf('messages') >= 0)
        $.get('/clients/all', function (records) {
            if(records)
                records.forEach(function (item, i, arr) {
                    $("#clientsSelectMenu").append('<option value="' + item.id + '">'+ item.mac + ' - '
                        + item.hostname  +'</option>');
            })
        });
}

function getRecords (){
    if(document.location.pathname.indexOf('messages') >= 0 ||
        document.location.pathname.indexOf('clients') >= 0 ||
        document.location.pathname.indexOf('hosts') >= 0){
            inProgress = true;
            let path = document.location.pathname + '/' +  startFrom + '/' + quantity;

            if(document.location.pathname.indexOf('messages') >= 0){
                if($('#clientsSelectMenu').val() != -1)
                    path='/messages/client/' + $('#clientsSelectMenu').val() + '/' +  startFrom + '/' + quantity;
            }
            $.get(path,
                function(data) {
                    inProgress = false;
                    let records = data;
                    if (records){
                        startFrom = startFrom + records.length;
                        records.forEach(function (item , i , arr ){
                            if (document.location.pathname.indexOf('messages') >= 0){
                                let color;
                                switch (item.severity){
                                    case 0: color='text-danger'; break;
                                    case 1: color='text-danger'; break;
                                    case 2: color='text-danger'; break;
                                    case 3: color='text-danger'; break;
                                    case 4: color='text-warning'; break;
                                    case 5: color='text-success'; break;
                                    case 6: color='text-dark'; break;
                                    case 7: color='text-secondary'; break;
                                }
                                $("#messages").append('<tr class="message ' +color+ '" id="' + item.id + '">' +
                                    '<td>' + item.id + '</td>' +
                                    '<td>' + item.createdDate + '</td>' +
                                    '<td>' + item.hostname + '</td>' +
                                    '<td>' + item.message + '</td>' +
                                    '</tr>');
                            }
                            if (document.location.pathname == '/clients'){
                                $("#clients").append('<tr class="client" id="' + item.id + '">' +
                                    '<td>' + item.id + '</td>' +
                                    '<td>' + item.mac + '</td>' +
                                    '<td class="hostname">' + item.hostname + '</td>' +
                                    '</tr>');
                            }

                            if (document.location.pathname == '/hosts'){
                                $("#hosts").append('<tr class="host" id="' + item.id + '">' +
                                    '<td>' + item.id + '</td>' +
                                    '<td>' + item.hostname + '</td>' +
                                    '<td class="comment">' + item.comment + '</td>' +
                                    '</tr>');
                            }

                        });

                    };
                    if ($(window).height() >= $(document).height() && records.length!=0){
                        getRecords();
                    }

                },
                'json');
    }

}



$(document).ready(function () {
        getClients()
        getRecords();
        $(window).scroll(function () {
            if($(window).scrollTop() + $(window).height() >= $(document).height() - 200
                && !inProgress
            ) {
                getRecords();
            }
        });

        $(window).resize(function () {
            if($(window).height() >= $(document).height()
                && !inProgress
            ) {
                getRecords();
            }
        });

        $('#messages').on('click', 'tr', function () {
            let id = $(this).attr('id');
            alert (id);
        });

        $('#saveClient').on('click', function () {
            let modalEditClient = $('#editClientModal');
            let id = modalEditClient.find('#idClient').val();
            $.post('/clients/' + id + '/update', {hostname: modalEditClient.find('#hostnameClient').val()},
                function (data) {
                    if (data){
                        $('#editClientModal').modal('hide');
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


    $('#hosts').on('click', 'tr', function () {
        let id = $(this).attr('id');
        if (id)
            $.get('/hosts/' + id,
                function(data) {
                    let modalEditHost = $('#editHostModal');
                    if (data){
                        modalEditHost.find('#editHostModalLabel').text('Edit ID - ' + id + '  Hostname - ' + data.hostname);
                        modalEditHost.find('#commentHost').val(data.comment);
                        modalEditHost.find('#idHost').val(data.id);
                        $('#editHostModal').modal('show');
                    }
                });

    });

    $('#saveHost').on('click', function () {
        let modalEditHost = $('#editHostModal');
        let id = modalEditHost.find('#idHost').val();
        $.post('/hosts/' + id + '/update', {comment: modalEditHost.find('#commentHost').val()},
            function (data) {
                if (data){
                    $('#editHostModal').modal('hide');
                    $('#' + id + '>.comment').text(data.comment);
                }
            });
    });

    $('#clientsSelectMenu').on('change', function () {
        $('#messages>tr').remove();
        startFrom = 0;
        getRecords();
    })
});






