/**
 *
 * Kijelz�, saj�t mem�ri�val
 *
 * @author Edem
 * @version 1.0
 */
 
SCR = {

  width: 80,
	height: 20,
	first: 0x06,
	cursorChar: 0x20,
	cursorRow:0,
	flash:0,
	
	/* kijelz� t�rtl�se */
	screenInit: function(){
	  for (var i=0; i < (SCR.width*SCR.height); i++){
		  MEM.Wrt8B((SCR.first+i),0x20);
		}
		MEM.Wrt16W(0x04,SCR.first);  
	},
	
	/* kurzor hely�re karakter ment�se */
	print: function(charr){
	  var cursor = SCR.getCursorPos();
	  MEM.Wrt8B(SCR.getCursorPos(),charr.charCodeAt(0));
		
		if ( charr=="\n"){
		  cursor += SCR.width-((cursor-SCR.first)%SCR.width);
		}else{
		  cursor++;
		}
		
		if((SCR.cursorRow==0 && cursor>=SCR.first+(SCR.width*SCR.height)) ||
		   (SCR.cursorRow>0 && cursor>=SCR.first+(SCR.cursorRow*SCR.width))){
		  for(var i=0; i<SCR.width; i++) MEM.Wrt8B(SCR.first+i+(SCR.width*SCR.cursorRow),0x20);
			SCR.cursorRow++;
		}
		if (SCR.cursorRow >= SCR.height) SCR.cursorRor-=SCR.height;
		
		if (cursor >= (SCR.width*SCR.height)+SCR.first) cursor-=(SCR.width*SCR.height);
		MEM.Wrt16W(0x04,cursor);
	},
	
	/* kurzor poz�ci�ja */
	getCursorPos: function(){
	  return MEM.Read16W(4);
	},
	
	/* kurzor poz�ci�j�nak m�dos�t�sa */
	setCursorPos: function(pos){
	  MEM.Wrt16W(4,pos);
	},
	
	/* kijelz� megjelen�t�se */
	showScreen: function(){
		
		/* body innerHeight */
		var innerHeight;
		if( typeof( window.innerWidth ) == 'number' ) {
      innerHeight = window.innerHeight;
    }else if( document.documentElement && document.documentElement.clientHeight ) {
      innerHeight = document.documentElement.clientHeight;
    }else if( document.body && document.body.clientHeight) {
      innerHeight = document.body.clientHeight;
    }
		
		/* body scrollTop */
		var scrollTop=0;
    if( typeof( window.pageYOffset ) == 'number' ) {
      scrollTop = window.pageYOffset;
    }else if(document.body && document.body.scrollTop) {
      scrollTop = document.body.scrollTop;
    }else if(document.documentElement && document.documentElement.scrollTop){
      scrollTop = document.documentElement.scrollTop;
    }
		
		if (innerHeight > 370){
		  innerHeight -= 370;
			innerHeight /= 2;
			scrollTop += innerHeight;
		}
		
		if (COM.LOG_ON){
		  document.getElementById("log").style.height = 360+"px";
			document.getElementById("log").style.visibility = "visible";
		}
		
		document.getElementById("pop-up").style.top = scrollTop+"px";
		document.getElementById("pop-up_keret").style.height = Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    )+"px";
		
		document.getElementById("pop-up_keret").style.visibility = "visible";
		SCR.flash = window.setInterval("SCR.cursorFlash()", 500); 
	},
	
	/* kijelz� elrejt�se */
	hideScreen: function(){
	  document.getElementById("pop-up_keret").style.visibility = "hidden";
		document.getElementById("log").style.height = 0+"px";
		document.getElementById("pop-up_keret").style.height = 0+"px";
		document.getElementById("log").style.visibility = "hidden";
		SCR.flash = window.clearInterval(SCR.flash);
	},
	
	/* kurzor villogtat�sa */
	cursorFlash: function(){
	  if (MEM.Read8B(SCR.getCursorPos()) == ("_".charCodeAt(0))){
		  MEM.Wrt8B(SCR.getCursorPos(),SCR.cursorChar);
		}else{
		  SCR.cursorChar = MEM.Read8B(SCR.getCursorPos());
		  MEM.Wrt8B(SCR.getCursorPos(),"_".charCodeAt(0));
		}
		SCR.refresh();
	},
	
	/* kijelz� friss�t�se */
	refresh: function(){
	
		var ki="";
		var ertek;
		 
	  for(var i=0; i<SCR.width*SCR.height; i++){
		  var honnan = i+(SCR.cursorRow*SCR.width);
			if (honnan >= SCR.height*SCR.width) honnan-= SCR.height*SCR.width;
		  ertek = MEM.Read8B(SCR.first+honnan);
			if ( ertek == 32 ){
				ki+='&nbsp;';
			}else{
				ki+=String.fromCharCode(ertek);
			}
			if (((i+1)%SCR.width==0) && i+1<SCR.width*SCR.height){
			  ki += '<br>';
			}
		}
		document.getElementById('screen').innerHTML = ki;
	}

};