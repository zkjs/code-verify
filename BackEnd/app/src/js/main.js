var base_url = "http://139.199.172.96:5000";
//var type_byte = "byte";

//var request_byte = `${base_url}${type_byte}`;
var request_sol = base_url + "/sol";
var request_submit = base_url + "/submit";
var request_result = base_url + "/results";

var submit_type = 0;

var sol_type = 0;
var byte_type = 1;
var sol1_type = 2;
var sol2_type = 3;

function updateAnasy(data) {}

(function() {
  $("#analysis_start").click(function() {
    var sol_value = window.cm.getValue();

    $("#content_analysis").fadeOut();

    $("#loading_main").show();

    var requestStat = false;

    if (submit_type === sol_type) {
      var isCheck0 = $("#check0").prop("checked");
      var isCheck1 = $("#check1").prop("checked");
      var isCheck2 = $("#check2").prop("checked");
      var isCheck3 = $("#check3").prop("checked");

      console.log("check", isCheck0, isCheck1, isCheck2, isCheck3);

      $.post(
        request_submit,
        {
          config: { isCheck0, isCheck1, isCheck2, isCheck3 },
          code: sol_value
        },
        function(data, textStatus) {
          // fixme 目前只是返回成功还是失败
          requestStat = true;
        }
      );

      if (requestStat) {
        var timer = setInterval(function() {
          // todo 网络请求结果
          $.get(request_result, function(data, textStatus) {
            if (textStatus === "success") {
              // todo 网络更新数据
              console.log("data", data);
              console.log("textStatus", textStatus);

              $("#loading_main").hide();

              if (!data.result.callstack) {
                $("#pattern_result_arrows").addClass("safe");
                $("#call_stack_label").text("Call Stack pass");
              } else {
                $("#pattern_result_arrows").addClass("matched");
                $("#call_stack_label").text("Call Stack error");
              }

              if (!data.result.concurrency) {
                $("#pattern_result_bug").addClass("safe");
                $("#concurrency_label").text("Concurrency pass");
              } else {
                $("#pattern_result_bug").addClass("matched");
                $("#concurrency_label").text("Concurrency error");
              }

              if (!data.result.reentrancy) {
                $("#pattern_result_filter").addClass("safe");
                $("#reentrancy_label").text("Re-entrancy pass");
              } else {
                $("#pattern_result_filter").addClass("matched");
                $("#reentrancy_label").text("Re-entrancy error");
              }

              if (!data.result.time_dependency) {
                $("#pattern_result_refresh").addClass("safe");
                $("#time_dependency_label").text("Time Dependency pass");
              } else {
                $("#pattern_result_refresh").addClass("matched");
                $("#time_dependency_label").text("Time Dependency error");
              }

              $("#content_analysis").fadeIn();

              // TODO 动态标注错误代码行数
              var array = new Array();
              array.push(2);
              array.push(3);
              array.push(4);
              highlightLine(array);
            }
            clearInterval(timer);
          });
        }, 200);
      }
    }
  });

  $("#btn-solidity").click(function() {
    submit_type = sol_type;
    $("#btn-solidity").addClass("active");
    $("#btn-bytecode").removeClass("active");
    $("#btn-sample1").removeClass("active");
    $("#btn-sample2").removeClass("active");

    window.cm.setValue(
      "contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    function withdraw() {\n      msg.sender.call.value(balances[msg.sender])();\n   }\n\n}"
    );
  });

  $("#btn-bytecode").click(function() {
    submit_type = byte_type;
    $("#btn-bytecode").addClass("active");
    $("#btn-solidity").removeClass("active");
    $("#btn-sample1").removeClass("active");
    $("#btn-sample2").removeClass("active");

    window.cm.setValue(
      "contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    function withdraw() {\n      }\n\n}"
    );
  });

  $("#btn-sample1").click(function() {
    submit_type = sol1_type;
    $("#btn-bytecode").removeClass("active");
    $("#btn-solidity").removeClass("active");
    $("#btn-sample1").addClass("active");
    $("#btn-sample2").removeClass("active");

    window.cm.setValue(
      "contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    }\n\n}"
    );
  });

  $("#btn-sample2").click(function() {
    submit_type = sol2_type;
    $("#btn-bytecode").removeClass("active");
    $("#btn-solidity").removeClass("active");
    $("#btn-sample1").removeClass("active");
    $("#btn-sample2").addClass("active");

    window.cm.setValue(
      "contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n     }\n\n}"
    );
  });
})();
