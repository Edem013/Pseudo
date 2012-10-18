/*
 * Fordító (Compiler)
 *
 * Metasyntax:
 *
 *    <program> = <statement>, {<terminator>, <statement>};
 *
 * <terminator> = "\n";
 *
 *      <begin> = ? padding every next row with plus two spaces ?;
 *
 *        <end> = ? padding every next row with minus two spaces ?;
 *
 *     <assign> = <ident>, "<-", <exp>;
 *
 *  <statement> = <assign>
 *              | "FOR ", <assign>, ",", <exp>, [<begin>, <statement>, {<terminator>, <statement>}, <end>]
 *              | "IF ", <exp>, [<begin>, <statement>, {<terminator>, <statement>}, <end>]
 *                ["ELSE IF ", <exp>, [<begin>, <statement>, {<terminator>, <statement>}, <end>]]
 *                ["ELSE , [<begin>, <statement>, {<terminator>, <statement>}, <end>]];
 *
 *      <ident> = ^[A-Za-z][A-Za-z0-9]*;
 * 
 *        <exp> = <number> | <ident> | <op>;
 *
 *     <number> = ^[0-9]+$;
 *
 *         <op> = <exp> <operator> <exp>;
 *
 *  <operatror> = "-" | "+" | "*" | "<" | "=" | ">" | "and" | "or";
 *
 * @author Edem
 * @version 1.0
 */

var COM = {
  
	PADDING: true,
	CASE_SENS: false,
	TERMINATOR: "\n",
	LOG_ON: !true, 
	
	tokens:[],
	tokenCount: 0,
	ast_root:null,
	
	run: function(){
		try{
		  /* log ablak tartalmának törlése */
			document.getElementById('log').innerHTML = ""; 
			
		  /* változók ellenõrzése */
		  adatSzerk.sorEllen();
			if (adatSzerk.hasError) throw("Hibás változó deklaráció!");
			
			/* memória inicializálás */
			MEM.memoryClear();
			
			/* változóknak memóriafoglalás */
			COM.varsToMem();
			
			/* Kód szkennelése - tokenekre bontása */
		  SCANNER.scan();
			
			/* Tokenek kiírása */
			var eredmeny = "";
			for (var i=0; i<COM.tokenCount; i++){
			  eredmeny += "["+COM.tokens[i]+"] ";
				if (COM.tokens[i] == "\n" || COM.tokens[i] == "{"){
				  eredmeny += "<br>";
				}
			}
			document.getElementById("footer").innerHTML = "My Virtual Machine<br><br>Tokenek:<br>"+eredmeny;
			
			/* Kód leképezése fára */
			COM.ast_root = PARSER.parseStm(0);
	    
			/* Fa bejárása, majd átírása gépi kódra */
			CODEGEN.fordit();
			
			/* képernyõ törlés */
			SCR.screenInit();
			
			/* képernyõ megjelenítés */
			SCR.showScreen();
			
			/* indítás */
			P64.regs.ip = MEM.Read16W(0);
			printLog('START');
			do{
			  printLog('-----------------------------------------');
		    P64.printLog("Run IP:"+P64.regs.ip);
			  P64.map[MEM.Read8B(P64.regs.ip)]();
			}while(P64.regs.ip <= MEM.Read16W(2));
			printLog('-----------------------------------------'); 
			printLog("End");
			
			SCR.refresh();
			
			/* képernyõ elrejtése 
			SCR.hideScreen(); */
			document.getElementById("screen").setAttribute("onclick","SCR.hideScreen();");
			
		}catch(err){
		  alert(err);
		}
	},
	
	/* Új token hozzáadása */
	addToken: function(sztring){
	  COM.tokens[COM.tokenCount] = sztring;
		COM.tokenCount++;
	},
	
	/* Változóknak helyfoglalás */
	varsToMem: function(){
		var cim = MEM.Read16W(0);
		/* változónként egy-egy byte lefoglalása, BÕVÍTENI KELL!!! */
	  for( var i=0; i<adatSzerk.sorokSzama; i++){
		  adatSzerk.sorok[i].address = cim;
			cim++;
		}
		MEM.Wrt16W(0,cim);
	},
	
	/* Utasítás neve sorszáma alapján */
	utasitasKiir: function(szama){
	  switch (szama){
		  case 0: return "LDA_U8B"; break;
			case 1: return "LDA_U16W"; break;
			case 2: return "LDA_U32W"; break;
			case 3: return "NOP (LDA_U64W)"; break;
			case 4: return "LDA_S8B"; break;
			case 5: return "LDA_S16W"; break;
			case 6: return "LDA_S32W"; break;
			case 7: return "NOP (LDA_S64W)"; break;
			case 8: return "LDB_U8B"; break;
			case 9: return "LDB_U16W"; break;
			case 10: return "LDB_U32W"; break;
			case 11: return "NOP (LDB_U64W)"; break;
			case 12: return "LDB_S8B"; break;
			case 13: return "LDB_S16W"; break;
			case 14: return "LDB_S32W"; break;
			case 15: return "NOP (LDB_S64W)"; break;
			case 16: return "LDA_H_U8B"; break;
			case 17: return "LDA_H_U16W"; break;
			case 18: return "LDA_H_U32W"; break;
			case 19: return "NOP (LDA_H_U64W)"; break;
			case 20: return "LDA_H_S8B"; break;
			case 21: return "LDA_H_S16W"; break;
			case 22: return "LDA_H_S32W"; break;
			case 23: return "NOP (LDA_H_S64W)"; break;
			case 24: return "LDB_H_U8B"; break;
			case 25: return "LDB_H_U16W"; break;
			case 26: return "LDB_H_U32W"; break;
			case 27: return "NOP (LDB_H_U64W)"; break;
			case 28: return "LDB_H_S8B"; break;
			case 29: return "LDB_H_S16W"; break;
			case 30: return "LDB_H_S32W"; break;
			case 31: return "NOP (LDB_H_S64W)"; break;
			case 32: return "LDH_U16W"; break;
			case 33: return "LDA_STACK"; break;
			case 34: return "LDB_STACK"; break;
			case 35: return "ADDA_B"; break;
			case 36: return "SUBA_B"; break;
			case 37: return "MULA_B"; break;
			case 38: return "JMP"; break;
			case 39: return "PRINTA_B"; break;
			case 40: return "CMP_EQ"; break;
			case 41: return "CMP_NE"; break;
			case 42: return "CMP_L"; break;
			case 43: return "STACKA"; break;
			case 44: return "STACKC"; break;
			case 45: return "STRA_H_8B"; break;
			default: return "unknown"; break;
		}
	}
	
};

