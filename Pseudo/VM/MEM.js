/**
 * Virtu�lis mem�ria
 *
 * @author Edem
 * @version 1.0
 */
 
MEM = {

  LOG_ON: true,
  cleanMemory: false,
	
  memory: [],
	
	/* mem�rai inicializ�l�sa */
	memoryClear: function(){
		for(var i=0; i<0xFFFF; i++){
		  if (MEM.cleanMemory){
			  MEM.memory[i] = 0;
			}else{
			  MEM.memory[i] = Math.floor(Math.random()*0xFF);
			}
		}
		
		/* kit�ntetett mem�riater�let a ford�tand� k�d kezdet�t tartalmazza
		   0-1 */
		MEM.Wrt16W(0,0x0646);
		/* kit�ntetett mem�riater�let a ford�tand� k�d v�g�t tartalmazza
		   2-3 */
		MEM.Wrt16W(2,0x0651);
		/* kit�ntetett mem�riater�let a kijelz�nek: kurzor 2b�jt + 20*80*1 b�jt 
		   4-1605 */
		MEM.Wrt16W(4,0x0000); 
	},
	
	/* log */
	printLog: function(mit){
	  if (COM.LOG_ON && MEM.LOG_ON){
	    document.getElementById('log').innerHTML += "MEM: "+mit+"<br>";
		  document.getElementById('log').scrollTop=document.getElementById('log').scrollHeight;
		}
	},
	
	/* mem�ria olvas� fv-ek */
	Read8B: function(address){
	  if ( address < 0x0004 || address > 0x0645)
	    MEM.printLog('ReadMemory From '+address+' - '+MEM.memory[address]);
		
	  return MEM.memory[address];
	},
	Read16W: function(address){
	  return MEM.memory[address]+(MEM.memory[address+1]<<8);
	},
	
	/* mem�ria �r� fv-ek */
	Wrt8B: function(address, value){
	  MEM.memory[address] = value;
	},
	Wrt16W: function(address, value){
	  MEM.Wrt8B(address, value&255);
		MEM.Wrt8B(address+1, value>>8);
	}

};