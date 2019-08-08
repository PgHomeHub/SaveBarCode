

$(document).ready(function(){


    $('#md_Brch').modal({backdrop: 'static', keyboard: false})  
    $('#md_Brch').modal();

    var BrchID = "";
    var BrchName = "";
    var inpGoods = "";
    var seDept = "";

    $('#inpGoods').focus();
    $('#btnFindSpinner').hide();
    $('#btnConfirmSpinner').hide();
    $('#frm_Goods').hide();


    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var year = d.getFullYear()+543;
    var DateNOW = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;

    var DateNOWShow = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + year;

    //alert(DateNOWShow)






    $("select").change(function(){

        seDept = $('#seDept').val();
        //alert(seDept);

        if(seDept == "" || seDept == null || seDept == 0){

            $('#frm_Goods').hide();


        }else{

            $('#inpGoods').val("");
            //alert(BrchID+" - "+seDept)
            $('#frm_Goods').show();
            $('#inpGoods').focus();
            RefreshList(BrchID,seDept,DateNOW);


        }

    });



    $("#ChangeBrch").click(function(){

        $('#md_Brch').modal();
        $('#frm_Goods').hide();

        $('#navbarResponsive').collapse('hide');
        CheckDept(BrchID);



    });

    $("#btnClearAll").click(function(){

        //alert(BrchID+"--"+seDept+"--"+DateNOW+"--"+"All")

        $.confirm({
            title: '<strong style="color: #e74c3c;">แจ้งเตือน</strong>',
            content: 'คุณต้องการลบรายการทั้งหมด ของแผนก : <strong style="color: #e74c3c;">'+seDept+'</strong> ใช่หรือไม่',
            type: 'red',
            buttons: {
                ยกเลิก: function () {


                    $('#inpGoods').val("");
                    $('#inpGoods').focus();



                },
                ยืนยัน: {
                    btnClass: 'btn-red',
                    action: function(){

                        DeleteList(BrchID,seDept,"",DateNOW,"","All")

                    }
                }
            }
        });


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


    $("#btnCancelGood").click(function() {


        $("#inpGoods").val("");
        $("#inpGoods").select();


    });


    $("#btnConfirm").click(function() {

        var GoodID = $("#modal_GoodCode").attr("value").trim()
        var GoodCode = $("#modal_GoodCode").html();
        var GoodUnit = $("#modal_Unit").html();
        var GoodName = $("#modal_GoodName").text();
        //var Price1 = $("#modal_Price").html();
        var Price1 = $("#modal_Price").attr("value").trim()
        var Count = $("#modal_Count").val();


        if(Count > 10){

            //alert("Max 10")

            $.confirm({
                title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                content: 'ใส่จำนวนพิมพ์ มากกว่า 10 รายการ กรุณาตรวจสอบอีกครั้ง',
                type: 'orange',
                buttons: {
                    ยืนยัน: {
                        btnClass: 'btn-orange',
                        action: function(){

                            $("#modal_Count").select();

                        }
                    }
                }
            });

        }else{

            InsertList(GoodID,GoodCode,GoodUnit,GoodName,Price1,Count);

        }

        //alert(GoodName);

        //alert(GoodID + "-" + modal_GoodCode + "-" + modal_Unit+ "-" + modal_GoodName+ "-" + modal_Price);

    });




    /* ########################################### Start function ############################################ */
    /* ####################################################################################################### */



    function InsertList(GoodID,GoodCode,GoodUnit,GoodName,Price1,Count) {

        //alert(BrchID + "-" + seDept+ "-" + DateNOW)

        $.ajax({
            type: 'POST',
            data: "BrchID=" + BrchID + "&seDept=" + seDept + "&DateNOW=" + DateNOW 
            + "&GoodID=" + GoodID + "&GoodCode=" + GoodCode + "&GoodUnit=" + GoodUnit 
            + "&GoodName=" + GoodName + "&Price1=" + Price1 + "&Count=" + Count,
            url:"http://192.168.100.31:8080/SaveBarCode/query_insert.php",
            success: function(msg){

                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูล สาขา',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-orange',
                                action: function(){

                                }
                            }
                        }
                    });

                } else {

                    var data = msg.trim();
                    //$("#test").html(data)
                    //alert(data)

                    if(data == "Insert Successfully"){


                        $("#inpGoods").val("");                                        
                        RefreshList(BrchID,seDept,DateNOW);                                        
                        $('#modalCheckGood').modal('hide');  

                        /*$.confirm({
                            title: '<strong style="color: green;">สำเร็จ</strong>',
                            content: 'บันทึกรายการ สำเร็จ',
                            type: 'green',
                            buttons: {
                                ยืนยัน: {
                                    btnClass: 'btn-green',
                                    action: function(){

                                        $("#inpGoods").val("");                                        
                                        RefreshList(BrchID,seDept,DateNOW);                                        
                                        $('#modalCheckGood').modal('hide');  

                                    }
                                }
                            }
                            
                        });*/


                    }else{

                        $.confirm({
                            title: '<strong style="color: #e74c3c;">Error </strong>',
                            content: 'บันทึกรายการ ไม่สำเร็จ : '+data,
                            type: 'red',
                            buttons: {
                                ยืนยัน: {
                                    btnClass: 'btn-red',
                                    action: function(){

                                        //RefreshList(BrchID,seDept,DateNOW);

                                    }
                                }
                            }
                            
                        });

                    }


                }

            },
            complete: function() {




            }
        });

    }


    function CheckbtnClearAll() {


        var rowCount = $('#table_data tr').length;
        //alert(rowCount);

        if(rowCount > 0){

            $("#btnClearAll").show();

        }else{

            $("#btnClearAll").hide();

        }




    }


    function RefreshList(BrchID,seDept,DateNOW) {


        $.ajax({
            type: "post",
            data: "BrchID=" + BrchID + "&seDept=" + seDept+ "&DateNOW=" + DateNOW,
            url: "http://192.168.100.31:8080/SaveBarCode/query_checkList.php",
            success: function(msg) {
                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: #e74c3c;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูลรหัสสินค้า <strong style="color: #e74c3c;">' + inpGoods + '</strong>',
                        type: 'red',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-red',
                                action: function(){

                                    /* ห้ามเปิดส่วนนี้ คำสั่งจะซ้ำกับ Complete Function*/

                                }
                            }
                        }
                    });


                } else {

                    var msg = msg.trim();
                    $('#table_data').html(msg);
                    $("#inpGoods").select();
                    CheckbtnClearAll();

                    //$('#modalCheckGood').modal('show');


                }
            },
            complete: function() {


            }
        });

    }



    function FindGood(inpGoods) {

        //$("#btnConfirm").prop('disabled', true);


        $('#btnFindSpinner').show();

        $.ajax({
            type: "post",
            data: "inpGoods=" + inpGoods + "&BrchID=" + BrchID,
            url: "http://192.168.100.31:8080/SaveBarCode/query_checkGood.php",
            success: function(msg) {
                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: #e74c3c;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูลรหัสสินค้า <strong style="color: #e74c3c;">' + inpGoods + '</strong>',
                        type: 'red',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-red',
                                action: function(){

                                    /* ห้ามเปิดส่วนนี้ คำสั่งจะซ้ำกับ Complete Function*/

                                }
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


                $('#inpGoods').select();
                $('#btnFindSpinner').hide();
                //alert("Working")
                //$('#inpGoods').select();


            }
        });



    }


    function CheckBrch() {

        $.ajax({
            type: 'POST',
            url:"http://192.168.100.31:8080/SaveBarCode/query_checkBrch.php",
            success: function(msg){

                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูล สาขา',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-orange',
                                action: function(){

                                }
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

        $('#seDept').prop('disabled', true);
        $.ajax({
            type: 'POST',
            data: "BrchID=" + BrchID,
            url:"http://192.168.100.31:8080/SaveBarCode/query_checkDept.php",
            success: function(msg){

                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูล สาขา',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-orange',
                                action: function(){

                                }
                            }
                        }
                    });


                } else {

                    var data = msg.trim();
                    $('#seDept').html(data);


                }

            },
            complete: function() {
                $('#seDept').prop('disabled', false);


            }
        });

    }




    function DeleteList(BrchID,seDept,BarCode,DateNOW,IDList,TypeDelete) {

        //alert(BrchID + "-" + seDept+ "-" + BarCode+ "-" + DateNOW)
        $.ajax({
            type: 'POST',
            data: "BrchID=" + BrchID + "&seDept=" + seDept + "&BarCode=" + BarCode + "&DateNOW=" + DateNOW + "&IDList=" + IDList + "&TypeDelete=" + TypeDelete,
            url:"http://192.168.100.31:8080/SaveBarCode/query_DeleteList.php",
            success: function(msg){

                if (msg.trim() == "") {

                    $.confirm({
                        title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                        content: 'ไม่พบข้อมูล สาขา',
                        type: 'orange',
                        buttons: {
                            ยืนยัน: {
                                btnClass: 'btn-orange',
                                action: function(){

                                }
                            }
                        }
                    });


                } else {

                    var data = msg.trim();
                    //$("#test").html(data)
                    //alert(data)

                    if(data == "Record delete successfully"){

                        RefreshList(BrchID,seDept,DateNOW);

                        /*$.confirm({
                            title: '<strong style="color: green;">ลบสำเร็จ</strong>',
                            content: 'ลบรายการสินค้า สำเร็จ',
                            type: 'green',
                            buttons: {
                                ยืนยัน: {
                                    btnClass: 'btn-green',
                                    action: function(){


                                    }
                                }
                            }
                        });*/


                    }else{


                        $.confirm({
                            title: '<strong style="color: #e74c3c;">Error </strong>',
                            content: 'ลบรายการสินค้า ไม่สำเร็จ : '+data,
                            type: 'red',
                            buttons: {
                                ยืนยัน: {
                                    btnClass: 'btn-red',
                                    action: function(){

                                    }
                                }
                            }
                        });

                    }


                }

            },
            complete: function() {


            }
        });

    }



    /* ########################################### End function ############################################ */
    /* ##################################################################################################### */



    var touchtimeDel = 0;
    $("#table_data").on("click", "tr", function() {

        if (touchtimeDel == 0) {

            touchtimeDel = new Date().getTime();

        } else {
            if (((new Date().getTime()) - touchtimeDel) < 300) {

                //var getGood = $(this).find(".td_GoodCode").html();
                //var rowDel = $(this).attr('id');
                var BarCode = $(this).find(".td_BarCode").html();
                var IDList = $(this).attr('id');


                //alert(BrchID + "-" + seDept+ "-" + BarCode+ "-" + DateNOW+ "-" + IDList);

                
                $.confirm({
                    title: '<strong style="color: #e74c3c;">ลบรายการ</strong>',
                    //content: 'คุณต้องการลบ ออกจากรายการหรือไม่ ?',
                    content: 'คุณต้องการลบ <strong style="color: #e74c3c;">'+BarCode+'</strong> ออกจากรายการหรือไม่ ?',
                    type: 'red',
                    buttons: {
                        ยกเลิก: function () {

                        },
                        ยืนยัน: {
                            btnClass: 'btn-red',
                            action: function(){

                                DeleteList(BrchID,seDept,BarCode,DateNOW,IDList,"item")

                            }
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

        BrchID = $(this).attr('ID');
        //BrchName = $(this).attr('BrchName');
        BrchName = $(this).html();


        $.confirm({
            title: '<strong style="color: green;">สาขา</strong>',
            content: 'คุณเลือกสาขา <strong style="color: green;">'+BrchName+'</strong>',
            type: 'green',
            buttons: {
                ยกเลิก:  function () {

                },
                ยืนยัน: {
                    btnClass: 'btn-green',
                    action: function(){

                        $('#md_Brch').modal("hide");
                        $('#BrchNameShow').html(BrchName);
                        $('#DateNow').html(DateNOWShow);

                        CheckDept(BrchID);
                    }
                }
                
            }
        });

                /*
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
                        ยกเลิก:  function () {

                        },
                        ยืนยัน: {
                            btnClass: 'btn-green',
                            action: function(){

                                $('#md_Brch').modal("hide");
                                $('#BrchNameShow').html(BrchName);
                                $('#DateNow').html(DateNOWShow);

                                CheckDept(BrchID);
                            }
                        }
                        
                    }
                });

                touchtime = 0;


            } else {

                touchtime = new Date().getTime();

            }
        }*/

    });





















});