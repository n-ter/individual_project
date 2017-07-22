//отрисовка таблицы со расходами
$(document).ready(function(){
    var datatable_rate = $('#table_myrate').DataTable({
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
            "url": "/json/myRate.json",
            "dataSrc": ""
        },
       "columns": [
           { "data": "operation" },
           { "data": "accSel" },
           { "data": "date" },
           { "data": "sum" },
           { "data": "comment" },
           {className: "center",
                "render": function (data, type, full, meta) {
                    return '<button type="button" data-id="' + full.accSel + '" data-target="#deleteWindow" data-toggle="modal" class="btn btn-default btn-circle waves-effect waves-circle waves-float deleteRateBtn"><i class="material-icons">delete_forever</i></button>'
                }
            }
        ]
    });
    //удаление расхода по клику
    var row, row_data_acc;
    $(document).on('click', '.deleteRateBtn', function (event) {
        event.preventDefault();
        row = this.closest('tr');
        row_data_acc = datatable_rate.row(this.closest('tr')).data();
        $.getJSON( "/json/myAcc.json", {}, function(data) {
            var items = [];
            $.each(data, function (i, item) {
                if (item.nameAccount == row_data_acc.accSel) {
                    var n = parseFloat(item.sumAccount);
                    items.push(n);
                }
            });                                                    
            sum1 = row_data_acc.sum.split(' ')[0]

            var money = items[0] - parseFloat(sum1)
            var old = '"'+JSON.stringify(items[0])+'"'
            var oldjson = JSON.stringify(localStorage.myAccounts)
            var normal_oldjson =  oldjson.replace(/\\/g, '')
            var new_money = '"'+money.toString()+'"'
            var sObj_r = normal_oldjson.replace(old, new_money)
            var sObj_n = sObj_r.replace('"[', '[')
            var sObj_new = sObj_n.replace(']"', ']')
            localStorage.removeItem('myAccounts');
            localStorage.setItem("myAccounts", sObj_new);
            var newAcc_sum = localStorage.myAccounts
            $.ajax({
                type: "POST",
                url: "/json/myAcc.json",
                data: newAcc_sum,
                dataType: "text"
            });
            var variant1 = JSON.stringify(row_data_acc) + ',';
            var variant2 =  ','+ JSON.stringify(row_data_acc);
            var variant3 = JSON.stringify(row_data_acc);
            var step1 = localStorage.myRate.replace(variant1, '');
            var step2 = step1.replace(variant2, '');
            var step3 = step2.replace(variant3, '');
            var rentLs = localStorage.getItem("myRent");
            if (rentLs == "[]"){var newJurnal = step3} else if (step3 == "[]"){var newJurnal = rentLs}  else {var newJurnal = step3 + rentLs}
            localStorage.setItem("myRate", step3);
            localStorage.setItem("myjurnal", newJurnal);
            var params = localStorage.myRate;
            var paramsO = localStorage.myjurnal;
            $.ajax({
              type: "POST",
              url: "/json/myjurnal.json",
              data: paramsO,
              dataType: "text"
            });
            $.ajax({
              type: "POST",
              url: "/json/myRate.json",
              data: params,
              dataType: "text"
            });
            document.location.reload(true);
        });
    });
    $.ajax({
            type: "GET",
            url: "/json/myRate.json",
            success: function(json){
                var jsonLS = JSON.stringify(json);
                localStorage.setItem("myRate", jsonLS);
            }
    });
});