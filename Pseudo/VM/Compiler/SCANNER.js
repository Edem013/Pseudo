/*
 * Szkenner (Scanner)
 *
 * @author Edem
 * @version 1.0
 */

SCANNER = {
  
	padding: -1,
	inputtext: "",
	
	/* Felhasználó által megadott kód szkennelése, tokenekre bontása */
	scan: function(){
	  SCANNER.inputtext = document.getElementById("codeCode").value;
		if (!COM.CASE_SENS) SCANNER.inputtext = SCANNER.inputtext.toLowerCase();
		
		COM.tokens = [];
		COM.tokenCount = 0;

	  if (SCANNER.inputtext.length == 0){
		  /* Nincs kód */
			throw("A beviteli mezõ üres!");
		}else{
			var aktpadding=0;
		  var i = 0;
		  var row = 1;
			var col = 0;
			SCANNER.padding = -1;
			
		  /* kód karakterenkénti vizsgálata */
			while (SCANNER.inputtext.charAt(i) != ""){

				/* sorok számlálása hibajelzéshez */
				if (SCANNER.inputtext.charAt(i)=="\n"){ row++; col = i;}
					
				/* sorok elejének viszgálata, ha van behúzás */
				if (COM.PADDING){
					if (((i>0) && (SCANNER.inputtext.charAt(i-1)=="\n")) || (i==0)){
						aktpadding = 0;
						while( (SCANNER.inputtext.charAt(i) != "") && (SCANNER.isWhiteChar(SCANNER.inputtext.charAt(i))) && (SCANNER.inputtext.charAt(i) != "\n") ){
				      aktpadding++;
							i++;
						}
						/* üres sorok kihagyása a vizsgálatból */
						if (SCANNER.inputtext.charAt(i) == "\n" || SCANNER.inputtext.charAt(i)==""){
							aktpadding=0;
							row++;
							col=i;
						}else{
				      if(aktpadding%2 == 1 ){
							  throw("Érvénytelen behúzás! "+row+". sor, "+(i-col)+". oszlop");
							}else{
							  /* jobbra behúzás - kivétel az elsõ sor */
								if( (aktpadding/2)-SCANNER.padding == 1){
									if (SCANNER.padding >= 0){
										COM.addToken("{");
									}
									SCANNER.padding++;
								}else if((aktpadding/2)-SCANNER.padding >= 1){
									throw("Érvénytelen behúzás! "+row+". sor, "+(i-col)+". oszlop");
								}
								/* balra - ciklus végén is kell! */
								else if (SCANNER.padding > (aktpadding/2)){
									for(var j=SCANNER.padding; j>(aktpadding/2); j--){
									  COM.addToken("}");
										SCANNER.padding--;
									}
								}
							}
						}
					}
				}
					
				/* utasítás lezárás */
				if (SCANNER.inputtext.charAt(i)==COM.TERMINATOR && (COM.PADDING && COM.tokenCount>0 && (COM.tokens[COM.tokenCount-1]!="\n"))){  
					COM.addToken(COM.TERMINATOR);
				}
					
				/* ha betû, másoljuk a szót */
				else if (SCANNER.isLetter(SCANNER.inputtext.charAt(i))){
					var sztring = SCANNER.inputtext.charAt(i);
	
					while ((SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.isLetter(SCANNER.inputtext.charAt(i+1)) || SCANNER.isDigit(SCANNER.inputtext.charAt(i+1))) ){
						sztring += SCANNER.inputtext.charAt(i+1);
						i++;
					}
					COM.addToken(sztring);
				}
					
				/* ha fehér karaktert találtunk */
				else if ( SCANNER.isWhiteChar(SCANNER.inputtext.charAt(i)) ){
					  
				}
				  
				/* ha számot */
				else if ( SCANNER.isDigit(SCANNER.inputtext.charAt(i))){
					var sztring = SCANNER.inputtext.charAt(i);
		      while ((SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.isDigit(SCANNER.inputtext.charAt(i+1))) ){
						sztring += SCANNER.inputtext.charAt(i+1);
						i++;
					}
					COM.addToken(sztring);
				}
					
				/* ( ) [ ] , : */
				else if ( SCANNER.inputtext.charAt(i)=="(" || SCANNER.inputtext.charAt(i)==")" ||
					        SCANNER.inputtext.charAt(i)=="," || SCANNER.inputtext.charAt(i)==":" ||
					        SCANNER.inputtext.charAt(i)=="[" || SCANNER.inputtext.charAt(i)=="]" ){
					COM.addToken(SCANNER.inputtext.charAt(i));
				}
					
			  /* operators: <- < <= <> */
				else if (SCANNER.inputtext.charAt(i)=="<"){
	        if ( (SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.inputtext.charAt(i+1)=="-") ){ COM.addToken("<-"); i++;}
					else if ( (SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.inputtext.charAt(i+1)=="=") ){ COM.addToken("<="); i++;}
					else if ( (SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.inputtext.charAt(i+1)==">") ){ COM.addToken("<>"); i++;}
					else COM.addToken("<"); 
				}
					
				/* operators: >= > */
				else if (SCANNER.inputtext.charAt(i)==">"){
	        if ( (SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.inputtext.charAt(i+1)=="=") ){ COM.addToken(">="); i++;}
					else COM.addToken(">");
				}
				
				/* operators: = > */
				else if (SCANNER.inputtext.charAt(i)=="="){
					COM.addToken("=");
				}
				
				/* arithmetic */
				else if (SCANNER.isArithmetic(SCANNER.inputtext.charAt(i))){
					COM.addToken(SCANNER.inputtext.charAt(i));
				}
					
				/* sztring
				else if (SCANNER.inputtext.charAt(i)=="\""){
					var sztring = SCANNER.inputtext.charAt(i);
					while ( (SCANNER.inputtext.charAt(i+1) != "") && (SCANNER.inputtext.charAt(i+1) != "\"") ){
						sztring += SCANNER.inputtext.charAt(i+1);
						i++;
					}
				  sztring += SCANNER.inputtext.charAt(i+1);
					i++;
					COM.addToken(sztring);
				} */
					
				
				/* ha a behúzás vizsgálat miatt a kód végére értünk */
				else if(SCANNER.inputtext.charAt(i)==""){}
				
				/* ismeretlen karakter */
				else{
					throw ("Ismeretlen karakter!"+row+". sor, "+(i-col)+". oszlop");
					return false;
				}
					
				i++;
		  }
			if (SCANNER.padding > 0){
				if(COM.PADDING && COM.tokenCount>0 && COM.tokens[COM.tokenCount-1]!="\n") COM.addToken("\n");
				/* } jelek hozzáadása a kód végéhez */
				for(var j=SCANNER.padding; j>0; j--){
					COM.addToken("}");
					SCANNER.padding--;
				}
			}
		}
		return true;
	},
	
	/* adott karakter fehér karakter? */
	isWhiteChar: function(charr){
	  var regexp = new RegExp("\\s");
		return regexp.test(charr);
	},
	
	/* adott karakter betû? */
	isLetter: function(charr){
	  var regexp = new RegExp("[A-Za-z]");
		return regexp.test(charr);
	},
	
	/* adott karakter számjegy? */
	isDigit: function(charr){
	  var regexp = new RegExp("[0-9]");
		return regexp.test(charr);
	},
	
	/* adott karakter aritmetikai operátor? */
	isArithmetic: function(charr){
	  var regexp = new RegExp("[+-/*]");
		return regexp.test(charr);
	}
	
};

