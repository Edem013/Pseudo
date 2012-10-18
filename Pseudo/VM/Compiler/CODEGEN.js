/*
 * Kódgenerátor (Code Generator)
 *
 * @author Edem
 * @version 1.0
 */
 
CODEGEN = {

	cim:0,
  
	/*
	 * Fa bejárása - kód fordítása - memóriába írása
	 */
  fordit: function(){
	  /* kód beírásának kezdõcíme */
	  CODEGEN.cim = MEM.Read16W(0);
		/* bejárás */
		CODEGEN.bejaras(COM.ast_root);
    /* végpont beírása */
		MEM.Wrt16W(2,CODEGEN.cim-1);
	},
	
	/* bejárás */
  bejaras: function(root, cimek){
	  if (root != null){
		  
      switch (root.name){

			  case "sequence":
				  /* nem ír semmit a memóriába csupán az utasítások sorrendjéért felelõs */
		      CODEGEN.bejaras(root.left);
			    CODEGEN.bejaras(root.right);
			    break;
				
				case "for":
				  CODEGEN.bejaras(root.identVar);
				  CODEGEN.bejaras(root.start);
				  CODEGEN.bejaras(root.end);
				  CODEGEN.bejaras(root.core);
					break;
					
			  case "assign":
				  CODEGEN.bejaras(root.exp);
					CODEGEN.beszur("LDH_U16W");
				
					MEM.Wrt16W(CODEGEN.cim, adatSzerk.sorok[root.identVar.varId].address);
					CODEGEN.cim += 2;
					CODEGEN.beszur("LDA_STACK");
					CODEGEN.beszur("STRA_H_8B");
					break;
					
			  case "if":
					var loopCimek = [];
				  CODEGEN.bejaras(root.exp,loopCimek);
					CODEGEN.beszur("LDA_STACK");
					CODEGEN.beszur("LDB_U8B");
					MEM.Wrt8B(CODEGEN.cim,0);
					CODEGEN.cim+=1;
					CODEGEN.beszur("CMP_NE");
					CODEGEN.beszur("JMP");
					loopCimek.push(CODEGEN.cim);
					CODEGEN.cim+=2;
				  CODEGEN.bejaras(root.core);
					/* kiértékeltük a ciklusmagot, megvan a vége */
					while( loopCimek.length > 0 ){
						var cim = loopCimek.pop();
						MEM.Wrt16W(cim,CODEGEN.cim+3);
					}
					CODEGEN.beszur("JMP");
				  loopCimek = CODEGEN.cim;
					CODEGEN.cim+=2;
				  CODEGEN.bejaras(root.elseCore);
				  MEM.Wrt16W(loopCimek,CODEGEN.cim);
					break;
					
			  case "print":
				  CODEGEN.bejaras(root.value);
					CODEGEN.beszur("LDA_STACK");
					CODEGEN.beszur("PRINTA_B");
					break;
					
			  case "identVar":
					CODEGEN.beszur("LDH_U16W");
					MEM.Wrt16W(CODEGEN.cim, adatSzerk.sorok[root.varId].address);
					CODEGEN.cim += 2;
					CODEGEN.beszur("LDA_H_S8B");
					CODEGEN.beszur("STACKA");
					break;
					
			  case "number":
					/* olvassuk be a számot A regiszterbe, majd dobjuk be a verembe */
					if ( root.value == -1 ){
					  CODEGEN.beszur("LDA_S8B");
						MEM.Wrt8B(CODEGEN.cim, 0xFF);
						CODEGEN.cim+=1;
					}else{
					  var meret = CODEGEN.dec2Bin(root.value);
					  switch (meret){
					    case 1: CODEGEN.beszur("LDA_U8B");break;
						  case 2: CODEGEN.beszur("LDA_U16W");break;
						  case 4: CODEGEN.beszur("LDA_U32W");break;
						  /*case 8: CODEGEN.beszur("LDA_U64W");break;*/
					  }
					  CODEGEN.cim+=meret;
					}
					CODEGEN.beszur("STACKA");
				  break;
					
				case "op":
					CODEGEN.bejaras(root.left,cimek);
					if ( root.type == "&&" ){
					  CODEGEN.beszur("LDB_U8B");
						MEM.Wrt8B(CODEGEN.cim,0x00);
						CODEGEN.cim++;
						CODEGEN.beszur("LDA_STACK");
						CODEGEN.beszur("CMP_NE");
						/* nem igaz a bal ág így nem kell folytatni az ellenõrzést */
						CODEGEN.beszur("JMP");
						/* ide kell a cilkus/elágazás vége */
						cimek.push(CODEGEN.cim);
						CODEGEN.cim+=2;
						CODEGEN.bejaras(root.right);
					}else{
					  CODEGEN.bejaras(root.right);
					  CODEGEN.beszur("LDB_STACK");
					  CODEGEN.beszur("LDA_STACK");
					  switch (root.type){
					    case "+": CODEGEN.beszur("ADDA_B");break;
						  case "-": CODEGEN.beszur("SUBA_B");break;
						  case "*": CODEGEN.beszur("MULA_B");break;
						
						  case "=": CODEGEN.beszur("CMP_EQ");break;
						  case "<": CODEGEN.beszur("CMP_L");break;
					  }
					  CODEGEN.beszur("STACKC");
					}
				  break;
					
			  default:
			    alert("Ismeretlen elem a fában!");
			}
		}else{
		  /* nincs elem */
		}
	},
	
	/* Utasítás beírása a memóriába */
	beszur: function(utasitas){
	  MEM.Wrt8B(CODEGEN.cim,P64.map.indexOf(P64.mnemonics[''+utasitas]));
		CODEGEN.cim++;
	},
	
	/* karakteresen megadott decimális szám
	   bináris formára alakítás */
	dec2Bin: function(sztring){
		var sztring2 = "";
		var carry = 0;
		var result = 0;
		var bits = 1;
		var bytes = 0;
		
		while(parseInt(sztring2) != "0"){
			sztring2 = "";
	    for( var i=0; i<sztring.length; i++){
		    if( !(sztring2 == "" && Math.floor((parseInt(sztring.charAt(i))+carry)/2) == 0 && sztring.length>1))
				  sztring2 += Math.floor((parseInt(sztring.charAt(i))+carry)/2);
			  if(sztring.charAt(i)%2 == 1){
			    carry=10;
			  }else{
			    carry=0;
			  }
		  }
		  if( carry == 10){
		    result |= bits;
		  }
			if (bits == 0x80){
			  /* 8bitet felírtunk, memóriába írás */
				bytes++;
				if ( bytes > Math.pow(2,P64.MAX_REG_BYTES)) throw ("Túl nagy szám!");
				MEM.Wrt8B(CODEGEN.cim+bytes,result);
				result = 0;
				bits = 0x01;
			}else{
			  bits = bits << 1;
			}
			carry = 0;
		  sztring = sztring2;
		}
		
		/* maradék bitek felírása */
		if(result != 0){
		  bytes++;
			if ( bytes > Math.pow(2,P64.MAX_REG_BYTES)) throw ("Túl nagy szám!");
			MEM.Wrt8B(CODEGEN.cim+bytes,result);
		}

		bits = 1;
		while (bits<bytes) bits*=2;
		for( var i=bytes; i<bits; i++){
			bytes++;
			MEM.Wrt8B(CODEGEN.cim+bytes,0);
		}
		return bytes;
	}
}