


$(document).ready(function(){



    $('#md_Brch').modal();

    var BrchID = "";
    var BrchName = "";
    $('#inpGoods').focus();
    $('#btnFindSpinner').hide();



    CheckBrch();
    function CheckBrch() {

        $.ajax({
            type: 'POST',
            url:"http://192.168.100.12/SaveBarCode/query_checkBrch.php",
            success: function(msg){

                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูล สาขา',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: function () {

                            }
                        }
                    });


                } else {

                    var data = msg.trim();
                    $('#tb_brch').html(data);


                }

            },
            complete: function() {


            }
        });


    }


    CheckDept();
    function CheckDept() {

        $.ajax({
            type: 'POST',
            url:"http://192.168.100.12/SaveBarCode/query_checkDept.php",
            success: function(msg){

                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูล สาขา',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: function () {

                            }
                        }
                    });


                } else {

                    var data = msg.trim();
                    $('#seDept').html(data);


                }

            },
            complete: function() {


            }
        });

    }


    $("select").change(function(){

        //alert("select Working");
        $('#inpGoods').focus();

    });


    var touchtime = 0;
    $("#tb_brch").on("click", "tr", function() {

        if (touchtime == 0) {

            touchtime = new Date().getTime();

        } else {
            if (((new Date().getTime()) - touchtime) < 300) {

                BrchID = $(this).attr('ID');
                BrchName = $(this).attr('BrchName');


                $.confirm({
                    title: '<strong style="color: green;">สาขา</strong>',
                    content: 'คุณเลือกสาขา <strong style="color: green;">'+BrchName+'</strong>',
                    type: 'green',
                    buttons: {
                        ยืนยัน: function () {

                            $('#md_Brch').modal("hide");
                            $('#BrchNameShow').html(BrchName);

                        },
                        ยกเลิก: function () {

                        }
                    }
                });

                touchtime = 0;


            } else {

                touchtime = new Date().getTime();

            }
        }

    });





















});