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



$(document).ready(function () {
    if (document.location.pathname == '/messages' ||
        document.location.pathname == '/messages/notacknowledged' ){

        getMessages();

        $(window).scroll(function () {
            if($(window).scrollTop() + $(window).height() >= $(document).height() - 200 && !inProgress) {
                getMessages();
            }
        });

        $(window).resize(function () {
                getMessages();
        });

        $('#messages').on('click', 'tr', function () {
            let id = $(this).attr('id');
            $.post('/messages/acknowledge/' + id, function (data) {
                if (data &&  document.location.pathname == '/messages/notacknowledged'){
                    $('#' + id).remove();
                }
                else
                    {
                        $('#' + id + '>.acknowledgedDate').text(data.acknowledgedDate);
                }
            });
        });
    }
});






