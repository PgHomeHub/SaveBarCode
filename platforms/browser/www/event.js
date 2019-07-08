


$(document).ready(function(){


    $('#md_Brch').modal({backdrop: 'static', keyboard: false})  
    $('#md_Brch').modal();

    var BrchID = "";
    var BrchName = "";
    var inpGoods = "";

    $('#inpGoods').focus();
    $('#btnFindSpinner').hide();

    $('#frm_Goods').hide();

    $("select").change(function(){

        var select = $('#seDept').val();
        //alert(select);

        if(select == "" || select == null || select == 0){

            $('#frm_Goods').hide();


        }else{

            $('#frm_Goods').show();
            $('#inpGoods').focus();

        }
        //select = null;
        //alert(select);

    });



    $("#ChangeBrch").click(function(){

        $('#md_Brch').modal();
        $('#frm_Goods').hide();

        $('#navbarResponsive').collapse('hide');
        CheckDept();


    });




    $("#btnFind").click(function(e) {

        e.preventDefault();

        inpGoods = $("#inpGoods").val();
        //alert(inpGoods);
        FindGood(inpGoods);


    });

    

    $("#modalCheckGood").on('shown.bs.modal', function(){

        $(this).find('input[type="text"]').select();

    });

    function FindGood(inpGoods) {

        $('#btnFindSpinner').show();
        //$("#btnConfirm").prop('disabled', true);

        $.ajax({
            type: "post",
            data: "inpGoods=" + inpGoods,
            url: "http://192.168.100.12/SaveBarCode/query_checkGood.php",
            success: function(msg) {
                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูลรหัสสินค้า <code>' + inpGoods + '</code>',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: function () {

                                /* ห้ามเปิดส่วนนี้ คำสั่งจะซ้ำกับ Complete Function*/

                            }
                        }
                    });


                } else {

                    var msg = msg.trim();
                    $('#bodyCheckGood').html(msg);
                    $('#modalCheckGood').modal('show');


                }
            },
            complete: function() {

                $('#btnConfirmSpinner').hide();
                //$("#btnConfirm").prop('disabled', false);
                //$("#inpGoods").select();
                //$("#modal_Count").select();

            }
        });

    }







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