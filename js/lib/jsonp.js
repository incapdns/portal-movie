var $jsonp = (function(){
  let item = {}

  item.send = function(src, options) {
    let cbName = options.callbackName;
	  let callback = options.callback;
	  if(!cbName || !callback) return;

    cbName = 'imdb$' + cbName;
	  
	  let script = document.createElement('script')
	  
    window[cbName] = function(data){
      callback(data)
	  
	    script.remove()
    }

    script.type = 'text/javascript'
    script.async = true
    script.src = src

    document.head.appendChild(script)
  }

  return item
})();
