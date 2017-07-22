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