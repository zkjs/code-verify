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

    var sol_value = window.cm.getValue();
    var byte_value = window.bytearea.getValue().replace(/[/n]/g, '');

    console.log('byte_value', byte_value, typeof (byte_value));
    // if (!sol_value) {
    //   $(".alert").show();
    //   return;
    // }
    //
    // if (!byte_value) {
    //   $(".alert").show();
    //   return;
    // }
    //
    // $(".alert").hide();

    $("#loading_main").show();
    if (submit_type === sol_type) {
      $.post(request_sol, {
        code: sol_value
      }, function (data, textStatus) {
        console.log("data", data);
        console.log("textStatus", textStatus);
        $("#loading_main").hide();
        if (!data.result.callstack) {
          $("#pattern_result_arrows").addClass("safe");
          $("#call_stack_label").text("Call Stack matched");
        } else {
          $("#pattern_result_arrows").addClass("matched");
          $("#call_stack_label").text("Call Stack error");
        }

        if (!data.result.concurrency) {
          $("#pattern_result_bug").addClass("safe");
          $("#concurrency_label").text("Concurrency matched");
        } else {
          $("#pattern_result_bug").addClass("matched");
          $("#concurrency_label").text("Concurrency error");
        }

        if (!data.result.reentrancy) {
          $("#pattern_result_filter").addClass("safe");
          $("#reentrancy_label").text("Re-entrancy matched");
        } else {
          $("#pattern_result_filter").addClass("matched");
          $("#reentrancy_label").text("Re-entrancy error");
        }

        if (!data.result.time_dependency) {
          $("#pattern_result_refresh").addClass("safe");
          $("#time_dependency_label").text("Time Dependency matched");
        } else {
          $("#pattern_result_refresh").addClass("matched");
          $("#time_dependency_label").text("Time Dependency error");
        }

        $("#content_analysis").fadeIn();
      });
    } else {
      $.post(request_bytecode, {
        code: byte_value
      }, function (data, textStatus) {
        console.log("data", data);
        console.log("textStatus", textStatus);
        $("#loading_main").hide();
        if (!data.result.callstack) {
          $("#pattern_result_arrows").addClass("safe");
          $("#call_stack_label").text("Call Stack matched");
        } else {
          $("#pattern_result_arrows").addClass("matched");
          $("#call_stack_label").text("Call Stack error");
        }

        if (!data.result.concurrency) {
          $("#pattern_result_bug").addClass("safe");
          $("#concurrency_label").text("Concurrency matched");
        } else {
          $("#pattern_result_bug").addClass("matched");
          $("#concurrency_label").text("Concurrency error");
        }

        if (!data.result.reentrancy) {
          $("#pattern_result_filter").addClass("safe");
          $("#reentrancy_label").text("Re-entrancy matched");
        } else {
          $("#pattern_result_filter").addClass("matched");
          $("#reentrancy_label").text("Re-entrancy error");
        }

        if (!data.result.time_dependency) {
          $("#pattern_result_refresh").addClass("safe");
          $("#time_dependency_label").text("Time Dependency matched");
        } else {
          $("#pattern_result_refresh").addClass("matched");
          $("#time_dependency_label").text("Time Dependency error");
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
