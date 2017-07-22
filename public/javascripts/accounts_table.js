//отрисовка таблицы со всеми счетами
$(document).ready(function(){
    var datatable_accounts = $('#table_my-money').DataTable({
        "language": {
            "lengthMenu": "Показывать по _MENU_",
            "sSearch": "Поиск:",
            "zeroRecords": "Ничего не найдено",
            "emptyTable": "В таблице нет данных",
            "info": "Всего _TOTAL_. Показаны с _START_ по _END_.",
            "infoEmpty": "Всего 0. Показаны с 0 по 0.",
            "infoEmpty": "Показано с 0 по 0 из 0 результатов",
            "loadingRecords": "Загрузка...",
            "paginate": {
                "first": "Первая",
                "last": "Последняя",
                "next": "Следующая",
                "previous": "Предыдущая"
            }
        },
       "ajax": {
            "url": "/json/myAcc.json",
            "dataSrc": ""
        },
       "columns": [
           { "data": "nameAccount" },
           { "data": "sumAccount" },
           { "data": "valutaAccount" },
           {className: "center",
                "render": function (data, type, full, meta) {
                    return '<button type="button" data-id="' + full.nameAccount + '" data-target="#deleteWindow" data-toggle="modal" class="btn btn-default btn-circle waves-effect waves-circle waves-float deleteAccBtn"><i class="material-icons">delete_forever</i></button>'
                }
            }
        ]
    });
    //удаление счета по клику
    var row, row_data_acc;
    $(document).on('click', '.deleteAccBtn', function (event) {
        event.preventDefault();
        row = this.closest('tr');
        row_data_acc = datatable_accounts.row(this.closest('tr')).data();
        var variant1 = JSON.stringify(row_data_acc) + ',';
        var variant2 =  ','+ JSON.stringify(row_data_acc);
        var variant3 = JSON.stringify(row_data_acc);
        var step1 = localStorage.myAccounts.replace(variant1, '');
        var step2 = step1.replace(variant2, '');
        var step3 = step2.replace(variant3, '');
        localStorage.setItem("myAccounts", step3);
        var params = localStorage.myAccounts;
        $.ajax({
          type: "POST",
          url: "/json/myAcc.json",
          data: params,
          dataType: "text"
        });
        document.location.reload(true);
    });
    $.ajax({
        type: "GET",
        url: "/json/myAcc.json",
        success: function(json){
            var jsonLS = JSON.stringify(json);
            localStorage.setItem("myAccounts", jsonLS);
        }
    });
});