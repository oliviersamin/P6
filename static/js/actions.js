
function play() {
console.log('fonction play OK');
}

function left_arrow() {
console.log('fonction left_arrow OK');
}

function right_arrow() {
console.log('fonction right_arrow OK');
}


function showModalPopUp()
{
popUpObj=window.open("PopUp.htm", "ModalPopUp", "toolbar=no," + "scrollbars=no," + "location=no," +
"statusbar=no," + "menubar=no," + "resizable=0," + "width=500," + "height=500," + "left = 490," +
"top=300");
popUpObj.focus();
}

function modalWindow()
{
    var $dialog = document.getElementById('mydialog');
    if(!('show' in $dialog))
    {
        document.getElementById('promptCompat').className = 'no_dialog';
    }
    $dialog.addEventListener('close', function() {
        console.log('Fermeture. ', this.returnValue);
    });
}