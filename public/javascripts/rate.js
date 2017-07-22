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
