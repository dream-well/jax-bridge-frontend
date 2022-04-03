var normalize = (s) => {  
    let x = String(s) || '';
    return x.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
  };
  
  var validate = (s) => {
    
    if (s.length < 26 || s.length > 35) {
      return false;
    }
    
    let re = /^[A-Z0-9]+$/i;
    if (!re.test(s)) {
      return false;
    }
    
    return true;
  };
  
  