var base_url = "http://139.199.172.96:5000";
//var type_byte = "byte";

//var request_byte = `${base_url}${type_byte}`;
var request_sol = base_url + '/sol';
var request_bytecode = base_url + '/byte';

var submit_type = 0;

var sol_type = 0;
var byte_type = 1;

(function () {
    $("#analysis_start").click(function () {
        window.cm.save();
        window.bytearea.save();
        var sol_value = window.cm.getTextArea().value;
        var byte_value = window.bytearea.getTextArea().value;

        if(submit_type === sol_type){
            $.post(request_sol, {code: sol_value}, function (data) {
                console.log("data", data);

                if (!data.result.callstack) {
                    $("#pattern_result_arrows").addClass("safe");
                } else {
                    $("#pattern_result_arrows").addClass("matched");
                }

                if (!data.result.concurrency) {
                    $("#pattern_result_bug").addClass("safe");

                } else {
                    $("#pattern_result_bug").addClass("matched");
                }

                if (!data.result.reentrancy) {
                    $("#pattern_result_filter").addClass("safe");
                } else {
                    $("#pattern_result_filter").addClass("matched");
                }

                if (!data.result.time_dependency) {
                    $("#pattern_result_refresh").addClass("safe");
                } else {
                    $("#pattern_result_refresh").addClass("matched");
                }

                $("#content_analysis").fadeIn();
            });
        }else{
            $.post(request_bytecode, {code: byte_value}, function (data) {
                console.log("data", data);

                if (!data.result.callstack) {
                    $("#pattern_result_arrows").addClass("safe");
                } else {
                    $("#pattern_result_arrows").addClass("matched");
                }

                if (!data.result.concurrency) {
                    $("#pattern_result_bug").addClass("safe");

                } else {
                    $("#pattern_result_bug").addClass("matched");
                }

                if (!data.result.reentrancy) {
                    $("#pattern_result_filter").addClass("safe");
                } else {
                    $("#pattern_result_filter").addClass("matched");
                }

                if (!data.result.time_dependency) {
                    $("#pattern_result_refresh").addClass("safe");
                } else {
                    $("#pattern_result_refresh").addClass("matched");
                }

                $("#content_analysis").fadeIn();
            });
        }
    });

    $("#btn-solidity").click(function () {
        submit_type = sol_type;
        $("#btn-solidity").addClass("active");
        $("#btn-bytecode").removeClass("active");
        $("#code-solidity-wrapper").show();
        $("#code-bytecode-wrapper").hide();
    });

    $("#btn-bytecode").click(function () {
        submit_type = byte_type;
        $("#btn-bytecode").addClass("active");
        $("#btn-solidity").removeClass("active");
        $("#code-solidity-wrapper").hide();
        $("#code-bytecode-wrapper").show();
    });
})();


