/*
 * Elemz� (Parser)
 *
 * @author Edem
 * @version 1.0
 */
 
PARSER = {
	
	index:0,
	id:0,
	ops:["*","+","<","and","("],
	
	/*
	 * Utas�t�sok �rtelmez�se
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
				  /* v�ltoz� hozz�ad�sa result objektumhoz */
					result.identVar = new AST.node("identVar");
				  result.identVar.id = ++PARSER.id;
				  result.identVar.value = COM.tokens[PARSER.index];
				  result.identVar.varId = PARSER.getVarId(COM.tokens[PARSER.index]);
					PARSER.index++;
				}else{
				  throw("Ismeretlen azonos�t�: "+COM.tokens[PARSER.index]);
				}
				
				/* "<-" */
				if (COM.tokens[PARSER.index] != "<-") throw("Hi�nyz� \"<-\" jel!");
				
				/* <exp> */
				PARSER.index++;
				result.start = PARSER.parseExp(",");
				
				/* "," */
				if (COM.tokens[PARSER.index] != ",") throw("Hi�nyz� \",\" jel!");
				
				/* <exp>  */
				PARSER.index++;
				result.end = PARSER.parseExp(COM.TERMINATOR);
				/* ciklusmag \n{  } */
			  if (COM.PADDING){
					if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != "\n"){
					  throw("Hi�nyz� soremel�s!");
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
					  throw("Hi�nyz� soremel�s!");
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
				if (COM.tokens[PARSER.index] != ":") throw("Hi�nyz� \":\" jel!");
				
				/* <exp> */
				PARSER.index++;
				result.value = PARSER.parseExp(COM.TERMINATOR);
					
				if (COM.PADDING){
					if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != COM.TERMINATOR){
					  throw("Hi�nyz� lez�r�s!"+PARSER.index);
					}else{
					  PARSER.index++;
					}
				}
			}
			
		  /* Azonos�t� (v�ltoz�) */
		  else{
		    /* ell�rz�s hogy l�tezik-e
			  for-n�l van m�r ellen�rz�s */
			  if (PARSER.isValidVar(COM.tokens[PARSER.index])){
				  result = new AST.node("identVar");
					result.id = ++PARSER.id;
				  result.value = COM.tokens[PARSER.index];
					result.varId = PARSER.getVarId(COM.tokens[PARSER.index]);
					PARSER.index++;
					
					/* �rt�kad�s var <- exp */
					if ( COM.tokens[PARSER.index] == "<-" ){
					  var assign = new AST.node("assign");
						assign.id = ++PARSER.id;
					  assign.identVar = result;
						PARSER.index++;
						assign.exp = PARSER.parseExp(COM.TERMINATOR);
						  
						result = assign;
					  if (COM.PADDING){
					    if (PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index] != COM.TERMINATOR){
					      throw("Hi�nyz� lez�r�s!");
						  }else{
					      PARSER.index++;
						  }
					  }
					}
				}else{
					throw ("Ismeretlen azonos�t�!");
				}
	  	}
			
			/* van k�vetkez� utas�t�s? */
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
		/* nincs t�bb token */
		else{
		  return null; 
		}
	},
	
	/* (-)sz�mok, vazonos�t�k, el�z�ek oper�torral elv�lasztva */
	parseExp: function(stop){
	  
		/* 1. �talak�t�s postfix-re
		   2. fa fel�r�sa */
		var postfix = new Array();
		var stack = new Array();
		var lastOp;
		var op;
		
		while ( PARSER.isMoreToken(PARSER.index) && COM.tokens[PARSER.index]!=stop ){
		  /* negat�v el�jel */
			if (COM.tokens[PARSER.index] == "-"){
				if (COM.tokens[PARSER.index+1] == "-") throw("hib�s kifejez�s");
				op = new AST.node("number");
				op.id = ++PARSER.id;
				op.value = -1;
				postfix.push(op);
				COM.tokens[PARSER.index] = "*";
			}
			
			/* z�r�jel nyit�s */
			else if (COM.tokens[PARSER.index] == "("){
        op = new AST.node("(");
				op.id = ++PARSER.id;
				stack.push(op);
				PARSER.index++;
			}
			
			/* z�r�jel bez�r�s */
			else if (COM.tokens[PARSER.index] == ")"){
			  /* kiolvas�s stack-b�l */
				lastOp = stack.pop();
				while( typeof(lastOp)!="undefined" && lastOp.name!="(" ){
					/* kivesz */
					postfix.push(lastOp);
					lastOp = stack.pop();
				}
				/* kivett�nk mindet - nem tal�ltunk ( */
				if (typeof(lastOp)=="undefined") throw ("t�l sok z�r�jel bez�r�s");
				PARSER.index++;
			}
		  /* ha sz�mot tal�ltunk*/
		  else if (PARSER.tokenIsDigit(COM.tokens[PARSER.index])){
				op = new AST.node("number");
				op.id = ++PARSER.id;
				op.value = COM.tokens[PARSER.index];
				postfix.push(op);
				PARSER.index++;
			}
			
			/* azonos�t� */
			else if(PARSER.isValidVar(COM.tokens[PARSER.index])){
			  op = new AST.node("identVar");
				op.id = ++PARSER.id;
				op.value = COM.tokens[PARSER.index];
				op.varId = PARSER.getVarId(COM.tokens[PARSER.index]);
				postfix.push(op);
				PARSER.index++;
			}
			/* egy�b */
			else{
			  /* nem v�rt kifejez�sek */
			  if ( COM.tokens[PARSER.index] == "+" || COM.tokens[PARSER.index] == "*"){
			    throw ("Nem v�rt kifejez�s!");
				}else{ throw ("Ismeretlen kifejez�s!"); }
			}
			
			/* k�vetkez� elem oper�tor? */
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
				  /* priorit�s ellen�rz�s */
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
			if (lastOp == "(") throw ("Hi�nyz� z�r�jel lez�r�s!");
		  postfix.push(lastOp);
		}
		
		//�res kifejez�s
		if (postfix.length == 0) throw ("Hi�nyz� kifejez�s!");
		
		/* fa fel�ll�t�sa */
		for ( var i=0; i<postfix.length; i++){
		  if (postfix[i].name == "op"){
			  postfix[i].right= stack.pop();
				postfix[i].left = stack.pop();
				if (postfix[i].right == null || postfix[i].left == null) throw ("Hib�s kifejez�s!");
				stack.push(postfix[i]);
			}else{
			  stack.push(postfix[i]);
			}
		}
		
		return stack.pop();
	},
	
	/* l�tez� azonos�t�: */
	isValidVar: function(varIdent){
	  for(var i=0; i<adatSzerk.sorokSzama; i++){
		  if ((COM.CASE_SENS && (varIdent == adatSzerk.sorok[i].azon)) ||
			    (!COM.CASE_SENS && (varIdent == adatSzerk.sorok[i].azon.toLowerCase()))){
				return true;	
			}
	  }
		return false;
	},
	
	/* azonos�t� sorsz�ma */
	getVarId: function(varIdent){
	  for(var i=0; i<adatSzerk.sorokSzama; i++){
		  if ((COM.CASE_SENS && (adatSzerk.sorok[i].azon == varIdent)) ||
			    (!COM.CASE_SENS && (adatSzerk.sorok[i].azon.toLowerCase() == varIdent))){
				return i;	
			}
	  }
		return null;
	},
	
	/* van tov�bbi token? */
	isMoreToken: function(i){
	  if(i < COM.tokenCount){
		  return true;
		}else{
		  return false;
		}
	},
	
	/* a token sz�m? */
	tokenIsDigit: function(token){
	  if (token.length == 0){
		  return false;
		}else{
		  /*
		  //ha az els� karakter nem sz�m �s nem '-' karakter
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
	
	/* op1 magasabb priorit�s�, mint op2? */
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