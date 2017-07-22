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

    //календарь для выбора даты в формах расходов/доходов
    $('.date').bootstrapMaterialDatePicker({
        time: false,
        clearButton: true
    });

    //подсчет и отрисовка всех доступных средств
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

    //получение доступных счетов для управления финансами
    $.getJSON( "/json/myAcc.json", {}, function(data){
        $.each(data, function(i, item){
           $('.accountSelector').append('<option>'+ item.nameAccount +'</option>');
        });
    });
});
