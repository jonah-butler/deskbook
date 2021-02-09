function formReturnDisabled(event){
  if(event.target.tagName.toLowerCase() == 'textarea'){
    return;
  }
  if(event.which === 13){
    event.preventDefault();
  }
}

function printPageElement(){
  // const printContents = ele.innerHTML;
  // const originalContents = document.body.innerHTML;
  //
  // document.body.innerHTML = ele.innerHTML;
  //
  // window.print();
  //
  // document.body.innerHTML = originalContents;
  // ele.contentWindow.window.print();
  console.log('yo');
}
