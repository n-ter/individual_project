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