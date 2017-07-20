//таблица с курсом валют в меню при наличии подключения к интернету
$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,EURRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=",
        success: function(json){
            var USDRUB = json.query.results.rate[0].Rate;
            var EURRUB = json.query.results.rate[1].Rate;
            var courseLS = [USDRUB, EURRUB];
            localStorage.setItem("courseLS", JSON.stringify(courseLS));
            $('#course_v').append('<div class="card"><div class="header bg-light-green"><h2>КУРС ВАЛЮТ</h2></div><div class="body table-responsive"><table class="table"><thead><tr><th>Валюта</th><th>Курс</th></tr></thead><tbody><tr><th>USD</th><th>'+ USDRUB +'</th></tr><tr><th>EUR</th><th>'+EURRUB +'</th></tr></tbody></table></div></div>');
        } 
    });
});

$(document).on('click', '#new_account', function (event) {
    //создание счетов в LocalStorage
    //получение массива со всеми счетами или создание, если его не существует
    if (localStorage.getItem("myAccounts") == null) {
        var myAccounts = [ ];
    } else {
        var myAccounts = JSON.parse(localStorage.getItem("myAccounts"));
    }
    //создание нового счета
    function createAcc(nameAccount, sumAccount, valutaAccount) {
        this.nameAccount = nameAccount;
        this.sumAccount = sumAccount;
        this.valutaAccount = valutaAccount;
    }
    var nameAccount = document.getElementById('name_account').value;
    var sumAccount = document.getElementById('sum_account').value;
    var valutaAccount = document.querySelector('input[name=valuta]:checked').value;

    var newAcc = new createAcc(nameAccount, sumAccount, valutaAccount);
    myAccounts.push(newAcc);
    var sObj = JSON.stringify(myAccounts);
    localStorage.setItem("myAccounts", sObj);
    var params = localStorage.myAccounts;
    $.ajax({
        type: "POST",
        url: "/json/myAcc.json",
        data: params,
        dataType: "text",
        success: function(json){document.getElementById('form_validation').reset();}
    }); 
    document.location.reload(true);
});

//календарь для выбора даты в формах расходов/доходов
$(document).ready(function(){
    $('.date').bootstrapMaterialDatePicker({
        time: false,
        clearButton: true
    });
});

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

//подсчет и отрисовка всех доступных средств
$(document).ready(function(){
    $.getJSON( "/json/myAcc.json", {}, function(data){
        var itemsUSD = [];
        var itemsEUR = [];
        var itemsRUB = [];
        $.each(data, function(i, item){
            if (item.valutaAccount == "USD"){
                var n = parseFloat(item.sumAccount);
                itemsUSD.push(n)
            }
        });
        $.each(data, function(i, item){
            if (item.valutaAccount == "EUR"){
                var n = parseFloat(item.sumAccount);
                itemsEUR.push(n)
            }
        });
        $.each(data, function(i, item){
            if (item.valutaAccount == "руб"){
                var n = parseFloat(item.sumAccount);
                itemsRUB.push(n)
            }
        });
        sumUSD = 0;
        sumEUR = 0;
        sumRUB = 0;
        for(var i=0;i<itemsUSD.length;i++){
            sumUSD = sumUSD + itemsUSD[i];
        }
        for(var i=0;i<itemsEUR.length;i++){
            sumEUR = sumEUR + itemsEUR[i];
        }
        for(var i=0;i<itemsRUB.length;i++){
            sumRUB = sumRUB + itemsRUB[i];
        }
        $('#statistic_list').append('<div class="card"><div class="body table-responsive"><table class="table"><thead><tr><th>Валюта</th><th>Доступно</th></tr></thead><tbody><tr><th>руб</th><th>'+ sumRUB +'</th></tr><tr><th>USD</th><th>'+ sumUSD +'</th></tr><tr><th>EUR</th><th>'+ sumEUR +'</th></tr></tbody></table></div></div>');
        //пересчет и отрисовка всех средств в единой валюте, если был получен курс валют из интернета
        if (localStorage.getItem("courseLS") != null) {
            var course_valuts = JSON.parse(localStorage.getItem("courseLS"));
            var USDRUB = parseFloat(course_valuts[0]);
            var EURRUB = parseFloat(course_valuts[1]);
            RUB = (sumRUB + sumUSD*USDRUB + sumEUR*EURRUB).toFixed(2);
            USD = (RUB/USDRUB).toFixed(2);
            EUR = (RUB/EURRUB).toFixed(2);
            $('#statistic_money').append('<div class="card"><div class="body table-responsive"><table class="table"><thead><tr><th>В пересчете на</th><th>Всего доступных средств</th></tr></thead><tbody><tr><th>рубли</th><th>'+ RUB +'</th></tr><tr><th>USD</th><th>'+ USD +'</th></tr><tr><th>EUR</th><th>'+ EUR +'</th></tr></tbody></table></div></div>');
        }
    });
});

//получение доступных счетов для управления финансами
$(document).ready(function(){
    $.getJSON( "/json/myAcc.json", {}, function(data){
        $.each(data, function(i, item){
           $('.accountSelector').append('<option>'+ item.nameAccount +'</option>');
        });
    });
});

$(document).on('click', '#new_rate', function (event) {
    $.getJSON( "/json/myAcc.json", {}, function(data) {
        //создание расходов в LocalStorage
        //получение массива с расходами или создание
        if (localStorage.getItem("myRate") == null){
            var myRate = [ ];
        } else {
            var myRate = JSON.parse(localStorage.getItem("myRate"));
        }
        //получение массива журнала операций или создание
        if (localStorage.getItem("myjurnal") == null){
            var myjurnal = [ ];
        } else {
            var myjurnal = JSON.parse(localStorage.getItem("myjurnal"));
        }
        //создание нового расхода
        function createRate(date, operation, accSel, sum, comment) {
            this.date = date;
            this.operation = operation;
            this.accSel = accSel;
            this.sum = sum;
            this.comment = comment;
        }
        var date = document.getElementById('rate_date').value;
        var operation = document.getElementById('rate_operation').value;
        var accSel = document.getElementById('rate_acc').value;
        var sum1 = document.getElementById('rate_sum').value;
        var comment = document.getElementById('rate_comment').value;

        if((date != "") && (operation != "") && (accSel != "") && (sum1 != "")){
            var itemsV = [];
            var items = [];
            $.each(data, function (i, item) {
                if (item.nameAccount == accSel) {
                    var v = item.valutaAccount;
                    itemsV.push(v)
                    var n = parseFloat(item.sumAccount);
                    items.push(n);
                }
            });
            var money = items[0] + parseFloat(sum1)
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
            var sum = sum1 + ' ' + itemsV;
            var newRate = new createRate(date, operation, accSel, sum, comment);
            myRate.push(newRate);
            myjurnal.push(newRate);
            var sObj = JSON.stringify(myRate);
            var sObjmj = JSON.stringify(myjurnal);
            localStorage.setItem("myRate", sObj);
            localStorage.setItem("myjurnal", sObjmj);
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
                dataType: "text",
                success: function(json){document.getElementById('form_validation_rate').reset();}
            });
            document.location.reload(true);
        };
    });
});

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

$(document).on('click', '#new_rent', function (event) {
    $.getJSON( "/json/myAcc.json", {}, function(data) {
        //создание доходов в LocalStorage
        //получение массива с доходами или создание
        if (localStorage.getItem("myRent") == null) {
            var myRent = [ ];
        } else {
            var myRent = JSON.parse(localStorage.getItem("myRent"));
        }
        //получение массива журнала операций или создание
        if (localStorage.getItem("myjurnal") == null) {
            var myjurnal = [ ];
        } else {
            var myjurnal = JSON.parse(localStorage.getItem("myjurnal"));
        }
        //создание нового дохода
        function createRent(date, operation, accSel, sum, comment) {
            this.date = date;
            this.operation = operation;
            this.accSel = accSel;
            this.sum = sum;
            this.comment = comment;
        }
        var date = document.getElementById('rent_date').value;
        var operation = document.getElementById('rent_operation').value;
        var accSel = document.getElementById('rent_acc').value;
        var sum1 = document.getElementById('rent_sum').value;
        var comment = document.getElementById('rent_comment').value;
        if((date != "") && (operation != "") && (accSel != "") && (sum1 != "")){
            var itemsV = [];
            var items = [];
            $.each(data, function (i, item) {
                if (item.nameAccount == accSel) {
                    var v = item.valutaAccount;
                    itemsV.push(v)
                    var n = parseFloat(item.sumAccount);
                    items.push(n);
                }
            });
            var money = items[0] + parseFloat(sum1)
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
            var sum = sum1 + ' ' + itemsV;
            var newRent = new createRent(date, operation, accSel, sum, comment);
            myRent.push(newRent);
            myjurnal.push(newRent);
            var sObj = JSON.stringify(myRent);
            var sObjmj = JSON.stringify(myjurnal);
            localStorage.setItem("myRent", sObj);
            localStorage.setItem("myjurnal", sObjmj);
            var params = localStorage.myRent; 
            var paramsO = localStorage.myjurnal;
            $.ajax({
                type: "POST",
                url: "/json/myjurnal.json",
                data: paramsO,
                dataType: "text"
            }); 
            $.ajax({
                type: "POST",
                url: "/json/myRent.json",
                data: params,
                dataType: "text",
                success: function(json){document.getElementById('form_validation_rent').reset();}
            });
            document.location.reload(true);
        };
    });
});

//отрисовка таблицы со всеми доходами
$(document).ready(function(){
    var datatable_rent = $('#table_myrent').DataTable({
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
            "url": "/json/myRent.json",
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
                    return '<button type="button" data-id="' + full.accSel + '" data-target="#deleteWindow" data-toggle="modal" class="btn btn-default btn-circle waves-effect waves-circle waves-float deleteRentBtn"><i class="material-icons">delete_forever</i></button>'
                }
            }
        ]
    });
    //удаление дохода по клику
    var row, row_data_acc;
    $(document).on('click', '.deleteRentBtn', function (event) {
        event.preventDefault();
        row = this.closest('tr');
        row_data_acc = datatable_rent.row(this.closest('tr')).data();
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
            var step1 = localStorage.myRent.replace(variant1, '');
            var step2 = step1.replace(variant2, '');
            var step3 = step2.replace(variant3, '');
            var rateLs = localStorage.getItem("myRate");
            if (rateLs == "[]"){var newJurnal = step3} else if (step3 == "[]"){var newJurnal = rateLs} else {var newJurnal = step3 + rateLs}
            localStorage.setItem("myRent", step3);
            localStorage.setItem("myjurnal", newJurnal);
            var params = localStorage.myRent;
            var paramsO = localStorage.myjurnal;
            $.ajax({
              type: "POST",
              url: "/json/myjurnal.json",
              data: paramsO,
              dataType: "text"
            });
            $.ajax({
              type: "POST",
              url: "/json/myRent.json",
              data: params,
              dataType: "text"
            });
            document.location.reload(true);
        });
    });
    $.ajax({
        type: "GET",
        url: "/json/myRent.json",
        success: function(json){
            var jsonLS = JSON.stringify(json);
            localStorage.setItem("myRent", jsonLS);
        }
    });
});

//отрисовка таблицы журнала операций
$(document).ready(function(){
    var datatable_rent = $('#table_actions').DataTable({
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