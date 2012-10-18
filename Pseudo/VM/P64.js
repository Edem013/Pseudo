/**
 * Virtu�lis g�p processzora
 * 
 * @author Edem
 * @version 1.0
 */
 
P64 = { 

  MAX_REG_BYTES: 2, /* 2^3=8 */
	LOG_ON: true,

	regs: {
	  a: {r1:0, r2:0, r3:0, r4:0, r5:0, r6:0, r7:0, r8:0, t:0},
		b: {r1:0, r2:0, r3:0, r4:0, r5:0, r6:0, r7:0, r8:0, t:0},
		c: {r1:0, r2:0, r3:0, r4:0, r5:0, r6:0, r7:0, r8:0, t:0}, 
		h:0,
		f:0,
		ip:0
	},
	 
	/* verem az aritmetikai m�veletek v�grehajt�s�hoz
	   dinamikus mem�ria-kezel�sre cser�lend� a k�s�bbiekben */
	stack:[],
	 
	/* log */
	printLog: function(mit){
	  if (COM.LOG_ON && P64.LOG_ON){
		  document.getElementById('log').innerHTML += "CPU: "+mit+"<br>"; 
		  document.getElementById('log').scrollTop=document.getElementById('log').scrollHeight;
		}
	},
	 
	/*
	 *
	 * Processzor utas�t�s k�szlete: 
	 *
   */ 
	mnemonics: {
	 
	  /* A regiszter tartalma a verembe */
		STACKA: function(){
		  P64.printLog('STORE A TO STACK');
		  P64.mnemonics.STACK_REG('a');
		},
		/* B regiszter tartalma a verembe */
		STACKB: function(){
		  P64.mnemonics.STACK_REG('b');
		},
		/* C regiszter tartalma a verembe */
		STACKC: function(){
		  P64.mnemonics.STACK_REG('c');
		},
		
		/* H regisztrebe olvas�s */	
		LDH_U16W: function(){
			P64.regs.h = MEM.Read16W(P64.regs.ip+1);
			P64.printLog('LoadToRegH_U16W From '+(P64.regs.ip+1)+' - '+P64.regs.h);
			P64.regs.ip+=3;
		},
		
		/* A regiszter beolvas� utas�t�sai: */
		LDA_STACK: function(){
		  P64.printLog('LoadToRegA From STACK');
		  P64.regs.a = P64.stack.pop();
			P64.regs.ip+=1;
			
		},
		/* Unsigned */											
		LDA_U8B: function(){
		  P64.printLog('LoadToRegA_U8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',false,0,true);
    },
		LDA_U16W:function(){
		  P64.printLog('LoadToRegA_U16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',false,1,true);
		},
		LDA_U32W:function(){
		  P64.printLog('LoadToRegA_U32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',false,2,true);
		},
		
		/* Signed */												
		LDA_S8B:  function(){
	    P64.printLog('LoadToRegA_S8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',false,0,false);
	  },
		LDA_S16W: function(){
		  P64.printLog('LoadToRegA_S16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',false,1,false);
		},
		LDA_S32W: function(){
		  P64.printLog('LoadToRegA_S32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',false,2,false);
		},
		
		
		/* B regiszter beolvas� utas�t�sai */
		LDB_STACK: function(){
		  P64.regs.b = P64.stack.pop();
			P64.regs.ip+=1;
		},
		/* Unsigned */		 
		LDB_U8B:  function(){
		  P64.printLog('LoadToRegB_U8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',false,0,true);
		},
		LDB_U16W: function(){
		  P64.printLog('LoadToRegB_U16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',false,1,true);
		},
		LDB_U32W: function(){
		  P64.printLog('LoadToRegB_U32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',false,2,true);
		},
		
		/* Signed */										
		LDB_S8B:  function(){
		  P64.printLog('LoadToRegB_S8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',false,0,false);
		},
	  LDB_S16W: function(){
		  P64.printLog('LoadToRegA_S16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',false,1,false);
		},
		LDB_S32W: function(){
		  P64.printLog('LoadToRegA_S32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',false,2,false);
		},
		
		/* A regiszter beolvas� utas�t�sa H regiszterben t�rolt c�mr�l */
		/* Unsigned */
		LDA_H_U8B: function(){
		  P64.printLog('LoadToRegA_H_U8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',true,0,true);
    },
		LDA_H_U16W: function(){
		  P64.printLog('LoadToRegA_H_U16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',true,1,true);
    },
		LDA_H_U32W: function(){
		  P64.printLog('LoadToRegA_H_U32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',true,2,true);
    },
		/* Signed */	
		LDA_H_S8B: function(){
		  P64.printLog('LoadToRegA_H_U8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',true,0,false);
    },
		LDA_H_S16W: function(){
		  P64.printLog('LoadToRegA_H_U16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',true,1,false);
    },
		LDA_H_S32W: function(){
		  P64.printLog('LoadToRegA_H_U32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('a',true,2,false);
    },
		
		/* A regiszter t�rol�sa H regiszterben t�rolt c�mre */
		STRA_H_8B: function(){
		  P64.printLog('Store A to addreass in H');
			if ( P64.regs.a.t&0x03 > 0 ) throw ("T�lcsordul�s!");
		  MEM.Wrt8B(P64.regs.h,P64.regs.a.r1);
			P64.regs.ip+=1;
		},
		
		/* B regiszter beolvas� utas�t�sa H regiszterben t�rolt c�mr�l */
		/* Unsigned */
		LDB_H_U8B: function(){
		  P64.printLog('LoadToRegB_H_U8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',true,0,true);
    },
		LDB_H_U16W: function(){
		  P64.printLog('LoadToRegB_H_U16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',true,1,true);
    },
		LDB_H_U32W: function(){
		  P64.printLog('LoadToRegB_H_U32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',true,2,true);
    },
		/* Signed */	
		LDB_H_S8B: function(){
		  P64.printLog('LoadToRegB_H_U8B From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',true,0,false);
    },
		LDB_H_S16W: function(){
		  P64.printLog('LoadToRegB_H_U16W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',true,1,false);
    },
		LDB_H_S32W: function(){
		  P64.printLog('LoadToRegB_H_U32W From '+(P64.regs.ip+1));
			P64.mnemonics.LD_REG('b',true,2,false);
    },
		
	
		
		
		/* A �s B regiszterber t�rolt �rt�k �sszead�sa
		   eredm�ny a C regiszterben */
		ADDA_B:  function(){
		  P64.regs.f &= (~0x01);										
			var maxreg = Math.pow(2,Math.max(P64.regs.a.t&0x03,P64.regs.b.t&0x03));										
			
			/* k�z�s m�retre alak�t�s */
			P64.mnemonics.LOWER_REG('a','b');
													
			for( var i=1; i<=maxreg; i++){
				P64.regs.c['r'+i]=P64.mnemonics.ADD(P64.regs.a['r'+i],P64.regs.b['r'+i]);
			}
													
			/* c m�rete */
			P64.regs.c.t &= (~0x03);
			P64.regs.c.t += (P64.regs.a.t&0x03);
																					
			/*
			regs.a m�rete: P64.regs.a.t&0x03
			regs.a t�pusa: P64.regs.a.t&0x04
			U:  P64.regs.a.t&0x04 == 0x00
			S:  P64.regs.a.t&0x04 == 0x04
			+S: P64.regs.a['a'+maxreg]&0x80 == 0x00
			-S: P64.regs.a['a'+maxreg]&0x80 == 0x80
			*/
													
			/* C t�pus�nak be�ll�t�sa */
			if ( P64.mnemonics.ISSIGNED('a') == P64.mnemonics.ISSIGNED('b') ){
				/* azonos t�pus */
				if ( P64.mnemonics.ISSIGNED('a') ){
					P64.regs.c.t |= 0x04;
				}else{
					P64.regs.c.t &= (~0x04);
				}
			}else{
				/* nem azonos t�pus */
				if ( P64.mnemonics.ISSIGNED('a') ){
					var signed = 'a';
				}else{
					var signed = 'b';
				}
				if ( !P64.mnemonics.ISMINUS(signed)){
					P64.regs.c.t &= (~0x04);
				}else{
					P64.regs.c.t |= 0x04;
				}
			}
													
			/* Ha (+S)+(+S) �s az eredm�ny negat�v - U */										
			if ( P64.mnemonics.ISMINUS('c') &&
				P64.mnemonics.ISSIGNED('a') && !P64.mnemonics.ISMINUS('a') &&
				P64.mnemonics.ISSIGNED('b') && !P64.mnemonics.ISMINUS('b') ){										
													 
				P64.regs.c.t &= (~0x04);												
			}
													
			if ((P64.regs.f&0x01) != 0x00){

				/* Ha U+U vagy U+(+S) b�v�t�s 0x01el */
			  if ( !P64.mnemonics.ISSIGNED('a') &&
					 ( !P64.mnemonics.ISSIGNED('b') || (P64.mnemonics.ISSIGNED('b') && !P64.mnemonics.ISMINUS('b')) ) ){
														 
					P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0x01);
					P64.regs.c.t &= (~0x04);
				}
													    
				/* Ha (-S)+(-S) �s az eredm�ny pozit�v, b�v�t�s 0xFF */
				if ( P64.mnemonics.ISMINUS('a') && P64.mnemonics.ISMINUS('b') &&
						 P64.mnemonics.ISSIGNED('c') && !P64.mnemonics.ISMINUS('c') ){
				  P64.printLog('- -');		 															
					P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0xFF);
					P64.regs.c.t |= 0x04;
				}  
			}	
												
													
			var ki = 'ADD_A_B regA:'+Math.pow(2,P64.regs.a.t&0x03)*8+'b ';
			if ((P64.regs.a.t&0x04) == 0x00){
				ki += 'unsigned';
			}else{
				ki += 'signed';
			}
			ki += ' + regB:'+Math.pow(2,P64.regs.b.t&0x03)*8+'b ';
				if ((P64.regs.b.t&0x04) == 0x00){
					ki += 'unsigned';
				}else{
					 ki += 'signed';
				}
			ki += ' = regC:'+Math.pow(2,P64.regs.c.t&0x03)*8+'b ';
			if ((P64.regs.c.t&0x04) == 0x00){
			  ki += 'unsigned';
			}else{
				ki += 'signed';
			}
			P64.printLog(ki);     
			P64.regs.ip+=1;
		},
		
		
		/* A regiszter t�rolt �rt�kb�l B regiszterben t�rolt �rt�k
		   kivon�sa, eredm�ny a C a regiszterben */
		SUBA_B:  function(){ 
		  P64.regs.f &= (~0x01);
			var maxreg = Math.pow(2,Math.max(P64.regs.a.t&0x03,P64.regs.b.t&0x03));
													
			//k�z�s m�retre alak�t�s
			P64.mnemonics.LOWER_REG('a','b');
													
			for( var i=1; i<=maxreg; i++){
				P64.regs.c['r'+i]=P64.mnemonics.SUB(P64.regs.a['r'+i],P64.regs.b['r'+i]);
			}
													
			/* c m�rete */
			P64.regs.c.t &= (~0x03);
			P64.regs.c.t += (P64.regs.a.t&0x03);								
													
			/* c t�pusa */
			/* U - U or +S - U */
			if ( (!P64.mnemonics.ISSIGNED('a') || (P64.mnemonics.ISSIGNED('a') && !P64.mnemonics.ISMINUS('a'))) &&
				!P64.mnemonics.ISSIGNED('b')){
			  P64.printLog("U-U or +S-U");
				/* ha nem keletkezett t�lcsordul�s az eredm�ny U */
				if ( (P64.regs.f&0x01) == 0x00 ){
					P64.regs.c.t &= (~0x04);
				}else{
					/* ha keletkezett t�lcsordul�s eredm�ny S */
					P64.regs.c.t |= 0x04;
					/* az utols� helyi�rt�ken szerepl� bit 0, b�v�teni kell */
					if ( (P64.regs.c['r'+maxreg]&0x80) == 0x00 ){
						/* b�v�t�s */
						P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0xFF);									
					}
				}
			}
													
			/* U - +S */
			else if ( !P64.mnemonics.ISSIGNED('a') && (P64.mnemonics.ISSIGNED('b') && !P64.mnemonics.ISMINUS('b')) ){
				P64.printLog("U - +S");
				/* ha nem keletkezett t�lcsordul�s az eredm�ny U */
				if ( (P64.regs.f&0x01) == 0x00 ){
				  P64.regs.c.t &= (~0x04);
			  }else{
					/* ha keletkezett t�lcsordul�s eredm�ny S */
					P64.regs.c.t |= 0x04;
				}
			}
													
			/* U - -S */
			else if( !P64.mnemonics.ISSIGNED('a') && P64.mnemonics.ISMINUS('b') ){
				P64.printLog("U - -S");
				/* ha nem keletkezett t�lcsordul�s az eredm�ny S */
				if ( (P64.regs.f&0x01) == 0x00 ){
					/*b�v�t�s*/
					P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0x01);
					P64.regs.c.t |= 0x04;
				}else{
					/* ha keletkezett t�lcsordul�s eredm�ny U */
					P64.regs.c.t &= (~0x04);
				}
			}
													
			/* -S - U or -S - +S */
			else if ( P64.mnemonics.ISMINUS('a') && (!P64.mnemonics.ISSIGNED('b') || (P64.mnemonics.ISSIGNED('b') && !P64.mnemonics.ISMINUS('b'))) ){
				P64.printLog("-S - U or -S - +S");
				P64.regs.c.t |= 0x04;
				/* ha az eredm�ny pozit�v akkor b�v�t�s - eredm�ny S */
				if ( !P64.mnemonics.ISMINUS('c') ){
					/* b�v�t�s */
					P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0xFF);
				}
				if ( (P64.regs.f&0x01) == 0x01 ){
					/* b�v�t�s */
					P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0xFE);
				}										
			}
													
			/* +S - -S */
			else if ( P64.mnemonics.ISSIGNED('a') && !P64.mnemonics.ISMINUS('a') && P64.mnemonics.ISMINUS('b') ){
				P64.printLog("+S - -S");
				/* nem csordulhat t�l, eredm�ny U */
				P64.regs.c.t &= (~0x04);
			}
													
			/* +S - +S or -S - -S */
			else{
				P64.printLog("+S - +S or -S - -S");
				/* nem csordulhat t�l, eredm�ny S */
				P64.regs.c.t |= 0x04;
			}
													
			var ki = 'SUB_A_B regA:'+Math.pow(2,P64.regs.a.t&0x03)*8+'b ';
			if ((P64.regs.a.t&0x04) == 0x00){
				ki += 'unsigned';
			}else{
				ki += 'signed';
			}
			ki += ' - regB:'+Math.pow(2,P64.regs.b.t&0x03)*8+'b ';
			if ((P64.regs.b.t&0x04) == 0x00){
				ki += 'unsigned';
			}else{
				ki += 'signed';
			}
			ki += ' = regC:'+Math.pow(2,P64.regs.c.t&0x03)*8+'b ';
			if ((P64.regs.c.t&0x04) == 0x00){
				ki += 'unsigned';
			}else{
				ki += 'signed';
			}
			P64.printLog(ki); 
													
			P64.regs.ip+=1; 
		},
		
		/* A �s B regiszterek t�rolt �rt�k �sszeszorz�sa
		   eredm�ny a C regiszterben */
		MULA_B: function() { 
			P64.printLog("szorz�s");
													
			var isMinusRegA = false;
			var isMinusRegB = false;
													
			var maxreg = Math.pow(2,Math.max(P64.regs.a.t&0x03,P64.regs.b.t&0x03));
													
			/* k�z�s m�retre alak�t�s */
			P64.mnemonics.LOWER_REG('a','b');
													
			if (P64.mnemonics.ISMINUS('a')){
				isMinusRegA = true;
				P64.printLog("A to unsigned (Mul -1)");
				P64.regs.f &= (~0x01);
				for( var i=1; i<=maxreg; i++){
					if (i==1){
						P64.regs.a['r'+i]=P64.mnemonics.ADD(~P64.regs.a['r'+i],0x01);
					}else{
						P64.regs.a['r'+i]=P64.mnemonics.ADD(~P64.regs.a['r'+i],0x00);
					}
				  P64.printLog("a"+i+": "+P64.regs.a['r'+i]);
				}
			}
			if (P64.mnemonics.ISMINUS('b')){
				isMinusRegB = true;
				P64.printLog("B to unsigned (Mul -1)");
				P64.regs.f &= (~0x01);
				for( var i=1; i<=maxreg; i++){
					if (i==1){
						P64.regs.b['r'+i]=P64.mnemonics.ADD(~P64.regs.b['r'+i],0x01);
					}else{
						P64.regs.b['r'+i]=P64.mnemonics.ADD(~P64.regs.b['r'+i],0x00);
					}
				  P64.printLog(P64.regs.b['r'+i]);
			  }
		  }
													
			for( var i=1; i<=maxreg; i++){
				P64.regs.c['r'+i]=0x00;
			}
			P64.regs.c.t &= (~0x07);
													
			var lepes = 0;
			var mereta;
			for( var i=1; i<=maxreg; i++){
				for( var j=0x01; j<=0x80; j=j<<1 ){
					if ((P64.regs.b['r'+i]&j) == j){
						P64.mnemonics.SHIFTL_X('a',lepes);
						P64.mnemonics.LOWER_REG('a','c');
						mereta = Math.pow(2,P64.regs.a.t&0x03);
						P64.regs.f &= (~0x01);
						for( var k=1; k<=mereta; k++ ){
							P64.regs.c['r'+k]=P64.mnemonics.ADD(P64.regs.a['r'+k],P64.regs.c['r'+k]);
						}
						/* ha van t�lcsordul�s b�v�teni kell!!! */
						if ((P64.regs.f&0x01) == 0x01){
							P64.mnemonics.RESIZE('c',(P64.regs.c.t&0x03)+1,0x01);
						}
						lepes = 1;
					}else{
						lepes++;
					}
				}
			}
													
													
			/* el�jel!!! */
			if( isMinusRegB != isMinusRegA ){
				/* minusz eredm�ny */
				maxreg = Math.pow(2,P64.regs.c.t&0x03);
				P64.regs.f &= (~0x01);
				for( var i=1; i<=maxreg; i++){
				  if (i==1){
						P64.regs.c['r'+i]=P64.mnemonics.ADD(~P64.regs.c['r'+i],0x01);
					}else{
						P64.regs.c['r'+i]=P64.mnemonics.ADD(~P64.regs.c['r'+i],0x00);
					}
				}
				P64.regs.c.t |= 0x04;
				P64.printLog("c is signed");
			}else{
				P64.regs.c.t &= (~0x04);
				P64.printLog("c is unsigned");
			}
																							
			P64.regs.ip+=1;
		},
		
		/* �szehasonl�t� utas�t�s
		   A = B */
		CMP_EQ: function(){
		  P64.printLog('COMPARE: A = B');
		  P64.mnemonics.CMP('a','=','b','c');
		  P64.regs.ip+=1;
		},
		/* �szehasonl�t� utas�t�s
		   A <> B */
		CMP_NE: function(){
		  P64.printLog('COMPARE: A <> B');
		  P64.mnemonics.CMP('a','<>','b','c');
		  P64.regs.ip+=1;
		},
		/* �szehasonl�t� utas�t�s
		   A < B */
		CMP_L: function(){
		  P64.printLog('COMPARE: A < B');
		  P64.mnemonics.CMP('a','<','b','c');
		  P64.regs.ip+=1;
		},
		
		/* Ugr�s */
		JMP: function(){
		  if ((P64.regs.f&0x02) == 0x00){
			  /* ugr�s v�grehajt�sa */
				P64.regs.ip = MEM.Read16W(P64.regs.ip+1);
			}else{
			  /* ugr�s �tl�p�se */
				P64.regs.f &= (~0x02);
				P64.regs.ip+=3;
			}
		},
		
		/* A regiszter ki�r�sa bin�risan */
		PRINTA_B: function(){
			for( var i=Math.pow(2,P64.regs.a.t&0x03); i>0; i--){
			  for( var j=0x80; j>=0x01; j=j>>1 ){
				  if((P64.regs.a['r'+i]&j) == 0){
					  //0
						SCR.print("0");
					}else{
					  //1
						SCR.print("1");
					}
				}
			}
			SCR.refresh();
			P64.regs.ip+=1;
		},
		
		 
		NOP : function(){
		  P64.printLog('NOP');
		  P64.regs.ip+=1; 
		},
		
		
		
	/* 
	 *  Az ut�s�t�sk�szlet utas�t�sait t�mogat� fgv-ek:
	 */
		
		STACK_REG: function(reg){
		
		  P64.stack.push( {
			  r1:P64.regs[reg].r1, r2:P64.regs[reg].r2, r3:P64.regs[reg].r3, r4:P64.regs[reg].r4,
				r5:P64.regs[reg].r5, r6:P64.regs[reg].r6, r7:P64.regs[reg].r7, r8:P64.regs[reg].r8,
				t:P64.regs[reg].t }
			);
			P64.regs.ip+=1;
		
		},
				
		/*
		 * Beolvas�shoz:
		 * reg: melyik regiszterbe t�lts�nk be adatot ('a','b')
		 * h: H regiszterben t�rolt mem�riac�mr�l, vagy az utas�t�st k�vet�r�l (true, false)
		 * size: bet�ltend� adat m�rete (0-3 (1-8))
		 * unsigned: beolvasott adat t�pusa unsigned (true, false)
		 */
		LD_REG: function(reg, regH, size, unsigned){
		  /* ha nem H regiszterben t�rolt c�mr�l olvasunk */
			if(!regH){
		    var h = P64.regs.ip+1;
			}else{
			  var h = P64.regs.h;
			}
			/* olvas�s */
 			for(var i=1; i<=Math.pow(2,size); i++){
			  P64.regs[reg]['r'+i] = MEM.Read8B(h+(i-1));
			}
			
			/* m�ret ment�se */
			P64.regs[reg]['t'] = size;
			
			/* ha signed */
			if (!unsigned) P64.regs[reg]['t']+=4;
			
			/* utas�t�s sz�ml�l� �ll�t�sa */
			if (!regH){
			  P64.regs.ip+=Math.pow(2,size)+1;
			}else{
			  P64.regs.ip+=1;
			}
			
		},
		
		/* �szehasonl�t�s */
		CMP: function(regA, type, regB, regC){
			/* ha k�l�nb�z� az el�jel */
			if(P64.mnemonics.ISMINUS(regA) && !P64.mnemonics.ISMINUS(regB)){
			  P64.printLog('k�l�nb�z� el�jel - A minusz');
			  if(type=="<" || type=="<=" || type=="<>"){
				  P64.regs.f |= 0x02;
				}else{
				  P64.regs.f &= (~0x02);
				}
			}
			else if(!P64.mnemonics.ISMINUS(regA) && P64.mnemonics.ISMINUS(regB)){
			  P64.printLog('k�l�nb�z� el�jel - B minusz');
			  if(type==">" || type==">=" || type=="<>"){
				  P64.regs.f |= 0x02;
				}else{
				  P64.regs.f &= (~0x02);
				}
			}
			/* azonos el�jel */
			else{
			  /* azonos m�retre alak�t�s */
				P64.printLog('azonos el�jel');
				P64.mnemonics.LOWER_REG(regA,regB);
				
				for( var i=Math.pow(2,P64.regs[regA].t&0x03); i>0; i--){
			    for( var j=0x80; j>=0x01; j=j>>1 ){
					  /* elt�r�s */
						if( (P64.regs[regA]['r'+i]&j) != (P64.regs[regB]['r'+i]&j) ){
						  if( (P64.regs[regA]['r'+i]&j) > (P64.regs[regB]['r'+i]&j) ){
							  if(type==">" || type==">=" || type=="<>"){
				          P64.regs.f |= 0x02;
				        }else{
				          P64.regs.f &= (~0x02);
				        }
							}else{
							  if(type=="<" || type=="<=" || type=="<>"){
				          P64.regs.f |= 0x02;
				        }else{
				          P64.regs.f &= (~0x02);
				        }
							}
							if ((P64.regs.f&0x02) == 0x00){P64.regs[regC].r1 = 0x00;P64.regs[regC].t = 0x00;}else{P64.regs[regC].r1 = 0x01;P64.regs[regC].t = 0x00;}
							return null;
						}
					}
				}
				/* ha eddig eljutottunk akkor azonos a k�t regiszter */
				if(type=="=" || type==">=" || type=="<="){
				  P64.regs.f |= 0x02;
				}else{
				  P64.regs.f &= (~0x02);
				}
			}
			if ((P64.regs.f&0x02) == 0x00){P64.regs[regC].r1 = 0x00;P64.regs[regC].t = 0x00;}else{P64.regs[regC].r1 = 0x01;P64.regs[regC].t = 0x00;}
		},
		 
		/* �sszead�s */ 
		ADD:     function(regA, regB){
		  var i,f=(P64.regs.f&0x01),regC=0;
		  for (i=0x01; i<=0x80; i=i<<1){
				if ( (((regA & i) ^ (regB & i)) ^ f ) == i ){
					regC |= i; //1
				}else{
					regC &= (~i); //0	
				}
				if ( ((((regA & i) ^ (regB & i)) & f) == i) ||
				      (((regA & i) & (regB & i)) == i) ){
					f=i<<1; // marad�k
				}else{
					f=0x00;
				}
			}
			if (f != 0x00){
				 P64.regs.f |= 0x01; //1
			}else{
				 P64.regs.f &= (~0x01); //0
			}
			return regC;
		}, 
		
		/*
		 * M�retez�s:
		 * reg - n�velend� regiszter neve ('a', 'b', 'c')
		 * meret - n�vel�s m�rete - 0x00-0x03
		 * mivel - mivel t�lts�k fel a regisztereket (0x00, 0x01, 0xFF)
		 */
		RESIZE:  function(reg, meret, mivel){ 
		  								
			var aktmeret = Math.pow(2,P64.regs[reg].t&0x03);
			var meretre = Math.pow(2,meret);
																						
			if ( meret > P64.MAX_REG_BYTES ){
				throw ("HIBA: t�lcsordul�s!");
			}else{							
				var ki;
				for (var i=(aktmeret+1); i<=meretre; i++){
					ki = "Reg"+reg;
					
					if ( mivel == 0x01 ){
						if (i == (aktmeret+1) ){
							P64.regs[reg]['r'+i] = 0x01;
							/* P64.printLog('b�v�t�s 0000 0001');*/
							ki += " "+mivel;
						}else{
							P64.regs[reg]['r'+i] = 0x00;
							/* P64.printLog('b�v�t�s 0000 0000'); */
							ki += " "+mivel;
						}
					
					}else if ( mivel == 0xFF ){
						/* P64.printLog('b�v�t�s 1111 1111'); */
						ki += " "+mivel;
						P64.regs[reg]['r'+i] = 0xFF;
								
					}else if ( mivel == 0x00 ){
						/* P64.printLog('b�v�t�s 0000 0000'); */
						ki += " "+mivel;
						P64.regs[reg]['r'+i] = 0x00;	
							
					}else if ( mivel == 0xFE ){
						if (i == (aktmeret+1) ){
							P64.regs[reg]['r'+i] = 0xFE;
							/* P64.printLog('b�v�t�s 1111 1110'); */
							ki += " "+mivel;
						}else{
							P64.regs[reg]['r'+i] = 0xFF;
							/* P64.printLog('b�v�t�s 1111 1111'); */
							ki += " "+mivel;
						}
					}
					P64.regs[reg].t += meret-(P64.regs[reg].t&0x03);
				}
				P64.printLog(ki);
			}
		},
		
		/* Kisebb regiszter */ 
		LOWER_REG: function(a,b){
		                      
		  var minreg = Math.pow(2,Math.min(P64.regs[a].t&0x03,P64.regs[b].t&0x03));
		  if ( (P64.regs[a].t&0x03) != (P64.regs[b].t&0x03) ){
				/*nem azonos m�ret */
				var kisebb;
				if ( (P64.regs[a].t&0x03) < (P64.regs[b].t&0x03) ){
					kisebb = a;
				}else{
					kisebb = b;
				}
				var beszur;
			  if ( ((P64.regs[kisebb].t&0x04) == 0x04) && (P64.regs[kisebb]['r'+minreg]&0x80) == 0x80 ){
					beszur = 0xFF;
				}else{
					beszur = 0x00;
				}
														
				P64.mnemonics.RESIZE(kisebb,Math.max(P64.regs[a].t&0x03,P64.regs[b].t&0x03),beszur);
			}  
												
		},
		 
		/* Kivon�s */											
	  SUB: function(regA,regB){
		  var i,f=(P64.regs.f&0x01),regC=0;
		  for (i=0x01; i<=0x80; i=i<<1){
				if ( ( (regA & i) ^ ((regB & i) ^ f) ) == i ){
					regC |= i; //1
				}else{
					regC &= (~i); //0	
				}
				if ( (((~(regA & i)) & ((regB & i) ^ f)) == i) ||
				     ((f & (regB & i)) == i) ){
					f=i<<1; //marad�k
				}else{
			    f=0x00;
				}
			}
			if (f != 0x00){
				P64.regs.f |= 0x01; //1
			}else{
				P64.regs.f &= (~0x01); //0
			}
		                     
			return regC;
		},
		
		/* El�jeles a regiszter */										
		ISSIGNED: function(reg){
		  /* el�jeles? */
			if ( (P64.regs[reg].t&0x04) == 0x04 ){
				return true;
			}else{
				return false;
			}
		},
		
		/* Negat�v �rt�k van a regiszterben? */
		ISMINUS: function(reg){
		  /* pozitiv? */
			if ( P64.mnemonics.ISSIGNED(reg) && ( (P64.regs[reg]['r'+Math.pow(2,P64.regs[reg].t&0x03)]&0x80) == 0x80 ) ){
				return true;
			}else{
				return false;
			}
		},
		
		/* Regiszteren tal�lhat� �rt�k eltol�sa bitenk�nt balra x-szer */ 
		SHIFTL_X: function(reg,x){
		  /* bitenk�nti eltol�s balra */
			var maxreg = Math.pow(2,P64.regs[reg].t&0x03);
													
			for( var i=1; i<=x; i++){
				P64.mnemonics.SHIFTL(reg);
			}
		},
		
		/* Regiszterben tal�lhat� �rt�k eltol�sa bitenk�nt */ 
	  SHIFTL: function(reg){
		  /* bitenk�nti eltol�s balra */
		  var maxreg = Math.pow(2,P64.regs[reg].t&0x03);
													
		  for( var i=maxreg; i>=1; i--){
			  for( var j=0x80; j>=0x01; j=j>>1){
				  /* 1 */
				  if ((P64.regs[reg]['r'+i] & j) == j){
					  /* els� bit */
					  if (i==maxreg && j==0x80){
						  /* b�v�t�s */
						  P64.mnemonics.RESIZE(reg,(P64.regs[reg].t&0x03)+1,"0x01");
					  }else if (i != maxreg && j==0x80){
					  	P64.regs[reg]['r'+(i+1)] |= 0x01;
					  }else{
						  P64.regs[reg]['r'+i] |= (j<<1);
					  }
				  /* 0	*/
				  }else{
					  if(i != maxreg && j==0x80){
					  	P64.regs[reg]['r'+(i+1)] &= (~0x01);
					  }else if( j < 0x80 ){
					  	P64.regs[reg]['r'+i] &= (~(j<<1));
					  }
				  }
			  }
		  }
		  P64.regs[reg]['r'+'1'] &= (~0x01);
	  }


	},
	 
	map: []
	 
};
 
P64.map = [
  /* Beolvas� utas�t�sok */
  P64.mnemonics.LDA_U8B, P64.mnemonics.LDA_U16W, P64.mnemonics.LDA_U32W, P64.mnemonics.NOP,
	P64.mnemonics.LDA_S8B, P64.mnemonics.LDA_S16W, P64.mnemonics.LDA_S32W, P64.mnemonics.NOP,
	
  P64.mnemonics.LDB_U8B, P64.mnemonics.LDB_U16W, P64.mnemonics.LDB_U32W, P64.mnemonics.NOP,
	P64.mnemonics.LDB_S8B, P64.mnemonics.LDB_S16W, P64.mnemonics.LDB_S32W, P64.mnemonics.NOP,
	
	P64.mnemonics.LDA_H_U8B, P64.mnemonics.LDA_H_U16W, P64.mnemonics.LDA_H_U32W, P64.mnemonics.NOP,
	P64.mnemonics.LDA_H_S8B, P64.mnemonics.LDA_H_S16W, P64.mnemonics.LDA_H_S32W, P64.mnemonics.NOP,
	
	P64.mnemonics.LDB_H_U8B, P64.mnemonics.LDB_H_U16W, P64.mnemonics.LDB_H_U32W, P64.mnemonics.NOP,
	P64.mnemonics.LDB_H_S8B, P64.mnemonics.LDB_H_S16W, P64.mnemonics.LDB_H_S32W, P64.mnemonics.NOP,
	
	P64.mnemonics.LDH_U16W,
	
	P64.mnemonics.LDA_STACK, P64.mnemonics.LDB_STACK, 
	
	/* Aritmetikai m�veletek */
	P64.mnemonics.ADDA_B, P64.mnemonics.SUBA_B, P64.mnemonics.MULA_B,
	
	/* Ugr�s */
	P64.mnemonics.JMP,
	
	/* Ki�rat�s */
	P64.mnemonics.PRINTA_B,
	
	/* �sszehasonl�t�s */
	P64.mnemonics.CMP_EQ, P64.mnemonics.CMP_NE, P64.mnemonics.CMP_L,
	
	/* Mem�ri�ba �r�s */
	P64.mnemonics.STACKA, P64.mnemonics.STACKC,
	P64.mnemonics.STRA_H_8B
	
];
 