var normalize = (s) => {  
    let x = String(s) || '';
    return x.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
  };
  
  var check = (s) => {
    
    if (s.length < 26 || s.length > 35) {
      return false;
    }
    
    let re = /^[A-Z0-9]+$/i;
    if (!re.test(s)) {
      return false;
    }
    
    return true;
  };
  
  
  var getEl = (id) => {
    return document.getElementById(id) || null; 
  };
  
  var elMessage = getEl('elMessage');
  var inpAddress = getEl('inpAddress');
  var btnValidate = getEl('btnValidate');
  var lnkClear = getEl('lnkClear');
  
  var setMessage = (txt = '', clss = 'msg') => {
    elMessage.className = clss;
    elMessage.innerHTML = txt;
  };
  
  
  var validate = (s) => {
  
    let className = 'msg fail';
    let textMessage = 'Invalid bitcoin address';
    
    if (!s) {
      textMessage = 'Please enter a valid address';
    }
    
    let re = check(s);
    if (re) {
      className = 'msg pass';
      textMessage = 'Bitcoin address is valid';
    }
    
    setMessage(textMessage, className);
    
    return re;
  };
  