//var base_url = "http://139.199.172.96:5000";
var base_url = "http://172.168.40.111:5005";

//var type_byte = "byte";

//var request_byte = `${base_url}${type_byte}`;
//var request_sol = base_url + "/sol";
var request_submit = base_url + "/submit";
var request_result = base_url + "/result";

var submit_type = 0;

var sol_type = 0;
var byte_type = 1;
var sol1_type = 2;
var sol2_type = 3;

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

      console.log("check", isCheck0, isCheck1, isCheck2);

      var task = null;
      $.post(
        request_submit,
        {
          type: 1,
          reentrancy: isCheck0,
          mislocking: isCheck1,
          multisig: isCheck2,
          code: sol_value
        },
        function(data, textStatus) {
          // fixme 目前只是返回成功还是失败
          requestStat = true;
          console.log("requestStat");

          task = data.task;

          if (requestStat) {
            console.log("requestStat");
            var timer = setInterval(function() {
              // todo 网络请求结果
              $.get(request_result + "?task=" + task, function(
                data,
                textStatus
              ) {
                if (textStatus === "success") {
                  // todo 网络更新数据
                  console.log("data", data);
                  console.log("textStatus", textStatus);
                  // 数据返回的样式
                  var results = data.results;
                  var error = data.error;
                  console.log("result", results);

                  if (error !== 0) {
                    return;
                  }

                  var errAlllines = [];

                  var errByTypeLines = [];
                  results.forEach(function(item) {
                    errByTypeLines.push(item.lines);
                    item.lines.forEach(function(item) {
                      errAlllines.push(item);
                    });
                  });

                  var uniqErrLines = _.uniq(errAlllines, true);

                  $("#loading_main").hide();

                  if (results[0]) {
                    $("#pattern_result_arrows").addClass("matched");
                    $("#call_stack_label").text(results[0].description);
                    $("#title1").text(results[0].name);
                    
                    $("#callStack_input").text("Input: " + results[0].input);
                    var matchline = '';
                    errByTypeLines[0].forEach(function (value) {
                      matchline += 'L' + value + ' ';
                    })
                    $("#callStack_matchline").text("Matched lines: " + matchline);
                  } else {
                    $("#category1").fadeOut();
                  }

                  if (results[1]) {
                    $("#pattern_result_bug").addClass("matched");
                    $("#concurrency_label").text(results[1].description);
                    $("#title2").text(results[1].name);
                    $("#concurrency_input").text("Input: " + results[1].input);
  
                    var matchline = '';
                    errByTypeLines[1].forEach(function (value) {
                      matchline += 'L' + value + ' ';
                    })
                    $("#concurrency_matchline").text("Matched lines: " + matchline);
                  } else {
                    $("#category2").fadeOut();
                  }

                  if (results[2]) {
                    $("#pattern_result_filter").addClass("matched");
                    $("#reentrancy_label").text(results[2].description);
                    $("#title3").text(results[2].name);
                    $("#reentrancy_input").text("Input: " + results[2].input);
  
                    var matchline = '';
                    errByTypeLines[2].forEach(function (value) {
                      matchline += 'L' + value + ' ';
                    })
                    $("#reentrancy_matchline").text("Matched lines: " + matchline);
                  } else {
                    $("#category3").fadeOut();
                  }

                  if (results[3]) {
                    $("#pattern_result_refresh").addClass("matched");
                    $("#time_dependency_label").text(results[3].description);
                    $("#title4").text(results[3].name);
                    $("#time_input").text("Input: " + results[3].input);
  
                    var matchline = '';
                    errByTypeLines[3].forEach(function (value) {
                      matchline += 'L' + value + ' ';
                    })
                    $("#time_matchline").text("Matched lines: " + matchline);
                  } else {
                    $("#category4").fadeOut();
                  }

                  $("#content_analysis").fadeIn();

                  highlightLine(uniqErrLines);
                }
                clearInterval(timer);
              });
            }, 200);
          }
        }
      );
    }
  });

  $("#btn-solidity").click(function() {
    submit_type = sol_type;
    $("#btn-solidity").addClass("active");
    $("#btn-bytecode").removeClass("active");
    $("#btn-sample1").removeClass("active");

    window.cm.setValue(
      "contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    function withdraw() {\n      msg.sender.call.value(balances[msg.sender])();\n   }\n\n}"
    );
  });

  $("#btn-sample1").click(function() {
    submit_type = sol1_type;
    $("#btn-bytecode").removeClass("active");
    $("#btn-solidity").removeClass("active");
    $("#btn-sample1").addClass("active");

    window.cm.setValue(
      "contract EtherBank4 {\n  mapping(address => uint) balances;\n  bool locked;\n  function deposit() public payable {\n    balances[msg.sender] += msg.value;\n  }\n  function withdraw(uint amount) public {\n    lock();\n    if (balances[msg.sender] >= amount) {\n      if (!msg.sender.call.value(amount)()) revert();\n      balances[msg.sender] -= amount;\n    }\n    unlock();\n  }\n  function lock() {\n    if (!locked)\n      locked = true;\n    else\n    revert();\n    }\n    function unlock() {\n      locked = false;\n    }\n}"
    );
  });
})();
