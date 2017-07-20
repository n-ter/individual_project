//валидация для создания счетов
$(function () {
    $('#form_validation').validate({
        rules: {
            'name': {
                required: true
            },
            'number': {
                required: true
            },
            'valuta': {
                required: true
            },
        },
        messages: {
            "name": {
                required: "Обязательно для заполнения"
            },
            "valuta": {
                required: "Обязательно для заполнения: выберите валюту"
            },
            "number": {
                required: "Обязательно для заполнения",
                number: "Пожалуйста введите число"
            }
        },
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });
});
//валидация для расходов
$(function () {
    $('#form_validation_rate').validate({
        rules: {
            'date': {
                required: true
            },
            'number': {
                required: true
            },
            'operation': {
                required: true
            },
            'accSel': {
                required: true
            }
        },
        messages: {
            "date": {
                required: "Обязательно для заполнения"
            },
            "operation": {
                required: "Обязательно для заполнения"
            },
            "accSel": {
                required: "Обязательно для заполнения / Создайте счет, если нет доступных"
            },
            "number": {
                required: "Обязательно для заполнения",
                number: "Пожалуйста введите число",
                max: $.validator.format( "Пожалуйста введите значение меньше {0}." ),
            }
        },
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });
});
//валидация для доходов
$(function () {
    $('#form_validation_rent').validate({
        rules: {
            'date': {
                required: true
            },
            'number': {
                required: true
            },
            'accSel': {
                required: true
            },
            'operation': {
                required: true
            }
        },
        messages: {
            "date": {
                required: "Обязательно для заполнения"
            },
            "operation": {
                required: "Обязательно для заполнения"
            },
            "accSel": {
                required: "Обязательно для заполнения / Создайте счет, если нет доступных"
            },
            "number": {
                required: "Обязательно для заполнения",
                number: "Пожалуйста введите число",
                min: $.validator.format( "Пожалуйста введите значение больше {0}." ),
            }
            
        },
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });
});