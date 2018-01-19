// var base_url = "http://139.199.172.96:5000";
var base_url = "http://172.168.40.111:5005";

var request_submit = base_url + "/submit";
var request_result = base_url + "/result";

var submit_type = 0;

var bank_type = 0;
var bank4_type = 1;
var wallet_type = 2;

var max_request_time = 10;
var count = 0;

function requestAndUpdate(task) {
  var timer = setInterval(function() {
    $.get(request_result + "?task=" + task, function(data, textStatus) {
      if (textStatus === "success") {
        clearInterval(timer);

        console.log("data", data);
        // 数据返回的样式
        var results = data.results;
        var error = data.error;

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

        $("#stat").html(data.stat);
        if (results[0]) {
          $("#pattern_result_arrows").addClass("matched");
          $("#call_stack_label").text(results[0].description);
          $("#title1").text(results[0].name);

          $("#callStack_input").html(results[0].stat);
          var matchline = "";
          errByTypeLines[0].forEach(function(value) {
            matchline += "L" + value + " ";
          });
          $("#callStack_matchline").text("Matched lines: " + matchline);
        } else {
          $("#category1").fadeOut();
        }

        if (results[1]) {
          $("#pattern_result_bug").addClass("matched");
          $("#concurrency_label").text(results[1].description);
          $("#title2").text(results[1].name);
          $("#concurrency_input").html(results[1].stat);

          var matchline = "";
          errByTypeLines[1].forEach(function(value) {
            matchline += "L" + value + " ";
          });
          $("#concurrency_matchline").text("Matched lines: " + matchline);
        } else {
          $("#category2").fadeOut();
        }

        if (results[2]) {
          $("#pattern_result_filter").addClass("matched");
          $("#reentrancy_label").text(results[2].description);
          $("#title3").text(results[2].name);
          $("#reentrancy_input").html(results[2].stat);

          var matchline = "";
          errByTypeLines[2].forEach(function(value) {
            matchline += "L" + value + " ";
          });
          $("#reentrancy_matchline").text("Matched lines: " + matchline);
        } else {
          $("#category3").fadeOut();
        }

        if (results[3]) {
          $("#pattern_result_refresh").addClass("matched");
          $("#time_dependency_label").text(results[3].description);
          $("#title4").text(results[3].name);
          $("#time_input").html(results[3].stat);

          var matchline = "";
          errByTypeLines[3].forEach(function(value) {
            matchline += "L" + value + " ";
          });
          $("#time_matchline").text("Matched lines: " + matchline);
        } else {
          $("#category4").fadeOut();
        }

        $("#content_analysis").fadeIn();

        highlightLine(uniqErrLines);
      } else {
        count++;
        if (count > max_request_time) {
          clearInterval(timer);
          count = 0;
        }
      }
    });
  }, 1000);

  $(document).ajaxError(function() {
    clearInterval(timer);
  });
}

(function() {
  $("#analysis_start").click(function() {
    var sol_value = window.cm.getValue();

    $("#content_analysis").fadeOut();

    $("#loading_main").show();

    var requestStat = false;

    var isCheck0 = $("#check0").prop("checked");
    var isCheck1 = $("#check1").prop("checked");
    var isCheck2 = $("#check2").prop("checked");

    console.log("check", isCheck0, isCheck1, isCheck2);

    var task = null;
    $.post(
      request_submit,
      {
        type: submit_type,
        reentrancy: isCheck0,
        mislocking: isCheck1,
        multisig: isCheck2,
        code: sol_value
      },
      function(data, textStatus) {
        if (textStatus === "success") {
          requestStat = true;
          task = data.task;

          requestAndUpdate(task);
        }
      }
    );
  });

  $("#btn-solidity").click(function() {
    submit_type = bank_type;
    $("#btn-solidity").addClass("active");
    $("#btn-bank4").removeClass("active");
    $("#btn-wallet").removeClass("active");

    window.cm.setValue(
      "contract EtherBank {\n    mapping(address => uint) balances;\n    function deposit() public payable {\n        balances[msg.sender] += msg.value;\n    }\n\n    function withdraw(uint amount) public {\n        if (balances[msg.sender] >= amount) {\n        msg.sender.call.value(amount)();\n        balances[msg.sender] -= amount;\n        }\n    }\n}"
    );
  });

  $("#btn-bank4").click(function() {
    submit_type = bank4_type;
    $("#btn-solidity").removeClass("active");
    $("#btn-wallet").removeClass("active");
    $("#btn-bank4").addClass("active");

    window.cm.setValue(
      "contract EtherBank4 {\n  mapping(address => uint) balances;\n  bool locked;\n  f" +
        "unction deposit() public payable {\n    balances[msg.sender] += msg.value;\n  }" +
        "\n  function withdraw(uint amount) public {\n    lock();\n    if (balances[msg.s" +
        "ender] >= amount) {\n      if (!msg.sender.call.value(amount)()) revert();\n        " +
        "  balances[msg.sender] -= amount;\n        }\n        unlock();\n  }\n  function lock() " +
        "{\n    if (!locked)\n      locked = true;\n    else\n        revert();\n    }\n    f" +
        "unction unlock() {\n      locked = false;\n    }\n}"
    );
  });

  $("#btn-wallet").click(function() {
    submit_type = wallet_type;
    $("#btn-solidity").removeClass("active");
    $("#btn-bank4").removeClass("active");
    $("#btn-wallet").addClass("active");

    window.cm.setValue(
      "pragma solidity ^0.4.0;\n\ncontract Wallet {\n    address owner;\n\n    function Wallet() payable {}\n\n    function initContract() {\n        owner = msg.sender;\n    }\n\n    function setOwner(address _owner) {\n        if (msg.sender == owner) {\n            owner = _owner;\n        }\n    }\n\n    function transferEther(uint _value) {\n        if(msg.sender == owner) {\n            msg.sender.call.value(_value)();\n        }\n    }\n}\n"
    );
  });
})();
