/*
 * Elemzõ (Parser)
 *
 * @author Edem
 * @version 1.0
 */
 
PARSER = {
	
	index:0,
	id:0,
	ops:["*","+","<","and","("],
	
	/*
	 * Utasítások értelmezése
	 */
  parseStm: function(index){
		if (typeof(index) != "undefined"){
		  PARSER.index = index;
			PARSER.id = 0;
		}
		var result = null;
		
		if (PARSER.isMoreToken(PARSER.index)){
		  
			/* FOR  <varIdent> <- <start>, <end> */
	    if ((!COM.CASE_SENS && COM.tokens[PARSER.index] == "for") ||
		      (COM.CASE_SENS && COM.tokens[PARSER.index] == "For")){
				
				result = new AST.node("for");
				result.id = ++PARSER.id;
								 
				/* <varIdent> */
				PARSER.index++;
				if (PARSER.isValidVar(COM.tokens[PARSER.index])){
				  /* változó hozzáadása result objektumhoz */
					result.identVar = new AST.node("identVar");
				  result.identVar.id = ++PARSER.id;
				  result.identVar.value = COM.tokens[PARSER.index];
				  result.identVar.varId = PARSER.getVarId(COM.tokens[PARSER.index]);
					PARSER.index++;
				}else{
				  throw("Ismeretlen azonosító: "+COM.tokens[PARSER.index]);
				}
				
				/* "<-" */
				if (COM.tokens[PARSER.index] != "<-") throw("Hiányzó \"<-\" jel!");
				
				/* <exp> */
				PARSER.index++;
				result.start = PARSER.parseExp(",");
				
				/* "," */
				if (COM.tokens[PARSER.index] != ",") throw("Hiányzó \",\" jel!");
				
				/* <exp>  */
				PARSER.index++;
				result.end = PARSER.parseExp(COM.TERMINATOR);
				/* ciklusmag \n{  } */
			  if (COM.PADDING){
					if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != "\n"){
					  throw("Hiányzó soremelés!");
					}else{
					  PARSER.index++;
					}
				}
				if (COM.tokens[PARSER.index] == "{"){
					PARSER.index++;
				  result.core = PARSER.parseStm();
				}else{
					result.core = null;
				}
				
      }
				
		  /* IF */
			else if((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "if")) ||
		           (COM.CASE_SENS && (COM.tokens[PARSER.index] == "If"))){
				result = new AST.node("if");
				result.id = ++PARSER.id;
				  
				PARSER.index++;
				result.exp = PARSER.parseExp(COM.TERMINATOR);
				
			  if (COM.PADDING){
					if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != "\n"){
					  throw("Hiányzó soremelés!");
					}else{
					  PARSER.index++;
					}
				}
				if (COM.tokens[PARSER.index] == "{"){
					PARSER.index++;
					result.core = PARSER.parseStm();
				}else{
					result.core = null;
				}
					
				if((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "else")) ||
		        (COM.CASE_SENS && (COM.tokens[PARSER.index] == "Else"))){
					PARSER.index++;
					if(COM.tokens[PARSER.index]=="\n"){
						PARSER.index++;
						if (COM.tokens[PARSER.index] == "{"){
					    PARSER.index++;
						  result.elseCore = PARSER.parseStm();
					  }else{
					    result.elseCore = null;
						}
				  }else if((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "if")) ||
		               (COM.CASE_SENS && (COM.tokens[PARSER.index] == "If"))){
				    result.elseCore = PARSER.parseStm();
					}
				}
			}
				
		  /* KI: */
		  else if((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "ki")) ||
		           (COM.CASE_SENS && (COM.tokens[PARSER.index] == "Ki"))){
			  result = new AST.node("print");
				result.id = ++PARSER.id;
				PARSER.index++;
				
				/* ":" */
				if (COM.tokens[PARSER.index] != ":") throw("Hiányzó \":\" jel!");
				
				/* <exp> */
				PARSER.index++;
				result.value = PARSER.parseExp(COM.TERMINATOR);
					
				if (COM.PADDING){
					if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != COM.TERMINATOR){
					  throw("Hiányzó lezárás!"+PARSER.index);
					}else{
					  PARSER.index++;
					}
				}
			}
			
		  /* Azonosító (változó) */
		  else{
		    /* ellõrzés hogy létezik-e
			  for-nál van már ellenõrzés */
			  if (PARSER.isValidVar(COM.tokens[PARSER.index])){
				  result = new AST.node("identVar");
					result.id = ++PARSER.id;
				  result.value = COM.tokens[PARSER.index];
					result.varId = PARSER.getVarId(COM.tokens[PARSER.index]);
					PARSER.index++;
					
					/* értékadás var <- exp */
					if ( COM.tokens[PARSER.index] == "<-" ){
					  var assign = new AST.node("assign");
						assign.id = ++PARSER.id;
					  assign.identVar = result;
						PARSER.index++;
						assign.exp = PARSER.parseExp(COM.TERMINATOR);
						  
						result = assign;
					  if (COM.PADDING){
					    if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != COM.TERMINATOR){
					      throw("Hiányzó lezárás!");
						  }else{
					      PARSER.index++;
						  }
					  }
					}
				}else{
					throw ("Ismeretlen azonosító!");
				}
	  	}
			
			/* van következõ utasítás? */
			if (PARSER.index < COM.tokenCount && result.name!="identVar"){
				if (COM.tokens[PARSER.index]!="}"){
			    var seq = new AST.node("sequence");
					seq.id = ++PARSER.id;
					seq.left = result;
					seq.right = PARSER.parseStm();
					result = seq;
				}else{
					PARSER.index++;
			  }
			}
		  return result;
		}
		/* nincs több token */
		else{
		  return null; 
		}
	},
	
	/* (-)számok, vazonosítók, elõzõek operátorral elválasztva */
	parseExp: function(stop){
	  
		/* 1. átalakítás postfix-re
		   2. fa felírása */
		var postfix = new Array();
		var stack = new Array();
		var lastOp;
		var op;
		
		while ( PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index]!=stop ){
		  /* negatív elõjel */
			if (COM.tokens[PARSER.index] == "-"){
				if (COM.tokens[PARSER.index+1] == "-") throw("hibás kifejezés");
				op = new AST.node("number");
				op.id = ++PARSER.id;
				op.value = -1;
				postfix.push(op);
				COM.tokens[PARSER.index] = "*";
			}
			
			/* zárójel nyitás */
			else if (COM.tokens[PARSER.index] == "("){
        op = new AST.node("(");
				op.id = ++PARSER.id;
				stack.push(op);
				PARSER.index++;
			}
			
			/* zárójel bezárás */
			else if (COM.tokens[PARSER.index] == ")"){
			  /* kiolvasás stack-bõl */
				lastOp = stack.pop();
				while( typeof(lastOp)!="undefined" && lastOp.name!="(" ){
					/* kivesz */
					postfix.push(lastOp);
					lastOp = stack.pop();
				}
				/* kivettünk mindet - nem találtunk ( */
				if (typeof(lastOp)=="undefined") throw ("túl sok zárójel bezárás");
				PARSER.index++;
			}
		  /* ha számot találtunk*/
		  else if (PARSER.tokenIsDigit(COM.tokens[PARSER.index])){
				op = new AST.node("number");
				op.id = ++PARSER.id;
				op.value = COM.tokens[PARSER.index];
				postfix.push(op);
				PARSER.index++;
			}
			
			/* azonosító */
			else if(PARSER.isValidVar(COM.tokens[PARSER.index])){
			  op = new AST.node("identVar");
				op.id = ++PARSER.id;
				op.value = COM.tokens[PARSER.index];
				op.varId = PARSER.getVarId(COM.tokens[PARSER.index]);
				postfix.push(op);
				PARSER.index++;
			}
			/* egyéb */
			else{
			  /* nem várt kifejezések */
			  if ( COM.tokens[PARSER.index] == "+" || COM.tokens[PARSER.index] == "*"){
			    throw ("Nem várt kifejezés!");
				}else{ throw ("Ismeretlen kifejezés!"); }
			}
			
			/* következõ elem operátor? */
			if (op.name != "(" && (
			    COM.tokens[PARSER.index] == "+" || COM.tokens[PARSER.index] == "-" || COM.tokens[PARSER.index] == "*"  ||
			    COM.tokens[PARSER.index] == "<" || COM.tokens[PARSER.index] == "<=" || COM.tokens[PARSER.index] == "=" ||
					COM.tokens[PARSER.index] == ">" || COM.tokens[PARSER.index] == ">=" || COM.tokens[PARSER.index] == "<>" ||
					((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "and")) || (COM.CASE_SENS && (COM.tokens[PARSER.index] == "AND"))) ||
					((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "or")) || (COM.CASE_SENS && (COM.tokens[PARSER.index] == "OR"))) ||
					COM.tokens[PARSER.index] == "&&" || COM.tokens[PARSER.index] == "||" )){
					
				if((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "and")) || (COM.CASE_SENS && (COM.tokens[PARSER.index] == "AND"))) COM.tokens[PARSER.index]="&&";
				if((!COM.CASE_SENS && (COM.tokens[PARSER.index] == "or")) || (COM.CASE_SENS && (COM.tokens[PARSER.index] == "OR"))) COM.tokens[PARSER.index]="||";
			  
				if (stack.length == 0){
					op = new AST.node("op");
					op.type = COM.tokens[PARSER.index];
					op.id = ++PARSER.id;
				  stack.push(op);
				}else{
				  /* prioritás ellenõrzés */
					lastOp = stack.pop();
					while( typeof(lastOp)!="undefined" && lastOp.name!="(" && !PARSER.opIsFirst(COM.tokens[PARSER.index],lastOp.type)){
					  /* kivesz */
						postfix.push(lastOp);
						lastOp = stack.pop();
					}
					if (typeof(lastOp)!="undefined") stack.push(lastOp);
					op = new AST.node("op");
					op.type = COM.tokens[PARSER.index];
					op.id = ++PARSER.id;
					stack.push(op);
				}
				PARSER.index++;
			}
		}
		
		while(stack.length > 0){
		  lastOp = stack.pop();
			if (lastOp == "(") throw ("Hiányzó zárójel lezárás!");
		  postfix.push(lastOp);
		}
		
		//üres kifejezés
		if (postfix.length == 0) throw ("Hiányzó kifejezés!");
		
		/* fa felállítása */
		for ( var i=0; i<postfix.length; i++){
		  if (postfix[i].name == "op"){
			  postfix[i].right= stack.pop();
				postfix[i].left = stack.pop();
				if (postfix[i].right == null || postfix[i].left == null) throw ("Hibás kifejezés!");
				stack.push(postfix[i]);
			}else{
			  stack.push(postfix[i]);
			}
		}
		
		return stack.pop();
	},
	
	/* létezõ azonosító: */
	isValidVar: function(varIdent){
	  for(var i=0; i<adatSzerk.sorokSzama; i++){
		  if ((COM.CASE_SENS && (varIdent == adatSzerk.sorok[i].azon)) ||
			    (!COM.CASE_SENS && (varIdent == adatSzerk.sorok[i].azon.toLowerCase()))){
				return true;	
			}
	  }
		return false;
	},
	
	/* azonosító sorszáma */
	getVarId: function(varIdent){
	  for(var i=0; i<adatSzerk.sorokSzama; i++){
		  if ((COM.CASE_SENS && (adatSzerk.sorok[i].azon == varIdent)) ||
			    (!COM.CASE_SENS && (adatSzerk.sorok[i].azon.toLowerCase() == varIdent))){
				return i;	
			}
	  }
		return null;
	},
	
	/* van további token? */
	isMoreToken: function(i){
	  if(i < COM.tokenCount){
		  return true;
		}else{
		  return false;
		}
	},
	
	/* a token szám? */
	tokenIsDigit: function(token){
	  if (token.length == 0){
		  return false;
		}else{
		  /*
		  //ha az elsõ karakter nem szám és nem '-' karakter
		  if( !SCANNER.isDigit(token.charAt(i)) && (token.charAt(i)!="-")) return false;
			var i=0;
			if(token.charAt(0) == '-'){
			  if(token.length == 1) return false;
				i++;
			}
			if ( (token.length - i > 1) && (token.charAt(i)=='0') ) return false;
			
		  for(i=i; i<token.length; i++){
			  if (!SCANNER.isDigit(token.charAt(i))) return false;
			}
			return true;
		}*/
		  for(i=0; i<token.length; i++){
			  if (!SCANNER.isDigit(token.charAt(i))) return false;
		  }
		  return true;
		}
	},
	
	/* op1 magasabb prioritású, mint op2? */
	opIsFirst: function(op1, op2){
	
	  var indexOp1, indexOp2;
		
	  if ( op1 == "+" || op1 == "-"){
		  indexOp1 = PARSER.ops.indexOf("+");
		}
		else if ( op1 == "*"){
		  indexOp1 = PARSER.ops.indexOf("*");
		}
		else if ( op1 == "<" || op1 == "<=" || op1 == "=" || op1 == "=>" || op1 == ">" || op1 == "<>"){
		  indexOp1 = PARSER.ops.indexOf("<");
		}
		else if ( op1 == "and" || op1 == "or" || op1 == "&&" || op1 == "||"){
		  indexOp1 = PARSER.ops.indexOf("and");
		}
		else if ( op1 == "("){
		  indexOp1 = PARSER.ops.indexOf("(");
		}
		
		if ( op2 == "+" || op2 == "-"){
		  indexOp2 = PARSER.ops.indexOf("+");
		}
		else if ( op2 == "*"){
		  indexOp2 = PARSER.ops.indexOf("*");
		}
		else if ( op2 == "<" || op2 == "<=" || op2 == "=" || op2 == "=>" || op2 == ">" || op2 == "<>"){
		  indexOp2 = PARSER.ops.indexOf("<");
		}
		else if ( op2 == "and" || op2 == "or" || op2 == "&&" || op2 == "||"){
		  indexOp2 = PARSER.ops.indexOf("and");
		}
		else if ( op2 == "("){
		  indexOp2 = PARSER.ops.indexOf("(");
		}
		
		if ( indexOp1 < indexOp2 ){
		  return true;
		}else{
		  return false;
		} 
	}
}