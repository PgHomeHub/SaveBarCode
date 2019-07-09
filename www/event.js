

$(document).ready(function(){


    $('#md_Brch').modal({backdrop: 'static', keyboard: false})  
    $('#md_Brch').modal();

    var BrchID = "";
    var BrchName = "";
    var inpGoods = "";

    $('#inpGoods').focus();
    $('#btnFindSpinner').hide();
    $('#btnConfirmSpinner').hide();
    $('#frm_Goods').hide();


    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var DateNOW = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;






    $("select").change(function(){

        var select = $('#seDept').val();
        //alert(select);

        if(select == "" || select == null || select == 0){

            $('#frm_Goods').hide();


        }else{

            //alert(BrchID+" - "+select)
            RefreshList(BrchID,select)
            $('#frm_Goods').show();
            $('#inpGoods').focus();

        }

    });



    $("#ChangeBrch").click(function(){

        $('#md_Brch').modal();
        $('#frm_Goods').hide();

        $('#navbarResponsive').collapse('hide');
        CheckDept(BrchID);


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




    $("#btnConfirm").click(function() {

        var modal_ID = $("#modal_GoodCode").attr("value").trim()
        var modal_GoodCode = $("#modal_GoodCode").html();
        var modal_Unit = $("#modal_Unit").html();
        var modal_GoodName = $("#modal_GoodName").html();
        var modal_Price = $("#modal_Price").html();

        //alert(modal_ID + "-" + modal_GoodCode + "-" + modal_Unit+ "-" + modal_GoodName);


    });



    function RefreshList(BrchID,inpDept) {

        //alert(BrchID+" - "+inpDept);        
        $.ajax({
            type: "post",
            data: "BrchID=" + BrchID + "&inpDept=" + inpDept,
            url: "http://192.168.100.12/SaveBarCode/query_checkList.php",
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
                    $('#table_data').html(msg);
                    //$('#modalCheckGood').modal('show');


                }
            },
            complete: function() {

                //$('#btnFindSpinner').hide();

            }
        });

    }



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

                $('#btnFindSpinner').hide();

            }
        });


    }



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


    function CheckDept(BrchID) {

        //alert(BrchID)
        $.ajax({
            type: 'POST',
            data: "BrchID=" + BrchID,
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




    function DeleteList(BrchID,inpDept,BarCode) {

        //alert(BrchID)
        $.ajax({
            type: 'POST',
            data: "BrchID=" + BrchID,
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


    var touchtimeDel = 0;
    $("#table_data").on("click", "tr", function() {

        if (touchtimeDel == 0) {

            touchtimeDel = new Date().getTime();

        } else {
            if (((new Date().getTime()) - touchtimeDel) < 300) {

                //var getGood = $(this).find(".td_GoodCode").html();
                //var rowDel = $(this).attr('id');
                var getGood = $(this).find(".td_BarCode").html();

                $.confirm({
                    title: '<strong style="color: red;">ลบรายการ</strong>',
                    //content: 'คุณต้องการลบ ออกจากรายการหรือไม่ ?',
                    content: 'คุณต้องการลบ <code>'+getGood+'</code> ออกจากรายการหรือไม่ ?',
                    type: 'red',
                    buttons: {
                        ยืนยัน: function () {

                            //$('#'+rowDel).remove();

                        },
                        ยกเลิก: function () {

                        }
                    }
                });
                touchtimeDel = 0;
            } else {

                touchtimeDel = new Date().getTime();

            }
        }

    });




    var touchtime = 0;
    $("#tb_brch").on("click", "tr", function(){

        if (touchtime == 0) {

            touchtime = new Date().getTime();

        } else {
            if (((new Date().getTime()) - touchtime) < 300) {

                BrchID = $(this).attr('ID');
                //BrchName = $(this).attr('BrchName');
                BrchName = $(this).html();


                $.confirm({
                    title: '<strong style="color: green;">สาขา</strong>',
                    content: 'คุณเลือกสาขา <strong style="color: green;">'+BrchName+'</strong>',
                    type: 'green',
                    buttons: {
                        ยืนยัน: function () {

                            $('#md_Brch').modal("hide");
                            $('#BrchNameShow').html(BrchName);
                            $('#DateNow').html(DateNOW);

                            CheckDept(BrchID);

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