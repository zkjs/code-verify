function updateAnasy(e){}var base_url="http://139.199.172.96:5000",request_sol=base_url+"/sol",request_bytecode=base_url+"/byte",submit_type=0,sol_type=0,byte_type=1,sol1_type=2,sol2_type=3;$("#analysis_start").click(function(){var e=window.cm.getValue();console.log("byte_value",byte_value,typeof byte_value),$("#content_analysis").fadeOut(),$("#loading_main").show(),submit_type===sol_type?$.post(request_sol,{code:e},function(e,t){console.log("data",e),console.log("textStatus",t),$("#loading_main").hide(),e.result.callstack?($("#pattern_result_arrows").addClass("matched"),$("#call_stack_label").text("Call Stack error")):($("#pattern_result_arrows").addClass("safe"),$("#call_stack_label").text("Call Stack pass")),e.result.concurrency?($("#pattern_result_bug").addClass("matched"),$("#concurrency_label").text("Concurrency error")):($("#pattern_result_bug").addClass("safe"),$("#concurrency_label").text("Concurrency pass")),e.result.reentrancy?($("#pattern_result_filter").addClass("matched"),$("#reentrancy_label").text("Re-entrancy error")):($("#pattern_result_filter").addClass("safe"),$("#reentrancy_label").text("Re-entrancy pass")),e.result.time_dependency?($("#pattern_result_refresh").addClass("matched"),$("#time_dependency_label").text("Time Dependency error")):($("#pattern_result_refresh").addClass("safe"),$("#time_dependency_label").text("Time Dependency pass")),$("#content_analysis").fadeIn();var a=new Array;a.push(2),a.push(3),a.push(4),highlightLine(a)}):$.post(request_bytecode,{code:byte_value},function(e,t){console.log("data",e),console.log("textStatus",t),$("#loading_main").hide(),e.result.callstack?($("#pattern_result_arrows").addClass("matched"),$("#call_stack_label").text("Call Stack error")):($("#pattern_result_arrows").addClass("safe"),$("#call_stack_label").text("Call Stack pass")),e.result.concurrency?($("#pattern_result_bug").addClass("matched"),$("#concurrency_label").text("Concurrency error")):($("#pattern_result_bug").addClass("safe"),$("#concurrency_label").text("Concurrency pass")),e.result.reentrancy?($("#pattern_result_filter").addClass("matched"),$("#reentrancy_label").text("Re-entrancy error")):($("#pattern_result_filter").addClass("safe"),$("#reentrancy_label").text("Re-entrancy pass")),e.result.time_dependency?($("#pattern_result_refresh").addClass("matched"),$("#time_dependency_label").text("Time Dependency error")):($("#pattern_result_refresh").addClass("safe"),$("#time_dependency_label").text("Time Dependency pass")),$("#content_analysis").fadeIn()})}),$("#btn-solidity").click(function(){submit_type=sol_type,$("#btn-solidity").addClass("active"),$("#btn-bytecode").removeClass("active"),$("#btn-sample1").removeClass("active"),$("#btn-sample2").removeClass("active"),window.cm.setValue("contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    function withdraw() {\n      msg.sender.call.value(balances[msg.sender])();\n   }\n\n}")}),$("#btn-bytecode").click(function(){submit_type=byte_type,$("#btn-bytecode").addClass("active"),$("#btn-solidity").removeClass("active"),$("#btn-sample1").removeClass("active"),$("#btn-sample2").removeClass("active"),window.cm.setValue("contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    function withdraw() {\n      }\n\n}")}),$("#btn-sample1").click(function(){submit_type=sol1_type,$("#btn-bytecode").removeClass("active"),$("#btn-solidity").removeClass("active"),$("#btn-sample1").addClass("active"),$("#btn-sample2").removeClass("active"),window.cm.setValue("contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n      balances[msg.sender] += amount;\n  }\n\n    }\n\n}")}),$("#btn-sample2").click(function(){submit_type=sol2_type,$("#btn-bytecode").removeClass("active"),$("#btn-solidity").removeClass("active"),$("#btn-sample1").removeClass("active"),$("#btn-sample2").addClass("active"),window.cm.setValue("contract SimpleBank { \n    mapping(address => uint) balances;\n    function deposit(uint amount) {\n     }\n\n}")});