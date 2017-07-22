//отрисовка таблицы журнала операций
$(document).ready(function(){
    var datatable_actions = $('#table_actions').DataTable({
        dom: 'Bfrtip',
        buttons: [ 'pdf', 'excel' ],
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
            "url": "/json/myjurnal.json",
            "dataSrc": ""
        },
       "columns": [
           { "data": "operation" },
           { "data": "accSel" },
           { "data": "date" },
           { "data": "sum" },
           { "data": "comment" }
        ]
    });  
});