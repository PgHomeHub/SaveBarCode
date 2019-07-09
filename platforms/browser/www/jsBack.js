

$("#btnFind").click(function(){

    PODocNo = $("#inpPO").val();

    if(PODocNo == ""){

        $("#inpPO").focus()

    }else{

        FindPO();

    }

});



CheckIP();
function CheckIP() {

    $.ajax({
        type: 'POST',
        url:"http://192.168.100.12/CheckPO/query_CheckIP.php",
        success: function(data){
            console.log(data);
            $('#CheckIP').html(data);

        },
        error: function(e){
            console.log(data);
            $('#CheckIP').html(e.message);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

            console.log(XMLHttpRequest.responseText +" "+textStatus+" "+errorThrown);
            $('#CheckIP').html(XMLHttpRequest.responseText +" "+textStatus+" "+errorThrown);
        }
    });
}



function FindPO() {

    $('#btnFindSpinner').show();
    $("#btnFind").prop('disabled', true);

    $.ajax({
        type: "post",
        data: "PODocNo=" + PODocNo,
        url: "http://192.168.100.12/CheckPO/query_checkPO.php",
        success: function(msg) {

            var data = msg.trim();
            var arr = data.split('++--');


            if (msg.trim() == "") {

                $('#table_data').html("")
                $.confirm({
                    title: '<strong style="color: red;">แจ้งเตือน</strong>',
                    content: 'ไม่พบเลขที่เอกสาร <strong style="color: red;">' + PODocNo + '</strong>',
                    type: 'red',
                    buttons: {
                        ยืนยัน: function() {
                            $("#inpPO").val("");
                            $("#inpPO").focus();
                        }
                    }
                });
                $("#inpPO").select();
                $('#btnCheck').hide();

            } else if (msg.trim() == "NotCheck") {

                $.confirm({
                    title: '<strong style="color: #004085;">สถานะ</strong>',
                    content: '<strong style="color: #004085;">' + PODocNo + '</strong> สถานะ <strong style="color: red;">FULL </strong> หรือ <strong style="color: red;">Cancel </strong> แล้ว ไม่สามารถตรวจสอบได้',
                    type: 'blue',
                    buttons: {
                        ยืนยัน: function() {
                            $("#inpPO").val("");
                            $("#inpPO").focus();
                        }
                    }
                });

            } else if (msg.trim() == "NotAppv") {

                $.confirm({
                    title: '<strong style="color: #004085;">สถานะ</strong>',
                    content: '<strong style="color: #004085;">' + PODocNo + '</strong> ยังไม่ได้อนุมัติ PO',
                    type: 'blue',
                    buttons: {
                        ยืนยัน: function() {
                            $("#inpPO").val("");
                            $("#inpPO").focus();
                        }
                    }
                });


            } else if (arr[0] == "PODup") {

                $.confirm({
                    title: '<strong style="color: #004085;">สถานะ</strong>',
                    content: '<strong style="color: #004085;">' + PODocNo + '</strong> ทำการบันทึกไปแล้ว ต้องการบันทึกซ้ำหรือไม่ ?',
                    type: 'blue',
                    buttons: {
                        ยืนยัน: function() {

                            $('#table_data').html(arr[1]);

                            var row_tablePO = $('#table_data tr').length;
                            $('#btnCheck').html("ดำเนินการ เช็คสินค้า (" + row_tablePO + ")");
                            $('#btnCheck').show();
                            $('#btnCancelPO').show();


                        },
                        ยกเลิก: function() {

                            $("#inpPO").val("");
                            $("#inpPO").focus();


                        }

                    }
                });


            } else {

                var msg = msg.trim();
                $('#table_data').html(msg);

                var row_tablePO = $('#table_data tr').length;
                $('#btnCheck').html("ดำเนินการ เช็คสินค้า (" + row_tablePO + ")");
                $('#btnCheck').show();
                $('#btnCancelPO').show();

            }
        },
        complete: function() {

            $('#btnFindSpinner').hide();
            $("#btnFind").prop('disabled', false);

        }
    });
}



$("#btnCheck").click(function(){

    $('#header_frmgood').html(PODocNo);
    $('#frm_PO').hide();
    $('#tablePO').hide();
    $('#btnCheck').hide();
    $('#btnCancelPO').hide();
    $('#inpPO').prop('disabled', true);
    $('#btnFind').prop('disabled', true);
    $('#frm_Good').show();
    $('#inpStock').prop('disabled', true);
    $('#btnSaveStock').prop('disabled', true);
    $('#inpGoodCode').select();

});



$("#btnFindGood").click(function(e) {

    e.preventDefault();
    var inpGoodCode = $("#inpGoodCode").val();
        //FindGood(inpGoodCode);



        var myarray = [];
        /* ดึงรหัสสินค้าที่ยิงไปแล้ว เข้า Array*/
        $('.td_GoodCode').each(function(){

            myarray.push($(this).text().trim());

        });

        /* Check ว่ารหัสสแกนไปแล้วหรือยัง */
        if(jQuery.inArray(inpGoodCode, myarray) !== -1){

            $.confirm({
                title: '<strong style="color: red;">สินค้าซ้ำ</strong>',
                content: 'รหัสสินค้า <code>' + inpGoodCode + '</code> ถูกสแกนแล้ว ต้องการสแกนซ้ำหรือไม่',
                type: 'red',
                buttons: {
                    ยืนยัน: function () {

                        FindGood(inpGoodCode);

                    }
                    ,ยกเลิก: function () {


                        $('#inpGoodCode').select();

                    }
                }
            });

        }else{

            FindGood(inpGoodCode);

        }


    });


function CheckGoodDup(Goodcode) {


    $('.td_GoodCode').each(function(){
            //alert($(this).text().trim());
            if($(this).text().trim() == Goodcode){

                alert("True")
                return true;

            }else{

                alert("False")
                return false;

            }
        });

}





$("#modalCheckGood").on('shown.bs.modal', function(){

    $(this).find('input[type="text"]').select();

});

function FindGood(inpGoodCode) {


    $('#btnFindGood_Spinner').show();
    $("#btnConfirm").prop('disabled', true);

    $.ajax({
        type: "post",
        data: "inpGoodCode=" + inpGoodCode + "&PODocNo=" + PODocNo,
        url: "http://192.168.100.12/CheckPO/query_checkGood.php",
        success: function(msg) {
            if (msg.trim() == "") {

                $.confirm({
                    title: '<strong style="color: orange;">แจ้งเตือน</strong>',
                    content: 'ไม่พบข้อมูล <code>' + inpGoodCode + '</code> อาจรับไปแล้ว หรือไม่ได้อยู่ใน <code>' + PODocNo + '</code>',
                    type: 'orange',
                    buttons: {
                        ยืนยัน: function () {

                                //alert("Not Data")
                                //$("#inpGoodCode").focus();
                                //$("#inpGoodCode").select();

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

            $('#btnFindGood_Spinner').hide();
            $("#btnConfirm").prop('disabled', false);
            $("#inpGoodCode").select();
                //$("#modal_Count").select();

            }
        });

}






var touchtime = 0;
$("#table_data_Good").on("click", "tr", function() {

    if (touchtime == 0) {

        touchtime = new Date().getTime();

    } else {
        if (((new Date().getTime()) - touchtime) < 300) {

            var getGood = $(this).find(".td_GoodCode").html();
            var rowDel = $(this).attr('id');

            $.confirm({
                title: '<strong style="color: red;">ลบรายการ</strong>',
                content: 'คุณต้องการลบ <code>'+getGood+'</code> ออกจากรายการหรือไม่ ?',
                type: 'red',
                buttons: {
                    ยืนยัน: function () {

                        $('#'+rowDel).remove();

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



var Count = 0;
$("#btnConfirm").click(function(){

    $('#modalCheckGood').modal('hide');
    $('#inpGoodCode').val("");
    $('#inpGoodCode').select();
    var NameCode = $('#modal_GoodName').html();
    Count = Count + 1;

    Data_tableGood += "<tr id = 'row"+Count+"'>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_GoodCode'>" + $('#modal_GoodCode').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_GoodName' Value = '"+NameCode+"'>" + NameCode.substring(0,4) + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Inv'>" + $('#modal_Inv').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Loca'>" + $('#modal_Loca').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Unit'>" + $('#modal_Unit').html() + "</td>"
    Data_tableGood += "<td style='padding: .40rem;' class = 'td_Count' align='right'>" + $('#modal_Count').val() + "</td>"
    Data_tableGood += "</tr>"

    $('#table_data_Good').append(Data_tableGood);
    Data_tableGood = null;



});

function setData_Insert() {

    var item_GoodCode = [];
    var item_GoodName = [];
    var item_Goodunit = [];
    var item_Inv = [];
    var item_Loca = [];
    var item_Qty = [];

    var BrchID = $("#Detail").attr("BrchID").trim()
    var VendorCode = $("#Detail").attr("VendorCode").trim()
    var VendorName = $("#Detail").attr("VendorName").trim()
    var POID = $("#Detail").attr("POID").trim()




    $('.td_GoodCode').each(function(){
        item_GoodCode.push($(this).text().trim());
    });
    $('.td_GoodName').each(function(){
        item_GoodName.push($(this).attr("Value").trim());
    });
    $('.td_Unit').each(function(){
        item_Goodunit.push($(this).text().trim());
    });
    $('.td_Inv').each(function(){
        item_Inv.push($(this).text().trim());
    });
    $('.td_Loca').each(function(){
        item_Loca.push($(this).text().trim());
    });
    $('.td_Count').each(function(){
        item_Qty.push($(this).text().trim());
    });



    $.ajax({

        url: 'http://192.168.100.12/CheckPO/query_insert.php',
        type: 'post',
        data: {item_GoodCode: item_GoodCode ,item_GoodName: item_GoodName ,item_Goodunit: item_Goodunit 
            ,item_Inv: item_Inv ,item_Loca: item_Loca ,item_Qty: item_Qty
            ,PODocNo: PODocNo,BrchID: BrchID,VendorCode: VendorCode,VendorName: VendorName,POID: POID},

            success:function(data){

                if(data.trim() == "Insert Successfully"){

                    $.confirm({
                        title: '<strong style="color: green;">สำเร็จ</strong>',
                        content: 'บันทึกข้อมูล สำเร็จ',
                        type: 'green',
                        buttons: {
                            ยืนยัน: function () {

                                window.location = "index.html";

                            }
                        }
                    });


                }else{

                    alert(data.trim());

                }              

            }

        });

}



$("#btnClose").click(function(){

    $("#inpGoodCode").select();

});


$("#btnSave").click(function(e){

    e.preventDefault();
    var DataGood = $('#table_data_Good').html();


    if(DataGood.trim() == ""){

        $.confirm({
            title: '<strong style="color: orange;">ไม่พบข้อมูล</strong>',
            content: 'ข้อมูลเป็นค่าว่าง ไม่สามารถบันทึกบิลได้',
            type: 'orange',
            buttons: {
                ยืนยัน: function () {

                }
            }
        });


    }else{


        $.confirm({
            title: '<strong style="color: green;">บันทึกข้อมูล</strong>',
            content: 'คุณต้องการบันทึก บิลใช่หรือไม่',
            type: 'green',
            buttons: {
                ยืนยัน: function () {
                    setData_Insert();

                },
                ยกเลิก: function () {

                }
            }
        });

    }


});



$("#btnCancel").click(function(){

    $.confirm({
        title: '<strong style="color: red;">ยกเลิก</strong>',
        content: 'คุณต้องการ ยกเลิก เอกสารนี้หรือไม่',
        type: 'red',
        buttons: {
            ยืนยัน: function () {
                window.location = "index.html";

            },
            ยกเลิก: function () {

            }
        }
    });

});



$("#btnCancelPO").click(function(){

    $.confirm({
        title: '<strong style="color: red;">ยกเลิก</strong>',
        content: 'คุณต้องการ ยกเลิก เอกสารนี้หรือไม่',
        type: 'red',
        buttons: {
            ยืนยัน: function () {
                window.location = "index.html";

            },
            ยกเลิก: function () {

            }
        }
    });

});


$("#btnCancelGood").click(function(){

    $("#inpGoodCode").select();

});

